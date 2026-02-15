import Link from "next/link";
import { Plus, Edit, Trash, MapPin, Star } from "lucide-react";
import { getHotels, deleteHotel, restoreHotel, permanentlyDeleteHotel } from "@/app/actions/hotels";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function HotelsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { location, type, stars, view } = await searchParams;

    const isTrash = view === 'trash';

    const filters = {
        location: typeof location === 'string' ? location : undefined,
        type: typeof type === 'string' ? type : undefined,
        stars: typeof stars === 'string' ? parseInt(stars) : undefined,
        trash: isTrash,
    };

    const { hotels, error } = await getHotels(filters);

    if (error) {
        return <div className="text-red-500">Error loading hotels: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Hotel Inventory</h1>
                    <p className="text-muted-foreground">Manage hotels, houseboats, and homestays.</p>
                </div>
                <div className="flex gap-2">
                    <Link href={isTrash ? "/admin/hotels" : "/admin/hotels?view=trash"}>
                        <Button variant="outline" className={isTrash ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : ""}>
                            {isTrash ? "View Active Inventory" : "View Trash"}
                        </Button>
                    </Link>
                    {!isTrash && (
                        <Link href="/admin/hotels/new">
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                                <Plus className="w-4 h-4 mr-2" /> Add Property
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Filters could go here (search params link generation) */}

            <div className="bg-white dark:bg-card rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Property Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type / Rating</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rooms</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {hotels?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No properties found. Add your first hotel.
                                </td>
                            </tr>
                        ) : (
                            hotels?.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <div className="flex items-center gap-3">
                                            {hotel.image ? (
                                                <img src={hotel.image} alt={hotel.name} className="w-10 h-10 rounded-lg object-cover bg-muted" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 font-bold">
                                                    {hotel.name.charAt(0)}
                                                </div>
                                            )}
                                            {hotel.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" /> {hotel.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full w-fit">
                                                {hotel.type}
                                            </span>
                                            <div className="flex items-center text-yellow-500">
                                                {Array.from({ length: hotel.stars }).map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-current" />
                                                ))}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {hotel.rooms.length} Types
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2 text-muted-foreground">
                                            {isTrash ? (
                                                <>
                                                    <form action={async () => {
                                                        "use server";
                                                        await restoreHotel(hotel.id);
                                                    }}>
                                                        <Button type="submit" variant="outline" size="sm" className="h-8 hover:text-green-600 hover:border-green-200 hover:bg-green-50">
                                                            Restore
                                                        </Button>
                                                    </form>
                                                    <form action={async () => {
                                                        "use server";
                                                        await permanentlyDeleteHotel(hotel.id);
                                                    }}>
                                                        <Button type="submit" variant="outline" size="sm" className="h-8 text-red-600 border-red-200 hover:bg-red-50">
                                                            Delete Forever
                                                        </Button>
                                                    </form>
                                                </>
                                            ) : (
                                                <>
                                                    <Link href={`/admin/hotels/${hotel.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <form action={async () => {
                                                        "use server";
                                                        await deleteHotel(hotel.id);
                                                    }}>
                                                        <Button type="submit" variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600">
                                                            <Trash className="w-4 h-4" />
                                                        </Button>
                                                    </form>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
