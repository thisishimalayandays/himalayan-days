import { getCustomers } from "@/app/actions/crm";
import { CustomersTable } from "@/components/admin/crm/customers-table";
import { Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
    const { success, data: customers } = await getCustomers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage client database</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="w-6 h-6 text-primary" />
                </div>
            </div>

            <CustomersTable customers={customers || []} />
        </div>
    );
}
