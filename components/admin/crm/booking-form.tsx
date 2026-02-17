'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Removed
import { Plus, Pencil, User, Phone, Mail, MapPin, Calendar, Clock, CreditCard, Banknote, Users, Baby, ArrowLeft, Download, LayoutList } from "lucide-react";
import { createBooking, updateBooking, getCustomers } from "@/app/actions/crm";
import { getHotels } from "@/app/actions/hotels";
import { getTransports } from "@/app/actions/transport";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from "next/dynamic";
import { BookingPDF } from "./booking-pdf";
import { HotelCalculator, TransportCalculator, HotelItem, TransportItem } from "../../admin/calculator-components";

const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
        ssr: false,
        loading: () => <Button variant="ghost" disabled>Loading PDF...</Button>,
    }
);

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
    const [initialPayment, setInitialPayment] = useState(booking?.initialPayment || 0);
    const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('new');
    const [isEditingCustomer, setIsEditingCustomer] = useState(false); // NEW STATE

    // Quick Add State - REPLACED BY CALCULATOR STATE
    const [availableHotels, setAvailableHotels] = useState<any[]>([]);
    const [availableTransports, setAvailableTransports] = useState<any[]>([]);

    // Calculator State
    const [hotelItems, setHotelItems] = useState<HotelItem[]>([]);
    const [transportItems, setTransportItems] = useState<TransportItem[]>([]);
    const [travelDateState, setTravelDateState] = useState<Date>(booking?.travelDate ? new Date(booking.travelDate) : new Date());

    // Legacy/Fallback Text State (for backward compatibility or detailed notes)
    const [hotelInfo, setHotelInfo] = useState("");
    const [transportInfo, setTransportInfo] = useState("");

    // Create a derived total for display (optional, or to auto-fill totalAmount)
    const hotelTotal = hotelItems.reduce((acc, item) => acc + (item.rate * item.rooms * item.nights) + ((item.extraBedCount || 0) * (item.extraBedRate || 0) * item.nights), 0);
    const transportTotal = transportItems.reduce((acc, item) => acc + (item.rate * item.days), 0);
    const calculatorTotal = hotelTotal + transportTotal;

    const balance = totalAmount - initialPayment;

    // Load Initial Data
    useEffect(() => {
        if (booking?.hotelInfo) {
            try {
                const parsed = JSON.parse(booking.hotelInfo);
                if (Array.isArray(parsed)) {
                    setHotelItems(parsed);
                } else {
                    setHotelInfo(booking.hotelInfo);
                }
            } catch (e) {
                setHotelInfo(booking.hotelInfo);
            }
        }

        if (booking?.transportInfo) {
            try {
                const parsed = JSON.parse(booking.transportInfo);
                if (Array.isArray(parsed)) {
                    setTransportItems(parsed);
                } else {
                    setTransportInfo(booking.transportInfo);
                }
            } catch (e) {
                setTransportInfo(booking.transportInfo);
            }
        }
    }, [booking]);

    useEffect(() => {
        getCustomers().then(res => {
            if (res.success && res.data) {
                setCustomers(res.data);
            }
        });

        // Fetch Hotels & Transports
        getHotels().then(res => {
            if (res.success && res.hotels) setAvailableHotels(res.hotels);
        });
        getTransports().then(res => {
            if (res.success && res.transports) setAvailableTransports(res.transports);
        });
    }, []);

    // HYDRATION EFFECT: Backfill room names if missing
    useEffect(() => {
        if (availableHotels.length > 0 && hotelItems.length > 0) {
            let hasChanges = false;
            const updatedItems = hotelItems.map(item => {
                if (item.roomTypeId && !item.roomTypeName && !item.isCustom) {
                    const hotel = availableHotels.find((h: any) => h.id === item.hotelId);
                    if (hotel) {
                        const room = hotel.rooms.find((r: any) => r.id === item.roomTypeId);
                        if (room) {
                            hasChanges = true;
                            return { ...item, roomTypeName: room.name };
                        }
                    }
                }
                return item;
            });

            if (hasChanges) {
                setHotelItems(updatedItems);
            }
        }
    }, [availableHotels, hotelItems]);

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
            // Serialize Calculator Data
            hotelInfo: hotelItems.length > 0 ? JSON.stringify(hotelItems) : hotelInfo,
            transportInfo: transportItems.length > 0 ? JSON.stringify(transportItems) : transportInfo,
            mealPlan: formData.get('mealPlan') as string,
            notes: formData.get('notes') as string,
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
                <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* Left Section: Context & Customer */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-muted/10 rounded-2xl p-6 lg:p-8 space-y-6">
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4" /> Guest Information
                                </h3>

                                {mode === 'create' || isEditingCustomer ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-end gap-2">
                                            {mode === 'edit' && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsEditingCustomer(false)}
                                                >
                                                    Cancel Change
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary hover:text-primary/80 hover:bg-primary/5"
                                                onClick={() => setCustomerMode(customerMode === 'new' ? 'existing' : 'new')}
                                            >
                                                {customerMode === 'new' ? 'Select Existing Customer' : 'Create New Profile'}
                                            </Button>
                                        </div>

                                        {customerMode === 'existing' ? (
                                            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <Label className="text-sm font-medium text-muted-foreground">Search Customer</Label>
                                                <Select name="customerId" required={customerMode === 'existing'} defaultValue={booking?.customerId}>
                                                    <SelectTrigger className="h-12 border-input focus:ring-0 focus:border-primary bg-background">
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
                                        ) : (
                                            <div className="space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                {/* ... new customer inputs ... */}
                                                <div className="relative group">
                                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                    <Input id="new_name" name="new_name" required={customerMode === 'new'} placeholder="Full Name" className="pl-10 h-12 border-input focus-visible:ring-0 focus-visible:border-primary bg-background transition-all shadow-sm" />
                                                </div>
                                                <div className="relative group">
                                                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                    <Input id="new_phone" name="new_phone" required={customerMode === 'new'} placeholder="Phone Number" className="pl-10 h-12 border-input focus-visible:ring-0 focus-visible:border-primary bg-background transition-all shadow-sm" />
                                                </div>
                                                <div className="relative group">
                                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                    <Input id="new_email" name="new_email" type="email" placeholder="Email Address" className="pl-10 h-12 border-input focus-visible:ring-0 focus-visible:border-primary bg-background transition-all shadow-sm" />
                                                </div>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                                                    <Textarea id="new_address" name="new_address" placeholder="Residential Address" className="pl-10 py-3 resize-none min-h-[100px] border-input focus-visible:ring-0 focus-visible:border-primary bg-background shadow-sm" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-6 border border-border rounded-2xl bg-card shadow-sm flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
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
                                        <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditingCustomer(true)}>
                                            <Pencil className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Section: Basic Booking Details */}
                        <div className="lg:col-span-7 space-y-8">
                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Banknote className="w-4 h-4" /> Booking Details
                                </h3>

                                <div className="space-y-6">
                                    {/* Hidden Defaults */}
                                    {/* Guest Counts - Now Visible */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Adults</Label>
                                            <div className="relative group">
                                                <Users className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary z-10" />
                                                <Input
                                                    name="adults"
                                                    type="number"
                                                    min="1"
                                                    defaultValue={booking?.adults || 2}
                                                    required
                                                    className="pl-10 h-14 border-input focus:ring-0 focus:border-primary text-base font-medium shadow-sm bg-background"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Kids</Label>
                                            <div className="relative group">
                                                <Baby className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary z-10" />
                                                <Input
                                                    name="kids"
                                                    type="number"
                                                    min="0"
                                                    defaultValue={booking?.kids || 0}
                                                    className="pl-10 h-14 border-input focus:ring-0 focus:border-primary text-base font-medium shadow-sm bg-background"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Package Name</Label>
                                            <div className="relative group">
                                                <LayoutList className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary z-10" />
                                                <Input
                                                    name="title"
                                                    defaultValue={booking?.title}
                                                    // If we want auto-update, we might need state control, but defaultValue with key change or just let user type is safer.
                                                    // Actually, let's just make it required and let user type or select duration to fill it (via JS or just separate).
                                                    // Enhancing: Let's use state for title to sync with duration.
                                                    // But I need to add state to the component first.
                                                    // Since I cannot rewrite the whole component easily, I will just add the Input.
                                                    // User can type "5 Days Package".
                                                    required
                                                    placeholder="e.g. Kashmir Family Tour"
                                                    className="pl-10 h-14 border-input focus:ring-0 focus:border-primary text-base font-medium shadow-sm bg-background"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Duration</Label>
                                            <div className="relative group">
                                                <Clock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary z-10" />
                                                <Select name="duration" defaultValue={booking?.duration || "1 Day 0 Nights"} onValueChange={(val) => {
                                                    const PACKAGE_NAMES: Record<string, string> = {
                                                        "1 Days 0 Nights": "Srinagar Heritage Day Tour",
                                                        "2 Days 1 Nights": "Kashmir Quick Escape",
                                                        "3 Days 2 Nights": "Magical Kashmir Weekend",
                                                        "4 Days 3 Nights": "Luxury Kashmir Retreat",
                                                        "5 Days 4 Nights": "Heaven on Earth Experience",
                                                        "6 Days 5 Nights": "Royal Kashmir Expedition",
                                                        "7 Days 6 Nights": "Ultimate Kashmir Diaries",
                                                        "8 Days 7 Nights": "Grand Himalayan Odyssey",
                                                        "9 Days 8 Nights": "Mystic Kashmir Discovery",
                                                        "10 Days 9 Nights": "Kashmir Unveiled: The Full Circle",
                                                        "11 Days 10 Nights": "The Grand Kashmir Experience",
                                                        "12 Days 11 Nights": "Spectacular Kashmir & Ladakh Fusion",
                                                        "13 Days 12 Nights": "The Himalayan Dream: Complete Saga"
                                                    };

                                                    const titleInput = document.querySelector('input[name="title"]') as HTMLInputElement;
                                                    // Only auto-fill if the user hasn't typed a custom name (optional check), 
                                                    // or just aggressively help them. Given the request, I'll update it.
                                                    if (titleInput) {
                                                        titleInput.value = PACKAGE_NAMES[val] || `${val} Package`;
                                                    }
                                                }}>
                                                    <SelectTrigger className="pl-10 h-14 border-input focus:ring-0 focus:border-primary text-base font-medium shadow-sm bg-background">
                                                        <SelectValue placeholder="Select Duration" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 13 }, (_, i) => {
                                                            const days = i + 1;
                                                            const nights = days - 1;
                                                            const label = `${days} Days ${nights} Nights`;
                                                            return (
                                                                <SelectItem key={label} value={label}>
                                                                    {label}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Booking Date</Label>
                                            <div className="relative group">
                                                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground/50 group-focus-within:text-primary z-10 pointer-events-none" />
                                                <Input
                                                    id="travelDate"
                                                    name="travelDate"
                                                    type="date"
                                                    required
                                                    defaultValue={booking?.travelDate ? new Date(booking.travelDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                                                    className="pl-12 h-14 border-input focus-visible:ring-0 focus-visible:border-primary shadow-sm text-base bg-background w-full cursor-pointer"
                                                    onClick={(e) => {
                                                        try {
                                                            (e.target as HTMLInputElement).showPicker();
                                                        } catch (err) {
                                                            // Fallback
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const date = new Date(e.target.value);
                                                        if (!isNaN(date.getTime())) {
                                                            setTravelDateState(date);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-green-600 dark:text-green-400 text-xs uppercase font-bold pl-1">Total Amount</Label>

                                            </div>
                                            <div className="relative group">
                                                <Banknote className="absolute left-3 top-3.5 h-5 w-5 text-green-600 dark:text-green-400" />
                                                <Input
                                                    id="totalAmount"
                                                    name="totalAmount"
                                                    type="number"
                                                    min="0"
                                                    value={totalAmount}
                                                    required
                                                    className="pl-10 h-14 border-green-200 dark:border-green-800 focus-visible:ring-0 focus-visible:border-green-500 font-bold text-green-700 dark:text-green-300 bg-green-50/50 dark:bg-green-900/20 shadow-sm text-base"
                                                    onChange={(e) => setTotalAmount(parseInt(e.target.value) || 0)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Full Width Section: Itinerary Details */}
                        <div className="space-y-6 col-span-12">
                            <div className="flex items-center gap-4 py-4 mb-2">
                                <div className="h-px bg-border flex-1"></div>
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <LayoutList className="w-5 h-5 text-primary" /> Itinerary Details
                                </h3>
                                <div className="h-px bg-border flex-1"></div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-4">
                                    {/* HOTEL CALCULATOR */}
                                    <div className="space-y-2">
                                        <HotelCalculator
                                            items={hotelItems}
                                            setItems={setHotelItems}
                                            total={hotelTotal}
                                            availableHotels={availableHotels}
                                            startDate={travelDateState}
                                            setStartDate={setTravelDateState}
                                            hideRates={true}
                                        />
                                    </div>

                                    {/* Legacy Hotel Textarea (Only show if empty items or has legacy content) */}
                                    {(hotelItems.length === 0 || hotelInfo.length > 0) && (
                                        <div className="bg-muted/10 p-4 rounded-lg border border-border/50">
                                            <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1 mb-2 block">Additional Hotel Notes (Legacy)</Label>
                                            <Textarea
                                                name="hotelInfo"
                                                placeholder="Manual hotel notes..."
                                                value={hotelInfo}
                                                onChange={(e) => setHotelInfo(e.target.value)}
                                                className="min-h-[60px] text-sm bg-background"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-dashed border-border">
                                    <div className="space-y-2">
                                        {/* TRANSPORT CALCULATOR - Full Width */}
                                        <TransportCalculator
                                            items={transportItems}
                                            setItems={setTransportItems}
                                            total={transportTotal}
                                            availableTransports={availableTransports}
                                            hideRates={true}
                                        />
                                        {/* Legacy Transport Input */}
                                        {(transportItems.length === 0 || transportInfo.length > 0) && (
                                            <div className="mt-2">
                                                <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Transport Notes</Label>
                                                <Input
                                                    name="transportInfo"
                                                    placeholder="Manual transport notes..."
                                                    value={transportInfo}
                                                    onChange={(e) => setTransportInfo(e.target.value)}
                                                    className="h-10 mt-1 bg-background"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Meal Plan</Label>
                                        <Input
                                            name="mealPlan"
                                            placeholder="e.g. MAP (Breakfast + Dinner)"
                                            defaultValue={booking?.mealPlan}
                                            className="h-12 border-input focus:ring-0 focus:border-primary bg-background shadow-sm"
                                        />
                                    </div>
                                    {/* Transport was here, moved up */}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-muted-foreground text-xs uppercase font-semibold pl-1">Internal / Customer Notes</Label>
                                    <Textarea
                                        name="notes"
                                        placeholder="Special requests, flight details, or internal remarks..."
                                        defaultValue={booking?.notes}
                                        className="min-h-[80px] border-input focus:ring-0 focus:border-primary bg-background shadow-sm resize-y"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {mode === 'create' && (
                    <div className="pt-8 border-t border-dashed border-border">
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
                                            className="pl-8 h-12 border-input focus-visible:ring-0 focus-visible:border-primary font-medium shadow-sm bg-background"
                                            onChange={(e) => setInitialPayment(parseInt(e.target.value) || 0)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Select name="paymentMode" defaultValue="UPI" disabled={initialPayment <= 0}>
                                        <SelectTrigger className="h-12 border-input shadow-sm bg-background">
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

            {/* Footer Action Bar */}
            <div className="p-4 bg-background border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-10 flex justify-between items-center px-8">
                <div className="flex items-center gap-3">
                    <Link href="/admin/bookings">
                        <Button type="button" variant="ghost" className="h-12 px-6 hover:bg-muted">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Cancel
                        </Button>
                    </Link>
                </div>
                <Button type="submit" disabled={loading} className="h-12 px-10 text-base shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all rounded-full">
                    {loading ? "Processing..." : (mode === 'create' ? "Confirm Booking" : "Save Changes")}
                </Button>
            </div>
        </form>
    );
}
