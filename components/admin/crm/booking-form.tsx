'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, User, Phone, Mail, MapPin, Calendar, Clock, CreditCard, Banknote, Users, Baby, ArrowLeft } from "lucide-react";
import { createBooking, updateBooking, getCustomers } from "@/app/actions/crm";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BookingFormProps {
    mode?: 'create' | 'edit';
    booking?: any;
    onSuccess?: () => void;
}

export function BookingForm({ mode = 'create', booking, onSuccess }: BookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<{ id: string, name: string, phone: string }[]>([]);

    // UI Logic State
    const [totalAmount, setTotalAmount] = useState(booking?.totalAmount || 0);
    const [initialPayment, setInitialPayment] = useState(booking?.initialPayment || 0); // Note: Booking model might not have initialPayment strictly, typically payments are separate relation. But for "Create" flow helper it's fine.
    // Actually existing booking might have payments sum. For now assume create mode primarily or simple edit.

    const balance = totalAmount - initialPayment;
    const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('new');

    useEffect(() => {
        getCustomers().then(res => {
            if (res.success && res.data) {
                setCustomers(res.data);
            }
        });
    }, []);

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
            if (booking) {
                result = await updateBooking(booking.id, { ...data, customerId: booking.customerId });
            }
        }

        setLoading(false);

        if (result?.success) {
            toast.success(`Booking ${mode === 'create' ? 'created' : 'updated'} successfully`);
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/admin/bookings');
                router.refresh();
            }
        } else {
            toast.error(result?.error || "Failed to save booking");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full bg-background">
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Section: Context & Customer */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-muted/10 rounded-2xl p-6 lg:p-8 space-y-6">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4" /> Guest Information
                            </h3>

                            {mode === 'create' ? (
                                <Tabs value={customerMode} onValueChange={(v) => setCustomerMode(v as 'existing' | 'new')} className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-background/50 p-1 rounded-xl">
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
                                                <Input id="new_name" name="new_name" required={customerMode === 'new'} placeholder="Full Name" className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary bg-white transition-all shadow-sm" />
                                            </div>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                <Input id="new_phone" name="new_phone" required={customerMode === 'new'} placeholder="Phone Number" className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary bg-white transition-all shadow-sm" />
                                            </div>
                                            <div className="relative group">
                                                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                <Input id="new_email" name="new_email" type="email" placeholder="Email Address" className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary bg-white transition-all shadow-sm" />
                                            </div>
                                            <div className="relative group">
                                                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                <Textarea id="new_address" name="new_address" placeholder="Residential Address" className="pl-10 py-3 resize-none min-h-[100px] border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary bg-white shadow-sm" />
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

                    {/* Right Section: Trip Details */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> Trip Details
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-muted-foreground text-xs uppercase font-semibold pl-1">Trip Title</Label>
                                    <Input id="title" name="title" required defaultValue={booking?.title} placeholder="e.g. Kashmir Family Vacation" className="text-lg font-medium h-14 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary shadow-sm" />
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
                                                className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Duration</Label>
                                        <div className="relative group">
                                            <Clock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary" />
                                            <Input id="duration" name="duration" defaultValue={booking?.duration} placeholder="e.g. 5 Days" className="pl-10 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary shadow-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Adults</Label>
                                        <div className="relative">
                                            <Input id="adults" name="adults" type="number" min="1" defaultValue={booking?.adults || 2} required className="h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary text-center font-medium shadow-sm" />
                                            <span className="absolute right-3 top-3.5 text-sm text-muted-foreground pointer-events-none">Pax</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Kids</Label>
                                        <div className="relative">
                                            <Input id="kids" name="kids" type="number" min="0" defaultValue={booking?.kids || 0} className="h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary text-center font-medium shadow-sm" />
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
                                                className="pl-10 h-12 border-green-200 focus-visible:ring-0 focus-visible:border-green-500 font-bold text-green-700 bg-green-50/50 shadow-sm"
                                                onChange={(e) => setTotalAmount(parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {mode === 'create' && (
                            <div className="pt-8 border-t border-dashed">
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
                                                    className="pl-8 h-12 border-muted-foreground/20 focus-visible:ring-0 focus-visible:border-primary font-medium shadow-sm"
                                                    onChange={(e) => setInitialPayment(parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Select name="paymentMode" defaultValue="UPI" disabled={initialPayment <= 0}>
                                                <SelectTrigger className="h-12 border-muted-foreground/20 shadow-sm">
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

                                    <div className="bg-muted/10 rounded-2xl p-6 flex flex-col items-end justify-center border border-dashed hover:bg-muted/20 transition-colors">
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
            </div>

            {/* Footer Action Bar */}
            <div className="p-4 bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-10 flex justify-between items-center px-8">
                <Link href="/admin/bookings">
                    <Button type="button" variant="ghost" className="h-12 px-6 hover:bg-muted">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                </Link>
                <Button type="submit" disabled={loading} className="h-12 px-10 text-base shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all rounded-full">
                    {loading ? "Processing..." : (mode === 'create' ? "Confirm Booking" : "Save Changes")}
                </Button>
            </div>
        </form>
    );
}
