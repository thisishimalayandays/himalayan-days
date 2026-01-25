import { getBookings } from "@/app/actions/crm";
import { BookingsTable } from "@/components/admin/crm/bookings-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Booking
                </Button>
            </div>

            <BookingsTable bookings={bookings || []} />
        </div>
    );
}
