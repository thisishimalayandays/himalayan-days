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
        <PaymentForm booking={res.data} />
    );
}
