import { getBookingById } from "@/app/actions/crm";
import { PaymentForm } from "@/components/admin/crm/payment-form";
import { notFound } from "next/navigation";

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await getBookingById(id);

    if (!res.success || !res.data) {
        notFound();
    }

    return (
        <div className="h-[calc(100vh-4rem)] bg-background flex flex-col overflow-hidden">
            <div className="p-6 border-b bg-background shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Record Payment</h1>
                    <p className="text-muted-foreground">Add new transaction and view payment history for <span className="font-semibold text-foreground">{res.data.title}</span></p>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <PaymentForm booking={res.data} />
            </div>
        </div>
    );
}
