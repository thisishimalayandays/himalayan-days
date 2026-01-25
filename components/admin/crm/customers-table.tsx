'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, MapPin, Trash2, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteCustomer } from "@/app/actions/crm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

interface Customer {
    id: string;
    name: string;
    email?: string | null;
    phone: string;
    address?: string | null;
    createdAt: Date;
    bookings: { id: string; status: string; totalAmount: number }[];
}

export function CustomersTable({ customers }: { customers: Customer[] }) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    );

    const handleDelete = async () => {
        if (!deleteId) return;

        const res = await deleteCustomer(deleteId);
        if (res.success) {
            toast.success("Customer deleted successfully");
            setDeleteId(null);
            router.refresh(); // Refresh to update list
        } else {
            toast.error(res.error || "Failed to delete customer. They may have active bookings.");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 max-w-sm">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, phone or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-10"
                />
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>Bookings</TableHead>
                                <TableHead>Total Spent</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCustomers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredCustomers.map((customer) => {
                                    const totalSpent = customer.bookings.reduce((sum, b) => sum + b.totalAmount, 0);

                                    return (
                                        <TableRow key={customer.id}>
                                            <TableCell>
                                                <div className="font-medium">{customer.name}</div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {customer.address || "No address"}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {customer.phone}
                                                    </div>
                                                    {customer.email && (
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                                            {customer.email}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal">
                                                    {customer.bookings.length} Bookings
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                ₹{totalSpent.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setDeleteId(customer.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this customer? This action cannot be undone.
                            If the customer has existing bookings, you must delete those bookings first.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
