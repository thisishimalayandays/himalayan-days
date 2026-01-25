'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, User, Phone, Mail, MapPin, Calendar, Clock, CreditCard, Banknote, Users, Baby } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
            toast.success(`Booking ${mode === 'create' ? 'created' : 'updated'} successfully`);
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
                    <Button size="lg" className="shadow-md hover:shadow-lg transition-all">
                        <Plus className="w-5 h-5 mr-2" />
                        New Booking
                    </Button>
                </DialogTrigger>
            )}

            <DialogContent className="max-w-5xl p-0 overflow-hidden gap-0">
                <div className="p-6 border-b bg-muted/10">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        {mode === 'create' ? <Plus className="w-6 h-6 text-primary" /> : <Pencil className="w-6 h-6 text-primary" />}
                        {mode === 'create' ? 'Create New Booking' : 'Edit Booking Details'}
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col h-[600px]">
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
                        {/* Left Column: Customer (5 cols) */}
                        <div className="lg:col-span-5 p-6 lg:p-8 border-r flex flex-col gap-8 overflow-y-auto bg-muted/5">
                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Guest Information
                                </h3>

                                {mode === 'create' ? (
                                    <Tabs value={customerMode} onValueChange={(v) => setCustomerMode(v as 'existing' | 'new')} className="w-full">
                                        <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted/50 p-1 rounded-xl">
                                            <TabsTrigger value="new" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">New Profile</TabsTrigger>
                                            <TabsTrigger value="existing" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Existing</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="existing" className="space-y-6">
                                            <div className="space-y-3">
                                                <Label className="text-sm font-medium text-muted-foreground">Search Customer</Label>
                                                <Select name="customerId" required={customerMode === 'existing'} defaultValue={booking?.customerId}>
                                                    <SelectTrigger className="h-12 border-muted-foreground/20 focus:ring-0 focus:border-primary bg-white">
                                                        <SelectValue placeholder="Select from database..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {customers.map(c => (
                                                            <SelectItem key={c.id} value={c.id}>
                                                                {c.name} ({c.phone})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="new" className="space-y-5">
                                            <div className="space-y-5">
                                                <div className="relative group">
                                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                    <Input id="new_name" name="new_name" required={customerMode === 'new'} placeholder="Full Name" className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary bg-white transition-all" />
                                                </div>
                                                <div className="relative group">
                                                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                    <Input id="new_phone" name="new_phone" required={customerMode === 'new'} placeholder="Phone Number" className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary bg-white transition-all" />
                                                </div>
                                                <div className="relative group">
                                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                    <Input id="new_email" name="new_email" type="email" placeholder="Email Address" className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary bg-white transition-all" />
                                                </div>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                    <Textarea id="new_address" name="new_address" placeholder="Residential Address" className="pl-10 py-3 resize-none min-h-[100px] border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary bg-white" />
                                                </div>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                ) : (
                                    <div className="p-6 border rounded-2xl bg-white shadow-sm flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 rounded-full">
                                            <User className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted-foreground font-medium mb-1">Customer</div>
                                            <div className="text-xl font-bold text-foreground">
                                                {booking?.customer?.name || "Existing Customer"}
                                            </div>
                                            <input type="hidden" name="customerId" value={booking?.customerId} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Trip & Pay (7 cols) */}
                        <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col gap-8 overflow-y-auto">
                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Trip Details
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title" className="text-muted-foreground text-xs uppercase font-semibold pl-1">Trip Title</Label>
                                        <Input id="title" name="title" required defaultValue={booking?.title} placeholder="e.g. Kashmir Family Vacation" className="text-lg font-medium h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Dates</Label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary" />
                                                <Input
                                                    id="travelDate"
                                                    name="travelDate"
                                                    type="date"
                                                    required
                                                    defaultValue={booking?.travelDate ? new Date(booking.travelDate).toISOString().split('T')[0] : ''}
                                                    className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Duration</Label>
                                            <div className="relative group">
                                                <Clock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary" />
                                                <Input id="duration" name="duration" defaultValue={booking?.duration} placeholder="e.g. 5 Days" className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Adults</Label>
                                            <div className="relative">
                                                <Input id="adults" name="adults" type="number" min="1" defaultValue={booking?.adults || 2} required className="h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary text-center font-medium" />
                                                <span className="absolute right-3 top-3.5 text-sm text-muted-foreground pointer-events-none">Pax</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Kids</Label>
                                            <div className="relative">
                                                <Input id="kids" name="kids" type="number" min="0" defaultValue={booking?.kids || 0} className="h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary text-center font-medium" />
                                                <span className="absolute right-3 top-3.5 text-sm text-muted-foreground pointer-events-none">Pax</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-green-600 text-xs uppercase font-bold pl-1">Total Cost</Label>
                                            <div className="relative group">
                                                <Banknote className="absolute left-3 top-3.5 h-5 w-5 text-green-600" />
                                                <Input
                                                    id="totalAmount"
                                                    name="totalAmount"
                                                    type="number"
                                                    min="0"
                                                    defaultValue={booking?.totalAmount}
                                                    required
                                                    className="pl-10 h-12 border-green-200 focus-visible:ring-0 focus-visible:border-green-500 font-bold text-green-700 bg-green-50/50"
                                                    onChange={(e) => setTotalAmount(parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {mode === 'create' && (
                                <div className="mt-auto pt-6 border-t border-dashed">
                                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" /> Payment Status
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="initialPayment" className="text-muted-foreground text-xs uppercase font-semibold pl-1">Advance Amount</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-3.5 text-muted-foreground font-medium">₹</span>
                                                    <Input
                                                        id="initialPayment"
                                                        name="initialPayment"
                                                        type="number"
                                                        min="0"
                                                        placeholder="0"
                                                        className="pl-8 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary font-medium"
                                                        onChange={(e) => setInitialPayment(parseInt(e.target.value) || 0)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Select name="paymentMode" defaultValue="UPI" disabled={initialPayment <= 0}>
                                                    <SelectTrigger className="h-12 border-muted-foreground/20">
                                                        <SelectValue placeholder="Payment Mode" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="UPI">UPI / GPay / PhonePe</SelectItem>
                                                        <SelectItem value="CASH">Cash</SelectItem>
                                                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                                                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="bg-muted/10 rounded-2xl p-6 flex flex-col items-end justify-center border border-dashed">
                                            <span className="text-sm font-medium text-muted-foreground mb-1">Balance Pending</span>
                                            <div className={`text-3xl font-bold tracking-tight ${balance > 0 ? "text-orange-600" : "text-green-600"}`}>
                                                ₹{balance.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 border-t bg-white flex justify-end gap-3 z-10">
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="h-12 px-6">Cancel</Button>
                        <Button type="submit" disabled={loading} className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                            {loading ? "Processing..." : (mode === 'create' ? "Confirm Booking" : "Save Changes")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
