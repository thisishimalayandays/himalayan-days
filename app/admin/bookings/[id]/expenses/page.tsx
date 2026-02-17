import { getExpenses } from "@/app/actions/expenses";
import { getBookingById } from "@/app/actions/crm";
import { ExpensesManager } from "@/components/admin/crm/expenses-manager";

export const metadata = {
    title: "Manage Expenses | Himalayan Days",
};

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ExpensesPage({ params }: PageProps) {
    // In Next.js 13/14 params is an object, in 15 it might be a promise.
    // Assuming standard 14 usage unless checked otherwise.
    // Safe way: await params if it's a promise (in 15), but TS might complain if types don't match.
    // Given the previous code didn't use await params, it's likely 14 or standard.

    // However, I will check package.json first. For now, writing this based on standard 14.
    const { id } = await params;
    const { success, expenses } = await getExpenses(id);
    const { data: booking } = await getBookingById(id);

    return (
        <div className="container mx-auto py-6 max-w-7xl animate-in fade-in duration-500">
            <ExpensesManager
                bookingId={id}
                initialExpenses={success && expenses ? expenses : []}
                customerName={booking?.customer?.name}
                bookingTitle={booking?.title}
            />
        </div>
    );
}
