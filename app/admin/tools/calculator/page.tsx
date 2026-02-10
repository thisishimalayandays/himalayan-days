"use client";

import { useState, useEffect } from "react";
import { Calculator, Copy, RefreshCcw, CheckCircle2, FileText, ArrowRight, Save, FolderOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    HotelItem, TransportItem, ActivityItem,
    HotelCalculator, TransportCalculator, ActivityCalculator,
    CurrencyInput
} from "@/components/admin/calculator-components";
import { saveQuote, getQuotes, deleteQuote } from "@/app/actions/quotes";
import { logActivity } from "@/app/actions/audit";

// Type matches DB return
interface DBQuote {
    id: string;
    name: string;
    clientName?: string | null;
    date?: string; // Client side Helper
    data: any;
    createdAt: Date;
}

export default function CalculatorPage() {
    // --- State ---
    const [hotels, setHotels] = useState<HotelItem[]>([
        { id: "1", type: "Hotel", location: "Srinagar", name: "", rate: 0, rooms: 1, nights: 1 },
    ]);
    const [transport, setTransport] = useState<TransportItem[]>([
        { id: "1", type: "Innova", rate: 0, days: 1 },
    ]);
    const [activities, setActivities] = useState<ActivityItem[]>([
        { id: "1", name: "Shikara Ride", rate: 1000, quantity: 1 },
    ]);
    const [commission, setCommission] = useState<number>(0);
    const [isCopied, setIsCopied] = useState(false);

    // --- Save/Load State ---
    const [savedQuotes, setSavedQuotes] = useState<DBQuote[]>([]);
    const [quoteName, setQuoteName] = useState("");
    const [clientName, setClientName] = useState(""); // NEW: Client Name
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isLoadOpen, setIsLoadOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Load DB quotes on open
    const loadQuotesFromDB = async () => {
        setIsLoading(true);
        const data = await getQuotes();
        // Map DB types if necessary
        setSavedQuotes(data as any[]);
        setIsLoading(false);
    };

    // Auto load on mount is good? Maybe or just on Open
    useEffect(() => {
        loadQuotesFromDB();
    }, []);

    // --- Calculations ---
    const calculateHotelTotal = () =>
        hotels.reduce((acc, item) => acc + item.rate * item.rooms * item.nights, 0);

    const calculateTransportTotal = () =>
        transport.reduce((acc, item) => acc + item.rate * item.days, 0);

    const calculateActivitiesTotal = () =>
        activities.reduce((acc, item) => acc + item.rate * item.quantity, 0);

    const netTotal =
        calculateHotelTotal() + calculateTransportTotal() + calculateActivitiesTotal();
    const grandTotal = netTotal + commission;

    // --- Handlers ---
    const resetCalculator = () => {
        if (confirm("Are you sure you want to reset all fields?")) {
            setHotels([{ id: "1", type: "Hotel", location: "Srinagar", name: "", rate: 0, rooms: 1, nights: 1 }]);
            setTransport([{ id: "1", type: "Innova", rate: 0, days: 1 }]);
            setActivities([{ id: "1", name: "Shikara Ride", rate: 1000, quantity: 1 }]);
            setCommission(0);
            toast.success("Calculator reset.");
        }
    };

    const handleSaveQuote = async () => {
        if (!quoteName.trim()) {
            toast.error("Please enter a name for this quote.");
            return;
        }

        const quoteData = { hotels, transport, activities, commission };

        const res = await saveQuote(quoteName, clientName, quoteData);

        if (res.success) {
            toast.success("Quote saved to Database!");
            setQuoteName("");
            setClientName("");
            setIsSaveOpen(false);
            loadQuotesFromDB(); // Refresh
        } else {
            toast.error("Failed to save quote.");
        }
    };

    const handleLoadQuote = (quote: DBQuote) => {
        if (confirm(`Load "${quote.name}"? This will overwrite current inputs.`)) {
            const data = quote.data as any;
            if (data) {
                setHotels(data.hotels || []);
                setTransport(data.transport || []);
                setActivities(data.activities || []);
                setCommission(data.commission || 0);
                toast.success("Quote loaded!");
                setIsLoadOpen(false);
            }
        }
    };

    const handleDeleteQuote = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this saved quote?")) {
            await deleteQuote(id);
            toast.success("Quote deleted.");
            loadQuotesFromDB();
        }
    };

    const copyToClipboard = () => {
        let text = `*Trip Cost Estimate* 🏔️\n\n`;

        // Hotels
        if (hotels.length > 0 && calculateHotelTotal() > 0) {
            text += `🏨 *Hotels & Stays*\n`;
            hotels.forEach((h, i) => {
                if (h.name || h.rate > 0) {
                    const total = h.rate * h.rooms * h.nights;
                    // Format: 1. Srinagar Hotel - Radisson ...
                    text += `${i + 1}. ${h.location} ${h.type} - ${h.name || 'Property'} - ₹${h.rate.toLocaleString()} x ${h.rooms} R x ${h.nights} N = ₹${total.toLocaleString()}\n`;
                }
            });
            text += `*Subtotal:* ₹${calculateHotelTotal().toLocaleString("en-IN")}\n\n`;
        }

        // Transport
        if (transport.length > 0 && calculateTransportTotal() > 0) {
            text += `🚗 *Transport*\n`;
            transport.forEach((t, i) => {
                if (t.type || t.rate > 0) {
                    const total = t.rate * t.days;
                    text += `${i + 1}. ${t.type || 'Vehicle'} - ₹${t.rate.toLocaleString()} x ${t.days} Days = ₹${total.toLocaleString()}\n`;
                }
            });
            text += `*Subtotal:* ₹${calculateTransportTotal().toLocaleString("en-IN")}\n\n`;
        }

        // Activities
        if (activities.length > 0 && calculateActivitiesTotal() > 0) {
            text += `✨ *Activities & Extras*\n`;
            activities.forEach((a, i) => {
                if (a.name || a.rate > 0) {
                    const total = a.rate * a.quantity;
                    text += `${i + 1}. ${a.name || 'Activity'} - ₹${a.rate.toLocaleString()} x ${a.quantity} = ₹${total.toLocaleString()}\n`;
                }
            });
            text += `*Subtotal:* ₹${calculateActivitiesTotal().toLocaleString("en-IN")}\n\n`;
        }

        text += `-------------------\n`;
        text += `*Net Cost:* ₹${netTotal.toLocaleString("en-IN")}\n`;
        if (commission > 0) {
            text += `*Service Fee:* ₹${commission.toLocaleString("en-IN")}\n`;
        }
        text += `-------------------\n`;
        text += `*GRAND TOTAL: ₹${grandTotal.toLocaleString("en-IN")}*\n\n`;
        text += `_Generated via Himalayan Days_`;

        navigator.clipboard.writeText(text);
        logActivity('COPIED_CALCULATION', 'Calculator', null, `Copied calculation. Total: ${grandTotal}`);
        toast.success("Detailed quote copied!");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleProceedToItinerary = () => {
        if (calculateHotelTotal() + calculateTransportTotal() === 0) {
            toast.error("Please add at least one Hotel or Transport service.");
            return;
        }

        const calculatorData = {
            hotels,
            transport,
            activities,
            netTotal,
            commission,
            grandTotal
        };
        localStorage.setItem('calculatorDraft', JSON.stringify(calculatorData));
        toast.success("Redirecting to Itinerary Maker...");
        // Use window.location for hard nav to ensure state refresh if needed, or router
        window.location.href = '/admin/tools/itinerary-maker?import=true';
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 pb-32">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Calculator className="w-6 h-6 text-primary" />
                        </div>
                        Cost Calculator
                    </h1>
                    <p className="text-muted-foreground mt-2 pl-12">Calculate custom holiday packages instantly.</p>
                </div>
                <div className="flex gap-2 pl-12 sm:pl-0">
                    <Button
                        onClick={handleProceedToItinerary}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                        Proceed to Itinerary <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Save className="w-4 h-4 mr-2" /> Save
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Save Quote Prototype</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label>Client Name</Label>
                                    <Input
                                        placeholder="e.g. Rahul Sharma"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Quote Name / Identifier</Label>
                                    <Input
                                        placeholder="e.g. Family Trip Dec 2025"
                                        value={quoteName}
                                        onChange={(e) => setQuoteName(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleSaveQuote} className="w-full">Save to Database</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isLoadOpen} onOpenChange={setIsLoadOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <FolderOpen className="w-4 h-4 mr-2" /> Load from DB
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Team Quotes</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 pt-4">
                                {isLoading ? <p>Loading...</p> : savedQuotes.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No saved quotes found.</p>
                                ) : (
                                    savedQuotes.map(quote => (
                                        <div
                                            key={quote.id}
                                            onClick={() => handleLoadQuote(quote)}
                                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer group transition-colors"
                                        >
                                            <div>
                                                <div className="font-semibold">{quote.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {quote.clientName ? `${quote.clientName} • ` : ''}
                                                    {new Date(quote.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={(e) => handleDeleteQuote(quote.id, e)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button variant="outline" onClick={resetCalculator}>
                        <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - INPUTS */}
                <div className="lg:col-span-2 space-y-8">
                    <HotelCalculator
                        items={hotels}
                        setItems={setHotels}
                        total={calculateHotelTotal()}
                    />
                    <TransportCalculator
                        items={transport}
                        setItems={setTransport}
                        total={calculateTransportTotal()}
                    />
                    <ActivityCalculator
                        items={activities}
                        setItems={setActivities}
                        total={calculateActivitiesTotal()}
                    />
                </div>

                {/* RIGHT COLUMN - TOTALS */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        {/* Commission Card */}
                        <Card className="border-emerald-100 dark:border-emerald-900 shadow-lg overflow-hidden ring-1 ring-emerald-500/10">
                            <CardHeader className="bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/40 dark:to-background border-b border-emerald-100 dark:border-emerald-900/50">
                                <CardTitle className="text-emerald-800 dark:text-emerald-400">Final Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">

                                {/* Calculations Summary */}
                                <div className="space-y-4 pb-6 border-b border-dashed border-emerald-200 dark:border-emerald-900/50">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Net Cost</span>
                                        <span className="font-medium">₹{netTotal.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center pt-2">
                                        <span className="text-emerald-600 font-medium">Your Commission</span>
                                        <div className="w-32">
                                            <CurrencyInput
                                                value={commission}
                                                onChange={setCommission}
                                                placeholder="Margin"
                                                className="h-9"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div className="text-center">
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Grand Total Price</div>
                                    <div className="text-4xl font-black text-foreground bg-secondary/30 py-4 rounded-xl border border-border">
                                        ₹{grandTotal.toLocaleString("en-IN")}
                                    </div>
                                </div>

                                <Button
                                    onClick={copyToClipboard}
                                    size="lg"
                                    className={`w-full text-white shadow-xl transition-all duration-300 font-medium ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20'}`}
                                >
                                    {isCopied ? <CheckCircle2 className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
                                    {isCopied ? "Copied!" : "Copy Quote to Clipboard"}
                                </Button>

                            </CardContent>
                        </Card>

                        {/* Quick Tips */}
                        <div className="bg-blue-50/80 dark:bg-blue-900/10 rounded-xl p-5 text-sm text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/20">
                            <p className="font-semibold flex items-center gap-2 mb-1">
                                <Calculator className="w-4 h-4" /> Pro Tip
                            </p>
                            <p className="opacity-90 leading-relaxed text-xs">
                                Add a 10-15% margin on top of Net Cost to cover unexpected expenses and profit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
