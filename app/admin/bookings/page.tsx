import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getBookings } from "@/app/actions/crm";
import { BookingsTable } from "@/components/admin/crm/bookings-table";

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
    const { success, data: bookings } = await getBookings();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
                    <p className="text-muted-foreground">Manage trips and reservations</p>
                </div>
                <Link href="/admin/bookings/new">
                    <Button size="lg" className="shadow-md hover:shadow-lg transition-all">
                        <Plus className="w-5 h-5 mr-2" />
                        New Booking
                    </Button>
                </Link>
            </div>

            <BookingsTable bookings={bookings || []} />
        </div>
    );
}
