import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, LayoutList } from "lucide-react";
import { getBookings, getTrashedBookings } from "@/app/actions/crm";
import { BookingsTable } from "@/components/admin/crm/bookings-table";

export const dynamic = 'force-dynamic';

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
    const { view } = await searchParams;
    const isTrash = view === 'trash';

    // Fetch data based on view
    const { success, data: bookings } = isTrash ? await getTrashedBookings() : await getBookings();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bookings {isTrash && <span className="text-red-500">(Trash)</span>}</h2>
                    <p className="text-muted-foreground">{isTrash ? "Deleted bookings (auto-removed after 60 days)" : "Manage trips and reservations"}</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-muted p-1 rounded-lg flex items-center">
                        <Link href="/admin/bookings">
                            <Button variant={!isTrash ? "secondary" : "ghost"} size="sm">
                                <LayoutList className="w-4 h-4 mr-2" /> All
                            </Button>
                        </Link>
                        <Link href="/admin/bookings?view=trash">
                            <Button variant={isTrash ? "destructive" : "ghost"} size="sm" className={isTrash ? "bg-red-100 text-red-900 hover:bg-red-200" : ""}>
                                <Trash2 className="w-4 h-4 mr-2" /> Trash
                            </Button>
                        </Link>
                    </div>
                    {!isTrash && (
                        <Link href="/admin/bookings/new">
                            <Button size="lg" className="shadow-md hover:shadow-lg transition-all ml-4">
                                <Plus className="w-5 h-5 mr-2" />
                                New Booking
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            <BookingsTable bookings={bookings || []} isTrash={isTrash} />
        </div>
    );
}
