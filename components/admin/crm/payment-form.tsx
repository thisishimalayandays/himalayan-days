'use client';

import { useState, useMemo } from 'react';
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
import { Wallet, CheckCircle, Clock, History, ArrowLeft, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Separator } from "@/components/ui/separator";

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

interface PaymentFormProps {
    booking: Booking;
}

export function PaymentForm({ booking }: PaymentFormProps) {
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
            setAmount(0);
            router.push('/admin/bookings');
            router.refresh();
        } else {
            toast.error(result.error || "Failed to record payment");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-background">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left: Summary & History */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-muted/10 rounded-2xl p-6 lg:p-8 space-y-6">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <Wallet className="w-4 h-4" /> Financial Summary
                            </h4>

                            <div className="grid grid-cols-1 gap-4">
                                <Card className="bg-background shadow-sm border-l-4 border-l-primary">
                                    <CardContent className="p-5 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Total Cost</p>
                                            <p className="text-2xl font-bold">₹{booking.totalAmount.toLocaleString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-green-50/50 dark:bg-green-950/10 shadow-sm border-l-4 border-l-green-500 border-green-100 dark:border-green-900">
                                    <CardContent className="p-5 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-green-700 dark:text-green-400 font-medium uppercase tracking-wider mb-1">Total Paid</p>
                                            <p className="text-2xl font-bold text-green-700 dark:text-green-400">₹{totalPaid.toLocaleString()}</p>
                                        </div>
                                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="bg-orange-50/50 dark:bg-orange-950/10 shadow-sm border-l-4 border-l-orange-500 border-orange-100 dark:border-orange-900">
                                    <CardContent className="p-5 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-orange-700 dark:text-orange-400 font-medium uppercase tracking-wider mb-1">Pending Balance</p>
                                            <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">₹{currentBalance.toLocaleString()}</p>
                                        </div>
                                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                                            <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <History className="w-4 h-4" /> Payment History
                            </h4>
                            <div className="space-y-3">
                                {booking.payments.length === 0 && (
                                    <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/5">
                                        <p className="text-muted-foreground text-sm">No payments recorded yet.</p>
                                    </div>
                                )}
                                {booking.payments.map((p) => (
                                    <div key={p.id} className="p-4 bg-white border rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                                        <div className="space-y-1">
                                            <div className="font-bold text-lg">₹{p.amount.toLocaleString()}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                <span>{new Date(p.date).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <Badge variant="outline" className="text-[10px] bg-muted/50 font-normal">{p.method}</Badge>
                                            </div>
                                        </div>
                                        {p.notes && (
                                            <div className="text-xs text-muted-foreground max-w-[150px] truncate text-right">
                                                {p.notes}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-primary" />
                                New Transaction Details
                            </h3>

                            <div className="grid gap-8 p-8 border rounded-2xl bg-white shadow-sm">
                                <div className="space-y-4">
                                    <Label htmlFor="amount" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Amount to Pay</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-4 text-2xl font-bold text-muted-foreground">₹</span>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            required
                                            placeholder="0"
                                            className="pl-10 h-16 text-3xl font-bold text-green-700 bg-green-50/30 border-green-200 focus-visible:ring-green-500 rounded-xl"
                                            value={amount || ''}
                                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                                        />
                                    </div>
                                    {amount > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-muted/10 rounded-lg">
                                            <span className="text-sm text-muted-foreground">Balance after payment:</span>
                                            <span className={`font-bold text-lg ${remainingAfterPayment < 0 ? "text-green-600" : "text-orange-600"}`}>
                                                ₹{remainingAfterPayment.toLocaleString()}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label htmlFor="method" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Payment Mode</Label>
                                        <Select name="method" required defaultValue="UPI">
                                            <SelectTrigger className="h-12 text-base">
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

                                    <div className="space-y-3">
                                        <Label htmlFor="date" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Payment Date</Label>
                                        <Input
                                            id="date"
                                            name="date"
                                            type="date"
                                            required
                                            className="h-12 text-base"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="notes" className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Reference / Notes</Label>
                                    <Input id="notes" name="notes" placeholder="e.g. Transaction ID: UPI/12345/..." className="h-12 text-base" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Action Bar */}
            <div className="p-4 bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-10 flex justify-between items-center px-8">
                <Link href="/admin/bookings">
                    <Button type="button" variant="ghost" className="h-12 px-6 hover:bg-muted">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Bookings
                    </Button>
                </Link>
                <Button type="submit" disabled={loading} className="h-12 px-10 text-base shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all rounded-full min-w-[200px]">
                    {loading ? "Processing..." : "Confirm Payment"}
                </Button>
            </div>
        </form>
    );
}
