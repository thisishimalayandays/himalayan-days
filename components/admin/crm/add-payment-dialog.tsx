'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addPayment } from "@/app/actions/crm";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, CheckCircle, Clock, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
}

interface AddPaymentDialogProps {
    booking: Booking;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddPaymentDialog({ booking, open, onOpenChange }: AddPaymentDialogProps) {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState<number>(0);
    const router = useRouter();

    const totalPaid = useMemo(() => booking.payments.reduce((sum, p) => sum + p.amount, 0), [booking.payments]);
    const currentBalance = booking.totalAmount - totalPaid;
    const remainingAfterPayment = currentBalance - (amount || 0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            bookingId: booking.id,
            amount: parseFloat(formData.get('amount') as string),
            method: formData.get('method') as string,
            date: new Date(formData.get('date') as string),
            notes: formData.get('notes') as string,
        };

        const result = await addPayment(data);
        setLoading(false);

        if (result.success) {
            toast.success("Payment recorded successfully");
            onOpenChange(false);
            setAmount(0);
            router.refresh();
        } else {
            toast.error(result.error || "Failed to record payment");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl overflow-hidden p-0 gap-0">
                <div className="p-6 border-b bg-muted/10">
                    <DialogTitle className="text-xl font-bold flex flex-col gap-1">
                        <span>Record Payment</span>
                        <span className="text-sm font-normal text-muted-foreground">For: {booking.title}</span>
                    </DialogTitle>
                </div>

                <div className="flex flex-col md:flex-row h-[550px]">
                    {/* Left: Summary & History */}
                    <div className="w-full md:w-1/2 bg-muted/5 border-r p-6 flex flex-col gap-6 overflow-y-auto">
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Wallet className="w-4 h-4" /> Financial Summary
                            </h4>

                            <div className="grid grid-cols-1 gap-3">
                                <Card className="bg-background shadow-sm border-l-4 border-l-primary">
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium">Total Package Cost</p>
                                            <p className="text-lg font-bold">₹{booking.totalAmount.toLocaleString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-green-50/50 dark:bg-green-950/10 shadow-sm border-l-4 border-l-green-500 border-green-100 dark:border-green-900">
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-green-700 dark:text-green-400 font-medium">Total Paid</p>
                                            <p className="text-lg font-bold text-green-700 dark:text-green-400">₹{totalPaid.toLocaleString()}</p>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-green-600 opacity-50" />
                                    </CardContent>
                                </Card>
                                <Card className="bg-orange-50/50 dark:bg-orange-950/10 shadow-sm border-l-4 border-l-orange-500 border-orange-100 dark:border-orange-900">
                                    <CardContent className="p-4 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">Pending Balance</p>
                                            <p className="text-lg font-bold text-orange-700 dark:text-orange-400">₹{currentBalance.toLocaleString()}</p>
                                        </div>
                                        <Clock className="w-5 h-5 text-orange-600 opacity-50" />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-4">
                                <History className="w-4 h-4" /> Payment History
                            </h4>
                            <div className="space-y-3">
                                {booking.payments.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">No payments recorded yet.</p>
                                )}
                                {booking.payments.map((p) => (
                                    <div key={p.id} className="text-sm p-3 bg-white border rounded-lg shadow-sm flex justify-between items-center">
                                        <div>
                                            <div className="font-bold">₹{p.amount.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString()} • {p.method}</div>
                                        </div>
                                        <Badge variant="secondary" className="text-[10px]">{p.method}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
                        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-lg font-semibold">Amount to Pay (₹)</Label>
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        required
                                        placeholder="Enter amount"
                                        className="h-14 text-2xl font-bold text-green-700 border-green-200 focus-visible:ring-green-500"
                                        value={amount || ''}
                                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                                    />
                                    {amount > 0 && (
                                        <div className="text-sm text-muted-foreground text-right">
                                            New Balance will be: <span className={`font-bold ${remainingAfterPayment < 0 ? "text-green-600" : "text-orange-600"}`}>₹{remainingAfterPayment.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="method">Payment Mode</Label>
                                    <Select name="method" required defaultValue="UPI">
                                        <SelectTrigger className="h-12">
                                            <SelectValue placeholder="Select Mode" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="UPI">UPI / GPay / PhonePe</SelectItem>
                                            <SelectItem value="BANK_TRANSFER">Bank Transfer / NEFT</SelectItem>
                                            <SelectItem value="CASH">Cash</SelectItem>
                                            <SelectItem value="CHEQUE">Cheque</SelectItem>
                                            <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Payment Date</Label>
                                    <Input
                                        id="date"
                                        name="date"
                                        type="date"
                                        required
                                        className="h-12"
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes">Reference / Notes</Label>
                                    <Input id="notes" name="notes" placeholder="Transaction ID, etc." className="h-12" />
                                </div>
                            </div>

                            <div className="mt-auto pt-6 flex justify-end gap-3">
                                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading} className="px-8 text-base">
                                    {loading ? "Recording..." : "Save Payment"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
