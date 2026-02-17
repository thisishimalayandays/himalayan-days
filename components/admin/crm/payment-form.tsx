'use client';

import { useState, useMemo, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPayment, deletePayment, updatePayment } from "@/app/actions/crm";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Pencil, Trash2, X } from "lucide-react";
import Link from 'next/link';
import { format } from "date-fns";

interface Payment {
    id: string;
    amount: number;
    date: Date;
    method: string;
    notes?: string | null;
}

interface Booking {
    id: string;
    title: string;
    totalAmount: number;
    payments: Payment[];
    customer?: {
        name: string;
    };
}

interface PaymentFormProps {
    booking: Booking;
}

export function PaymentForm({ booking }: PaymentFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("UPI");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [notes, setNotes] = useState("");

    const totalPaid = useMemo(() => booking.payments.reduce((sum, p) => sum + p.amount, 0), [booking.payments]);
    const currentBalance = booking.totalAmount - totalPaid;

    const handleEdit = (payment: Payment) => {
        setEditingId(payment.id);
        setAmount(payment.amount.toString());
        setMethod(payment.method);
        setDate(new Date(payment.date).toISOString().split('T')[0]);
        setNotes(payment.notes || "");
        toast.info("Editing payment...");
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setAmount("");
        setMethod("UPI");
        setDate(new Date().toISOString().split('T')[0]);
        setNotes("");
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this payment?")) {
            startTransition(async () => {
                const res = await deletePayment(id);
                if (res.success) {
                    toast.success("Payment deleted");
                } else {
                    toast.error("Failed to delete payment");
                }
            });
        }
    };

    const handleSubmit = () => {
        if (!amount || !date) {
            toast.error("Please fill in amount and date");
            return;
        }

        startTransition(async () => {
            if (editingId) {
                const res = await updatePayment(editingId, {
                    amount: parseFloat(amount),
                    method,
                    date: new Date(date),
                    notes,
                });

                if (res.success) {
                    toast.success("Payment updated");
                    handleCancelEdit();
                } else {
                    toast.error("Failed to update payment");
                }
            } else {
                const data = {
                    bookingId: booking.id,
                    amount: parseFloat(amount),
                    method,
                    date: new Date(date),
                    notes,
                };

                const result = await addPayment(data);

                if (result.success) {
                    toast.success("Payment recorded");
                    setAmount("");
                    setNotes("");
                } else {
                    toast.error(result.error || "Failed to record payment");
                }
            }
        });
    };

    return (
        <div className="space-y-8 container mx-auto py-6 max-w-7xl animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Record Payment</h2>
                    <p className="text-muted-foreground">
                        {booking.customer?.name ? `${booking.customer.name} • ` : ''}{booking.title}
                    </p>
                </div>
                <Link href="/admin/bookings">
                    <Button variant="outline" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Bookings
                    </Button>
                </Link>
            </div>

            <div className="space-y-8 py-4">
                {/* Summary Section */}
                <div className="flex items-center justify-between bg-muted/30 p-6 rounded-xl border border-border/50">
                    <div className="flex items-baseline gap-3">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Paid</div>
                        <div className="text-4xl font-bold tracking-tight text-green-600">₹{totalPaid.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground ml-2">
                            of ₹{booking.totalAmount.toLocaleString()}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Balance</div>
                            <div className={`text-xl font-bold ${currentBalance > 0 ? "text-orange-600" : "text-green-600"}`}>
                                ₹{currentBalance.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add Payment Form */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2">
                        <div className="flex items-center gap-2">
                            {editingId ? <Pencil className="w-4 h-4 text-orange-500" /> : <Plus className="w-4 h-4 text-primary" />}
                            <h4 className="text-sm font-semibold text-foreground">
                                {editingId ? "Edit Payment" : "New Payment"}
                            </h4>
                        </div>
                        {editingId && (
                            <Button variant="ghost" size="sm" onClick={handleCancelEdit} className="h-6 text-xs text-muted-foreground">
                                <X className="w-3 h-3 mr-1" /> Cancel
                            </Button>
                        )}
                    </div>

                    <div className="p-6 bg-card border rounded-xl shadow-sm space-y-6 md:space-y-0 md:flex md:items-end md:gap-6">
                        <div className="w-[180px] space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-muted-foreground text-xs">₹</span>
                                <Input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    className="h-10 pl-6 bg-background font-medium"
                                />
                            </div>
                        </div>

                        <div className="w-[200px] space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Payment Mode</Label>
                            <Select value={method} onValueChange={setMethod}>
                                <SelectTrigger className="h-10 bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="UPI">UPI / GPay / PhonePe</SelectItem>
                                    <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                    <SelectItem value="CASH">Cash</SelectItem>
                                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                                    <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="w-[160px] space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">Date</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-10 text-xs bg-background"
                            />
                        </div>

                        <div className="flex-1 space-y-2 min-w-[200px]">
                            <Label className="text-xs font-medium text-muted-foreground">Reference / Notes</Label>
                            <Input
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Transaction ID..."
                                className="h-10 bg-background"
                            />
                        </div>

                        <div className="pb-[1px]">
                            <Button
                                className={`h-10 px-6 ${editingId ? "bg-orange-600 hover:bg-orange-700" : ""}`}
                                onClick={handleSubmit}
                                disabled={isPending}
                            >
                                {isPending ? (editingId ? "Updating..." : "Saving...") : (editingId ? "Update Payment" : "Record Payment")}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="border rounded-xl overflow-hidden shadow-sm bg-card">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="py-4">Date</TableHead>
                                <TableHead className="py-4">Method</TableHead>
                                <TableHead className="py-4">Reference / Notes</TableHead>
                                <TableHead className="text-right py-4">Amount</TableHead>
                                <TableHead className="w-[100px] py-4"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {booking.payments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No payments recorded yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                booking.payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell className="py-4">
                                            {format(new Date(payment.date), "dd MMM yyyy")}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <Badge variant="outline" className="font-normal">{payment.method}</Badge>
                                        </TableCell>
                                        <TableCell className="py-4 text-muted-foreground">
                                            {payment.notes || '-'}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-600 py-4">
                                            ₹{payment.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                                    onClick={() => handleEdit(payment)}
                                                    disabled={isPending}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50"
                                                    onClick={() => handleDelete(payment.id)}
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
