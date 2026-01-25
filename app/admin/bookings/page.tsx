import { getBookings } from "@/app/actions/crm";
import { CreateBookingDialog } from "@/components/admin/crm/create-booking-dialog";
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
                <CreateBookingDialog />
            </div>

            <BookingsTable bookings={bookings || []} />
        </div>
    );
}
