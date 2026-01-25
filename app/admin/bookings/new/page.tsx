import { BookingForm } from "@/components/admin/crm/booking-form";

export default function NewBookingPage() {
    return (
        <div className="h-[calc(100vh-4rem)] bg-background flex flex-col overflow-hidden">
            <div className="p-6 border-b bg-background shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Create New Booking</h1>
                    <p className="text-muted-foreground">Enter trip details and guest information</p>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <BookingForm mode="create" />
            </div>
        </div>
    );
}
