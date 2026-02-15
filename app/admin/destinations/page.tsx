import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteDestination } from "@/app/actions/destinations";
import { Pencil, Trash, Plus } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DestinationsPage() {
    const session = await auth();
    const role = session?.user?.role || (session?.user?.email === 'sales@himalayandays.in' ? 'SALES' : 'ADMIN');

    if (role === 'SALES') {
        redirect("/admin");
    }

    const destinations = await prisma.destination.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Destinations</h1>
                    <p className="text-muted-foreground text-sm">Manage travel destinations</p>
                </div>
                <Link
                    href="/admin/destinations/new"
                    className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Destination
                </Link>
            </div>

            <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {destinations.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500 italic">
                                        No destinations found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                destinations.map((dest) => (
                                    <tr key={dest.id} className="hover:bg-muted/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
                                                <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-foreground font-medium">
                                            {dest.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-sm">
                                            {dest.slug}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center gap-3">
                                                <Link href={`/admin/destinations/${dest.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
                                                    <Pencil className="w-4 h-4" /> Edit
                                                </Link>
                                                <form action={async () => {
                                                    'use server';
                                                    await deleteDestination(dest.id);
                                                }}>
                                                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1">
                                                        <Trash className="w-4 h-4" /> Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-center text-xs text-gray-400">
                Showing {destinations.length} destinations
            </div>
        </div>
    );
}
