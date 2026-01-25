import { getCustomers } from "@/app/actions/crm";
import { CustomersTable } from "@/components/admin/crm/customers-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
    const { success, data: customers } = await getCustomers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage your client database</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Customer
                </Button>
            </div>

            <CustomersTable customers={customers || []} />
        </div>
    );
}
