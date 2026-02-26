"use client";

import { useState, useEffect } from "react";
import { Calculator, Copy, RefreshCcw, CheckCircle2, FileText, ArrowRight, ArrowUp, Save, FolderOpen, Trash2, Plus, Search, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
    HotelItem, TransportItem, ActivityItem,
    HotelCalculator, TransportCalculator, ActivityCalculator,
    CurrencyInput
} from "@/components/admin/calculator-components";
import { saveQuote, getQuotes, deleteQuote } from "@/app/actions/quotes";
import { getHotels } from "@/app/actions/hotels";
import { getTransports } from "@/app/actions/transport";
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
    const [availableHotels, setAvailableHotels] = useState<any[]>([]); // Full DB Hotel Objects
    const [availableTransports, setAvailableTransports] = useState<any[]>([]); // Full DB Transport Objects

    // Forced to Today per user request
    const [startDate, setStartDate] = useState<Date>(new Date());

    const [hotels, setHotels] = useState<HotelItem[]>([
        { id: "1", type: "Hotel", location: "Srinagar", name: "", rate: 0, rooms: 1, nights: 1, plan: "MAP" },
    ]);
    const [transport, setTransport] = useState<TransportItem[]>([
        { id: "1", type: "Innova", rate: 0, days: 1 },
    ]);
    const [activities, setActivities] = useState<ActivityItem[]>([
        { id: "1", name: "Shikara Ride", rate: 1000, quantity: 1 },
    ]);
    const [commission, setCommission] = useState<number>(0);
    const [isCopied, setIsCopied] = useState(false);
    const [promptCopied, setPromptCopied] = useState(false);

    // --- Save/Load State ---
    const [savedQuotes, setSavedQuotes] = useState<DBQuote[]>([]);
    const [currentQuoteId, setCurrentQuoteId] = useState<string | null>(null); // NEW: Track ID
    const [quoteName, setQuoteName] = useState("");
    const [clientName, setClientName] = useState(""); // NEW: Client Name
    const [isSaveOpen, setIsSaveOpen] = useState(false);
    const [isLoadOpen, setIsLoadOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuoteTerm, setSearchQuoteTerm] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Fix for double-click

    const filteredQuotes = savedQuotes.filter(quote =>
        quote.name.toLowerCase().includes(searchQuoteTerm.toLowerCase()) ||
        (quote.clientName && quote.clientName.toLowerCase().includes(searchQuoteTerm.toLowerCase()))
    );

    // --- AI Prompt State ---
    const [promptTone, setPromptTone] = useState("Balanced");
    const [promptType, setPromptType] = useState("General");
    const [tripHighlights, setTripHighlights] = useState("");
    const [routeLegs, setRouteLegs] = useState<{ id: string; from: string; to: string }[]>([]);

    const LOCATIONS = ["Srinagar", "Pahalgam", "Gulmarg", "Yusmarg", "Sonamarg"];

    // Load DB quotes on open
    const loadQuotesFromDB = async () => {
        setIsLoading(true);
        const data = await getQuotes();
        // Map DB types if necessary
        setSavedQuotes(data as any[]);
        setIsLoading(false);
    };

    // Auto load on mount
    useEffect(() => {
        loadQuotesFromDB();
        // Fetch Hotels
        getHotels().then(res => {
            if (res.success && res.hotels) {
                setAvailableHotels(res.hotels);
            }
        });
        // Fetch Transports
        getTransports().then(res => {
            if (res.success && res.transports) {
                setAvailableTransports(res.transports);

                // Auto-update initial transport rate if it matches DB
                setTransport(prev => prev.map(t => {
                    const dbMatch = res.transports.find((dt: any) => dt.name === t.type || dt.id === t.type);
                    if (dbMatch && t.rate === 0) {
                        return { ...t, rate: dbMatch.rate };
                    }
                    return t;
                }));
            }
        });
    }, []);

    // --- Calculations ---
    const calculateHotelTotal = () =>
        hotels.reduce((acc, item) => {
            const base = item.rate * item.rooms;
            const extra = (item.extraBedCount || 0) * (item.extraBedRate || 0);
            return acc + (base + extra) * item.nights;
        }, 0);

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
            setHotels([{ id: "1", type: "Hotel", location: "Srinagar", name: "", rate: 0, rooms: 1, nights: 1, plan: "EP" }]);
            setTransport([{ id: "1", type: "Innova", rate: 0, days: 1 }]);
            setActivities([{ id: "1", name: "Shikara Ride", rate: 1000, quantity: 1 }]);
            setCommission(0);
            setCurrentQuoteId(null); // Clear ID on reset
            setQuoteName("");
            setClientName("");
            toast.success("Calculator reset.");
        }
    };

    const handleSaveQuote = async () => {
        // Validation: Client Name required now instead of Quote Name
        if (!clientName.trim()) {
            toast.error("Please enter Client Name.");
            return;
        }

        const quoteData = {
            hotels,
            transport,
            activities,
            commission,
            startDate: startDate ? startDate.toISOString() : null, // Save Travel Date
            clientName
        };

        // Use client name as quote name (or formatted if needed)
        const finalQuoteName = clientName.trim();

        // Pass ID if updating
        const res = await saveQuote(finalQuoteName, clientName, quoteData, currentQuoteId || undefined);

        if (res.success && res.quote) {
            toast.success(currentQuoteId ? "Quote Updated!" : "Quote Saved to Database!");
            setCurrentQuoteId(res.quote.id); // Set ID
            setQuoteName(res.quote.name);
            setIsSaveOpen(false);
            loadQuotesFromDB(); // Refresh
        } else {
            toast.error("Failed to save quote.");
        }
    };

    const handleSaveAsNew = async () => {
        if (!clientName.trim()) {
            toast.error("Please enter Client Name.");
            return;
        }

        const quoteData = {
            hotels,
            transport,
            activities,
            commission,
            startDate: startDate ? startDate.toISOString() : null,
            clientName
        };
        const finalQuoteName = `${clientName.trim()} (Copy)`;

        // Force create by NOT passing ID
        const res = await saveQuote(finalQuoteName, clientName, quoteData);

        if (res.success && res.quote) {
            toast.success("Saved as New Copy!");
            setCurrentQuoteId(res.quote.id);
            setQuoteName(res.quote.name);
            setIsSaveOpen(false);
            loadQuotesFromDB();
        } else {
            toast.error("Failed to save copy.");
        }
    };

    const handleLoadQuote = (quote: DBQuote) => {
        if (confirm(`Load "${quote.name}"? This will overwrite current inputs.`)) {
            const data = quote.data as any;
            if (data) {
                setHotels((data.hotels || []).map((h: any) => ({ ...h, plan: h.plan || "EP", type: h.type || "Hotel" })));
                setTransport(data.transport || []);
                setActivities(data.activities || []);
                setCommission(data.commission || 0);

                // Restore Travel Date
                if (data.startDate) {
                    setStartDate(new Date(data.startDate));
                }

                setCurrentQuoteId(quote.id); // Track ID
                setQuoteName(quote.name);
                setClientName(quote.clientName || data.clientName || "");

                toast.success("Quote loaded! changes will update this record.");
                setIsLoadOpen(false);
            }
        }
    };

    const handleDeleteQuote = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Delete this saved quote?")) {
            await deleteQuote(id);
            if (currentQuoteId === id) setCurrentQuoteId(null); // Clear active
            toast.success("Quote deleted.");
            loadQuotesFromDB();
        }
    };

    // Route Builder Handlers
    const addRouteLeg = () => {
        setRouteLegs([...routeLegs, { id: Date.now().toString(), from: '', to: '' }]);
    };

    const removeRouteLeg = (id: string) => {
        setRouteLegs(routeLegs.filter(l => l.id !== id));
    };

    const updateRouteLeg = (id: string, field: 'from' | 'to', value: string) => {
        setRouteLegs(routeLegs.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const generateChatGPTPrompt = () => {
        // Calculate dynamic duration based on nights
        const totalNights = hotels.reduce((acc, h) => acc + (h.nights || 0), 0);
        const days = totalNights + 1;
        const durationStr = `${days} Days / ${totalNights} Nights`;

        let prompt = `Create a detailed ${promptTone} ${promptType} itinerary for Kashmir.\n`;
        prompt += `Duration: ${durationStr}\n`;
        // Assumption: 2 Adults based on 1 room double occupancy logic if not specified, 
        // but Calculator doesn't have Pax fields yet. We can assume generic or ask user to fill.
        // For now, let's genericize or leave placeholders.
        prompt += `Travelers: Couple/Family (Adjust as needed)\n\n`;

        prompt += `Stays/Hotels:\n`;
        hotels.forEach((h, i) => {
            if (h.name) {
                prompt += `- ${h.location}: ${h.name} (${h.nights} Nights)\n`;
            }
        });

        // Append Route Plan
        const hasRoutes = routeLegs.some(l => l.from && l.to);
        if (hasRoutes) {
            prompt += `\nRoute Plan:\n`;
            routeLegs.forEach((leg, i) => {
                if (leg.from && leg.to) {
                    prompt += `- Day ${i + 1} (approx): ${leg.from} to ${leg.to}\n`;
                }
            });
        }

        if (tripHighlights.trim()) {
            prompt += `\nSpecific Trip Highlights / Notes:\n${tripHighlights}\n`;
        }

        if (activities.length > 0) {
            prompt += `\nIncluded Activities:\n`;
            activities.forEach(a => {
                if (a.name) prompt += `- ${a.name}\n`;
            });
        }

        prompt += `\nPlease generate a day-by-day itinerary. For each day, provide a 'Title' and a 'Description'.\n`;
        prompt += `Make the description engaging and illustrative. Valid markdown format.\n`;
        prompt += `Tone: ${promptTone}. Focus on local experiences and the specific hotels mentioned.`;

        navigator.clipboard.writeText(prompt);
        setPromptCopied(true);
        toast.success("AI Prompt copied to clipboard!");
        setTimeout(() => setPromptCopied(false), 2000);
    };

    const copyToClipboard = () => {
        let text = `*Trip Cost Estimate* 🏔️\n\n`;

        // Hotels
        if (hotels.length > 0 && calculateHotelTotal() > 0) {
            text += `🏨 *Hotels & Stays*\n`;
            hotels.forEach((h, i) => {
                if (h.name || h.rate > 0) {
                    const base = h.rate * h.rooms;
                    const extra = (h.extraBedCount || 0) * (h.extraBedRate || 0);
                    const total = (base + extra) * h.nights;
                    let extraStr = h.extraBedCount ? ` + (₹${(h.extraBedRate || 0).toLocaleString()} x ${h.extraBedCount} Ex. Bed)` : "";
                    text += `${i + 1}. ${h.location} ${h.type} - ${h.name || 'Property'} - (₹${h.rate.toLocaleString()} x ${h.rooms} R${extraStr}) x ${h.nights} N = ₹${total.toLocaleString()}\n`;
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
            grandTotal,
            totalNights: hotels.reduce((acc, h) => acc + (h.nights || 0), 0),
            totalDays: hotels.reduce((acc, h) => acc + (h.nights || 0), 0) + 1,
            clientName, // NEW
            startDate: startDate ? startDate.toISOString() : null, // NEW
        };
        localStorage.setItem('calculatorDraft', JSON.stringify(calculatorData));
        toast.success("Redirecting to Itinerary Maker...");
        // Use window.location for hard nav to ensure state refresh if needed, or router
        window.location.href = '/admin/tools/itinerary-maker?import=true';
    };

    return (
        <div className="p-4 md:p-8 max-w-[95%] mx-auto space-y-6 md:space-y-12 pb-32">
            {/* Header Redesign */}
            <div className="flex flex-col gap-6">

                {/* Top Row: Title & Controls */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Calculator className="w-6 h-6 text-primary" />
                            </div>
                            Cost Calculator
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm md:text-base ml-11 md:ml-12">Calculate custom holiday packages instantly.</p>
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 ml-11 lg:ml-0 no-scrollbar">
                        <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Save className="w-4 h-4 mr-2" /> Save
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Save Quote</DialogTitle>
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
                                    {/* Quote Name Field Removed per user request */}

                                    {currentQuoteId ? (
                                        <div className="space-y-3 pt-2">
                                            <Button onClick={handleSaveQuote} className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                                Update Existing
                                            </Button>
                                            <Button onClick={handleSaveAsNew} variant="outline" className="w-full">
                                                Save as New Copy
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button onClick={handleSaveQuote} className="w-full">Save to Database</Button>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isLoadOpen} onOpenChange={setIsLoadOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <FolderOpen className="w-4 h-4 mr-2" /> Load
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Team Quotes</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-3 pt-4">
                                    {/* Search Bar */}
                                    <div className="relative sticky top-0 bg-background z-10 pb-2 border-b">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pb-2">
                                            <Search className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            placeholder="Search by Name or Client..."
                                            value={searchQuoteTerm}
                                            onChange={(e) => setSearchQuoteTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>

                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                                        {isLoading ? <p className="text-center py-4 text-sm text-muted-foreground">Loading...</p> : filteredQuotes.length === 0 ? (
                                            <p className="text-center text-muted-foreground py-8 text-sm">No matching quotes found.</p>
                                        ) : (
                                            filteredQuotes.map(quote => (
                                                <div
                                                    key={quote.id}
                                                    onClick={() => handleLoadQuote(quote)}
                                                    className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors relative group"
                                                >
                                                    <div className="flex-1 pr-8">
                                                        <div className="font-semibold text-sm mb-1">{quote.name}</div>
                                                        <div className="flex flex-wrap text-xs text-muted-foreground gap-x-2 gap-y-1">
                                                            {quote.clientName && (
                                                                <span className="flex items-center">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                                                                    {quote.clientName}
                                                                </span>
                                                            )}
                                                            <span className="break-words">
                                                                {new Date(quote.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => handleDeleteQuote(quote.id, e)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" onClick={resetCalculator}>
                            <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                        </Button>
                    </div>
                </div>

                {/* Bottom Row: Context & Actions */}
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Customer Name */}
                        <div className="flex items-center gap-2 w-full sm:w-64">
                            <Input
                                placeholder="Customer Name"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className="bg-background border-input/60 h-10"
                            />
                        </div>

                        {/* Booking Date */}
                        <div className="flex items-center justify-between sm:justify-start gap-3 bg-background px-3 py-2 rounded-lg border shadow-sm">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Booking</span>
                            <span className="text-sm font-semibold">{format(new Date(), "dd MMM yyyy")}</span>
                        </div>

                        {/* Travel Date */}
                        <div className="flex items-center justify-between sm:justify-start gap-2 bg-background px-3 py-2 rounded-lg border shadow-sm">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Travel</span>
                            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"ghost"}
                                        size="sm"
                                        className={cn(
                                            "justify-start text-left font-normal h-6 px-2 hover:bg-transparent p-0",
                                            !startDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                                        {startDate ? format(startDate, "dd MMM yyyy") : <span>Pick date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => {
                                            if (date) {
                                                setStartDate(date);
                                                setIsCalendarOpen(false);
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <Button
                        onClick={handleProceedToItinerary}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto shadow-md shadow-indigo-500/20"
                    >
                        Proceed to Itinerary <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 min-[1700px]:grid-cols-[1fr_400px] gap-8 items-start pb-24 min-[1700px]:pb-0">
                {/* Left Column: Calculators */}
                <div className="space-y-8 min-w-0"> {/* min-w-0 prevents grid blowout */}
                    <HotelCalculator
                        items={hotels}
                        setItems={setHotels}
                        total={calculateHotelTotal()}
                        availableHotels={availableHotels}
                        startDate={startDate}
                        setStartDate={setStartDate}
                    />

                    <TransportCalculator
                        items={transport}
                        setItems={setTransport}
                        total={calculateTransportTotal()}
                        availableTransports={availableTransports}
                    />

                    {/* Activities Placeholders if needed */}
                    <ActivityCalculator
                        items={activities}
                        setItems={setActivities}
                        total={calculateActivitiesTotal()}
                    />
                </div>

                {/* Right Column: Sticky Sidebar on Desktop */}
                <div className="space-y-8 min-[1700px]:sticky min-[1700px]:top-8 h-fit transition-all duration-300">
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

                    {/* AI Prompt Generator */}
                    <Card className="border-purple-100 dark:border-purple-900 shadow-lg ring-1 ring-purple-500/10">
                        <CardHeader className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/40 dark:to-background border-b border-purple-100 dark:border-purple-900/50">
                            <CardTitle className="text-purple-800 dark:text-purple-400 flex items-center gap-2">
                                <span className="text-lg">✨</span> AI Content Prompt
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <Label className="text-xs">Tone</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                        value={promptTone}
                                        onChange={(e) => setPromptTone(e.target.value)}
                                    >
                                        <option value="Balanced">Balanced</option>
                                        <option value="Luxury">Luxury</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Romantic">Romantic</option>
                                        <option value="Relaxed">Relaxed</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Trip Type</Label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                                        value={promptType}
                                        onChange={(e) => setPromptType(e.target.value)}
                                    >
                                        <option value="General">General</option>
                                        <option value="Honeymoon">Honeymoon</option>
                                        <option value="Family">Family</option>
                                        <option value="Group">Group</option>
                                        <option value="Solo">Solo</option>
                                    </select>
                                </div>

                                <div className="space-y-2 border-t pt-2 mt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs font-semibold">Route Builder (Optional)</Label>
                                        <Button variant="ghost" size="sm" onClick={addRouteLeg} className="h-6 text-xs text-blue-600">
                                            <Plus className="w-3 h-3 mr-1" /> Add Route
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {routeLegs.length === 0 && (
                                            <p className="text-[10px] text-muted-foreground italic text-center py-2">
                                                No routes added. Click above to add a travel day.
                                            </p>
                                        )}
                                        {routeLegs.map((leg, idx) => (
                                            <div key={leg.id} className="flex gap-2 items-center">
                                                <span className="text-[10px] text-muted-foreground w-12 whitespace-nowrap">Day {idx + 1} Route</span>
                                                <select
                                                    className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                                                    value={leg.from}
                                                    onChange={(e) => updateRouteLeg(leg.id, 'from', e.target.value)}
                                                >
                                                    <option value="">From...</option>
                                                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                                </select>
                                                <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                                <select
                                                    className="flex h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
                                                    value={leg.to}
                                                    onChange={(e) => updateRouteLeg(leg.id, 'to', e.target.value)}
                                                >
                                                    <option value="">To...</option>
                                                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                                </select>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-red-500"
                                                    onClick={() => removeRouteLeg(leg.id)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={generateChatGPTPrompt}
                                className={`w-full text-white transition-all duration-300 ${promptCopied ? 'bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                            >
                                {promptCopied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {promptCopied ? "Prompt Copied" : "Copy ChatGPT Prompt"}
                            </Button>
                            <p className="text-[10px] text-muted-foreground text-center">
                                Paste this into ChatGPT to generate a day-wise itinerary, then copy-paste the text into the "Blank Canvas" template.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Mobile Floating Pricing Card */}
            <div className="fixed bottom-6 right-6 z-50 min-[1700px]:hidden flex flex-col gap-2 transition-transform duration-300">


                {/* Pricing Card */}
                <div className="bg-background/95 backdrop-blur-md border border-b-0 border-r-0 border-l border-t border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-2xl p-4 flex flex-col gap-3 min-w-[220px]">
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-muted-foreground">
                            <span className="text-[10px] uppercase tracking-wider font-semibold">Net Cost</span>
                            <span className="text-xs font-medium">₹{netTotal.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-dashed pt-2 mt-1 border-white/10">
                            <span className="text-sm font-bold text-primary">Total</span>
                            <span className="text-xl font-black text-primary">₹{grandTotal.toLocaleString("en-IN")}</span>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        onClick={copyToClipboard}
                        className={`w-full text-white shadow-md transition-all font-medium h-9 ${isCopied ? 'bg-green-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'}`}
                    >
                        {isCopied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {isCopied ? "Copied" : "Copy Quote"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
