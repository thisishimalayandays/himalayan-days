```javascript
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { createBooking, updateBooking } from "@/app/actions/crm";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

interface BookingDialogProps {
    mode?: 'create' | 'edit';
    booking?: any; // strict typing would be better but keeping it simple for now
    trigger?: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function BookingDialog({ mode = 'create', booking, trigger, open: controlledOpen, onOpenChange }: BookingDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<{ id: string, name: string, phone: string }[]>([]);

    // UI Logic State
    const [totalAmount, setTotalAmount] = useState(0);
    const [initialPayment, setInitialPayment] = useState(0);
    const balance = totalAmount - initialPayment;
    const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('new'); // Default to new as per user preference

    const router = useRouter();

    const isControlled = typeof controlledOpen !== 'undefined';
    const isOpen = isControlled ? controlledOpen : internalOpen;
    const setIsOpen = isControlled ? onOpenChange! : setInternalOpen;

    // Fetch customers when dialog opens
    useEffect(() => {
        if (isOpen) {
            getCustomers().then(res => {
                if (res.success && res.data) {
                    setCustomers(res.data);
                }
            });
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const travelDate = new Date(formData.get('travelDate') as string);

        const data: any = {
            title: formData.get('title') as string,
            travelDate: travelDate,
            duration: formData.get('duration') as string,
            totalAmount: parseFloat(formData.get('totalAmount') as string),
            adults: parseInt(formData.get('adults') as string) || 2,
            kids: parseInt(formData.get('kids') as string) || 0,
            initialPayment: parseFloat(formData.get('initialPayment') as string) || 0,
            paymentMode: formData.get('paymentMode') as string,
        };

        if (customerMode === 'existing') {
            data.customerId = formData.get('customerId') as string;
        } else {
            data.newCustomer = {
                name: formData.get('new_name') as string,
                phone: formData.get('new_phone') as string,
                email: formData.get('new_email') as string,
                address: formData.get('new_address') as string,
            };
        }

        let result;
        if (mode === 'create') {
            result = await createBooking(data);
        } else {
            // For edit mode, we might lock customer change or handle it carefully
            // But usually edit is on existing booking so just updating booking fields
            // Assuming updateBooking handles partial updates, but currently it expects formatted data
            // To keep it simple, we disable customer changing in Edit mode for now or just pass customerId if it's existing
            if (booking) {
                result = await updateBooking(booking.id, { ...data, customerId: booking.customerId });
            }
        }

        setLoading(false);

        if (result?.success) {
            toast.success(`Booking ${ mode === 'create' ? 'created' : 'updated' } successfully`);
            setIsOpen(false);
            router.refresh();
        } else {
            toast.error(result?.error || "Failed to save booking");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            {!trigger && mode === 'create' && (
                <DialogTrigger asChild>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Booking
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{mode === 'create' ? 'Create New Booking' : 'Edit Booking'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {mode === 'create' ? (
                        <div className="space-y-3">
                            <Label>Customer Details</Label>
                            <Tabs value={customerMode} onValueChange={(v) => setCustomerMode(v as 'existing' | 'new')} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="new">New Customer</TabsTrigger>
                                    <TabsTrigger value="existing">Existing Customer</TabsTrigger>
                                </TabsList>
                                <TabsContent value="existing" className="pt-2">
                                    <Select name="customerId" required={customerMode === 'existing'} defaultValue={booking?.customerId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Search / Select Customer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {customers.map(c => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name} ({c.phone})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TabsContent>
                                <TabsContent value="new" className="space-y-4 pt-2 border rounded-md p-4 bg-muted/20">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new_name">Full Name</Label>
                                            <Input id="new_name" name="new_name" required={customerMode === 'new'} placeholder="Client Name" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new_phone">Phone</Label>
                                            <Input id="new_phone" name="new_phone" required={customerMode === 'new'} placeholder="Contact Number" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new_email">Email (Optional)</Label>
                                        <Input id="new_email" name="new_email" type="email" placeholder="client@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                         <Label htmlFor="new_address">Address (Optional)</Label>
                                         <Textarea id="new_address" name="new_address" placeholder="Address..." className="h-20" />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : (
                        <div className="space-y-2">
                             <Label>Customer</Label>
                             <div className="p-2 border rounded bg-muted/50 text-sm font-medium">
                                 {booking?.customer?.name || "Existing Customer"}
                             </div>
                             <input type="hidden" name="customerId" value={booking?.customerId} />
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Trip Title</Label>
                            <Input id="title" name="title" required defaultValue={booking?.title} placeholder="e.g. Kashmir Family Vacation" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="travelDate">Travel Date</Label>
                                <Input 
                                    id="travelDate" 
                                    name="travelDate" 
                                    type="date" 
                                    required 
                                    defaultValue={booking?.travelDate ? new Date(booking.travelDate).toISOString().split('T')[0] : ''} 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input id="duration" name="duration" defaultValue={booking?.duration} placeholder="e.g. 5 Days" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="adults">Adults</Label>
                                <Input id="adults" name="adults" type="number" min="1" defaultValue={booking?.adults || 2} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="kids">Kids</Label>
                                <Input id="kids" name="kids" type="number" min="0" defaultValue={booking?.kids || 0} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="totalAmount">Total Cost (₹)</Label>
                                <Input 
                                    id="totalAmount" 
                                    name="totalAmount" 
                                    type="number" 
                                    min="0" 
                                    defaultValue={booking?.totalAmount} 
                                    required 
                                    onChange={(e) => setTotalAmount(parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </div>

                        {mode === 'create' && (
                            <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="initialPayment">Advance / Initial Payment (₹)</Label>
                                        <Input 
                                            id="initialPayment" 
                                            name="initialPayment" 
                                            type="number" 
                                            min="0" 
                                            placeholder="0"
                                            onChange={(e) => setInitialPayment(parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="paymentMode">Payment Mode</Label>
                                        <Select name="paymentMode" defaultValue="UPI" disabled={initialPayment <= 0}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UPI">UPI / GPay</SelectItem>
                                                <SelectItem value="CASH">Cash</SelectItem>
                                                <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium pt-2">
                                    <span>Balance Pending:</span>
                                    <span className={balance > 0 ? "text-orange-600" : "text-green-600"}>
                                        ₹{balance.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (mode === 'create' ? "Create Booking" : "Save Changes")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
