import { getBookingById } from "@/app/actions/crm";
import { BookingForm } from "@/components/admin/crm/booking-form";
import { notFound } from "next/navigation";

export default async function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await getBookingById(id);

    if (!res.success || !res.data) {
        notFound();
    }

    return (
        <div className="h-[calc(100vh-4rem)] bg-background flex flex-col overflow-hidden">
            <div className="p-6 border-b bg-background shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Booking</h1>
                    <p className="text-muted-foreground">Update trip details and preferences</p>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <BookingForm mode="edit" booking={res.data} />
            </div>
        </div>
    );
}
