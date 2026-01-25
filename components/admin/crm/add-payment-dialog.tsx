'use client';

import { useState } from 'react';
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

interface AddPaymentDialogProps {
    bookingId: string;
    bookingTitle: string;
    balance: number;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddPaymentDialog({ bookingId, bookingTitle, balance, open, onOpenChange }: AddPaymentDialogProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            bookingId,
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
            router.refresh();
        } else {
            toast.error(result.error || "Failed to record payment");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Record Payment</DialogTitle>
                    <div className="text-sm text-muted-foreground">
                        For: {bookingTitle}<br />
                        Current Balance: <span className="font-semibold text-orange-600">₹{balance.toLocaleString()}</span>
                    </div>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (₹)</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            max={balance > 0 ? balance : undefined} // Optional constraint
                            required
                            placeholder="Enter amount"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="method">Payment Mode</Label>
                        <Select name="method" required defaultValue="UPI">
                            <SelectTrigger>
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
                            defaultValue={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes">Reference / Notes (Optional)</Label>
                        <Input id="notes" name="notes" placeholder="Transaction ID, etc." />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Recording..." : "Save Payment"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
