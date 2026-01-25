'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createBooking } from "@/app/actions/crm";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCustomers } from '@/app/actions/crm';

export function CreateBookingDialog() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<{ id: string, name: string, phone: string }[]>([]);
    const router = useRouter();

    // Fetch customers when dialog opens
    useEffect(() => {
        if (open) {
            getCustomers().then(res => {
                if (res.success && res.data) {
                    setCustomers(res.data);
                }
            });
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        // Basic calculation of travel date
        const travelDate = new Date(formData.get('travelDate') as string);

        const data = {
            customerId: formData.get('customerId') as string,
            title: formData.get('title') as string,
            travelDate: travelDate,
            duration: formData.get('duration') as string,
            totalAmount: parseFloat(formData.get('totalAmount') as string),
            adults: parseInt(formData.get('adults') as string) || 2,
            kids: parseInt(formData.get('kids') as string) || 0,
        };

        const result = await createBooking(data);
        setLoading(false);

        if (result.success) {
            toast.success("Booking created successfully");
            setOpen(false);
            router.refresh();
        } else {
            toast.error(result.error || "Failed to create booking");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Booking
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create New Booking</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="customerId">Customer</Label>
                        <Select name="customerId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {customers.map(c => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name} ({c.phone})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Can't find customer? Add them in the Customers tab first.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Trip Title</Label>
                        <Input id="title" name="title" required placeholder="e.g. Kashmir Family Vacation" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="travelDate">Travel Date</Label>
                            <Input id="travelDate" name="travelDate" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration</Label>
                            <Input id="duration" name="duration" placeholder="e.g. 5 Days" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="adults">Adults</Label>
                            <Input id="adults" name="adults" type="number" min="1" defaultValue="2" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="kids">Kids</Label>
                            <Input id="kids" name="kids" type="number" min="0" defaultValue="0" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalAmount">Total Cost (₹)</Label>
                            <Input id="totalAmount" name="totalAmount" type="number" min="0" required />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Booking"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
