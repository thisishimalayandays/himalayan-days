"use client";

import { useState } from "react";
import { Calculator, Copy, RefreshCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
    HotelItem, TransportItem, ActivityItem,
    HotelCalculator, TransportCalculator, ActivityCalculator,
    CurrencyInput
} from "@/components/admin/calculator-components";

export default function CalculatorPage() {
    // --- State ---
    const [hotels, setHotels] = useState<HotelItem[]>([
        { id: "1", name: "", rate: 0, rooms: 1, nights: 1 },
    ]);
    const [transport, setTransport] = useState<TransportItem[]>([
        { id: "1", type: "Innova", rate: 0, days: 1 },
    ]);
    const [activities, setActivities] = useState<ActivityItem[]>([
        { id: "1", name: "Shikara Ride", rate: 0, quantity: 1 },
    ]);
    const [commission, setCommission] = useState<number>(0);
    const [isCopied, setIsCopied] = useState(false);

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
            setHotels([{ id: "1", name: "", rate: 0, rooms: 1, nights: 1 }]);
            setTransport([{ id: "1", type: "Innova", rate: 0, days: 1 }]);
            setActivities([{ id: "1", name: "Shikara Ride", rate: 0, quantity: 1 }]);
            setCommission(0);
            toast.success("Calculator reset.");
        }
    };

    const copyToClipboard = () => {
        const text = `*Trip Cost Estimate* 🏔️
    
*Hotels:* ₹${calculateHotelTotal().toLocaleString("en-IN")}
*Transport:* ₹${calculateTransportTotal().toLocaleString("en-IN")}
*Activities:* ₹${calculateActivitiesTotal().toLocaleString("en-IN")}
*Service Fee:* ₹${commission.toLocaleString("en-IN")}

*GRAND TOTAL:* ₹${grandTotal.toLocaleString("en-IN")}

_Generated via Himalayan Days Admin_`;

        navigator.clipboard.writeText(text);
        toast.success("Quote copied to clipboard!");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
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
