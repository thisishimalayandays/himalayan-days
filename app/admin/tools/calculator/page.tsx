"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Calculator, Copy, RefreshCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface HotelItem {
    id: string;
    name: string;
    rate: number;
    rooms: number;
    nights: number;
}

interface TransportItem {
    id: string;
    type: string;
    rate: number;
    days: number;
}

interface ActivityItem {
    id: string;
    name: string;
    rate: number;
    quantity: number;
}

// --- Helper Components (Moved Outside) ---
const CurrencyInput = ({
    value,
    onChange,
    placeholder = "0",
}: {
    value: number;
    onChange: (val: number) => void;
    placeholder?: string;
}) => (
    <div className="relative">
        <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
        <Input
            type="number"
            min="0"
            value={value || ""}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            className="pl-7"
            placeholder={placeholder}
        />
    </div>
);

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
    const addHotel = () => {
        setHotels([
            ...hotels,
            { id: Date.now().toString(), name: "", rate: 0, rooms: 1, nights: 1 },
        ]);
    };

    const removeHotel = (id: string) => {
        setHotels(hotels.filter((item) => item.id !== id));
    };

    const addTransport = () => {
        setTransport([
            ...transport,
            { id: Date.now().toString(), type: "", rate: 0, days: 1 },
        ]);
    };

    const removeTransport = (id: string) => {
        setTransport(transport.filter((item) => item.id !== id));
    };

    const addActivity = () => {
        setActivities([
            ...activities,
            { id: Date.now().toString(), name: "", rate: 0, quantity: 1 },
        ]);
    };

    const removeActivity = (id: string) => {
        setActivities(activities.filter((item) => item.id !== id));
    };

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
        <div className="p-8 max-w-5xl mx-auto space-y-8 pb-32">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cost Calculator</h1>
                    <p className="text-gray-500 mt-2">Calculate custom package prices instantly.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={resetCalculator}>
                        <RefreshCcw className="w-4 h-4 mr-2" /> Reset
                    </Button>
                    <Button
                        onClick={copyToClipboard}
                        className={`transition-all ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                    >
                        {isCopied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        {isCopied ? "Copied!" : "Copy Quote"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN - INPUTS */}
                <div className="lg:col-span-2 space-y-8">
                    {/* SECTION 1: HOTELS */}
                    <Card>
                        <CardHeader className="bg-blue-50/50 pb-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-blue-700 flex items-center gap-2">
                                    <span className="bg-blue-100 p-2 rounded-lg">🏨</span> Hotels & Stays
                                </CardTitle>
                                <div className="text-sm font-semibold text-blue-700">
                                    Total: ₹{calculateHotelTotal().toLocaleString("en-IN")}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-500 mb-2 px-1">
                                <div className="col-span-4">Hotel Name</div>
                                <div className="col-span-3">Rate (₹)</div>
                                <div className="col-span-2">Rooms</div>
                                <div className="col-span-2">Nights</div>
                                <div className="col-span-1"></div>
                            </div>

                            {hotels.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-3 items-center">
                                    <div className="col-span-4">
                                        <Input
                                            placeholder="e.g. Radisson"
                                            value={item.name}
                                            onChange={(e) => {
                                                const newHotels = [...hotels];
                                                newHotels[index].name = e.target.value;
                                                setHotels(newHotels);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <CurrencyInput
                                            value={item.rate}
                                            onChange={(val) => {
                                                const newHotels = [...hotels];
                                                newHotels[index].rate = val;
                                                setHotels(newHotels);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.rooms}
                                            onChange={(e) => {
                                                const newHotels = [...hotels];
                                                newHotels[index].rooms = parseInt(e.target.value) || 1;
                                                setHotels(newHotels);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.nights}
                                            onChange={(e) => {
                                                const newHotels = [...hotels];
                                                newHotels[index].nights = parseInt(e.target.value) || 1;
                                                setHotels(newHotels);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => removeHotel(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addHotel} className="w-full border-dashed text-gray-500 hover:text-blue-600 hover:border-blue-300">
                                <Plus className="w-4 h-4 mr-2" /> Add Hotel Row
                            </Button>
                        </CardContent>
                    </Card>

                    {/* SECTION 2: TRANSPORT */}
                    <Card>
                        <CardHeader className="bg-orange-50/50 pb-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-orange-700 flex items-center gap-2">
                                    <span className="bg-orange-100 p-2 rounded-lg">🚖</span> Transport / Cab
                                </CardTitle>
                                <div className="text-sm font-semibold text-orange-700">
                                    Total: ₹{calculateTransportTotal().toLocaleString("en-IN")}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 mb-2 px-1">
                                <div className="col-span-5">Vehicle Type</div>
                                <div className="col-span-3">Rate/Day (₹)</div>
                                <div className="col-span-3">No. of Days</div>
                                <div className="col-span-1"></div>
                            </div>

                            {transport.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-5">
                                        <Input
                                            placeholder="e.g. Innova Crysta"
                                            value={item.type}
                                            onChange={(e) => {
                                                const newTransport = [...transport];
                                                newTransport[index].type = e.target.value;
                                                setTransport(newTransport);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <CurrencyInput
                                            value={item.rate}
                                            onChange={(val) => {
                                                const newTransport = [...transport];
                                                newTransport[index].rate = val;
                                                setTransport(newTransport);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.days}
                                            onChange={(e) => {
                                                const newTransport = [...transport];
                                                newTransport[index].days = parseInt(e.target.value) || 1;
                                                setTransport(newTransport);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => removeTransport(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addTransport} className="w-full border-dashed text-gray-500 hover:text-orange-600 hover:border-orange-300">
                                <Plus className="w-4 h-4 mr-2" /> Add Vehicle
                            </Button>
                        </CardContent>
                    </Card>

                    {/* SECTION 3: ACTIVITIES */}
                    <Card>
                        <CardHeader className="bg-purple-50/50 pb-4 border-b">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-purple-700 flex items-center gap-2">
                                    <span className="bg-purple-100 p-2 rounded-lg">🎿</span> Activities & Extras
                                </CardTitle>
                                <div className="text-sm font-semibold text-purple-700">
                                    Total: ₹{calculateActivitiesTotal().toLocaleString("en-IN")}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 mb-2 px-1">
                                <div className="col-span-5">Activity</div>
                                <div className="col-span-3">Rate (₹)</div>
                                <div className="col-span-3">Quantity</div>
                                <div className="col-span-1"></div>
                            </div>

                            {activities.map((item, index) => (
                                <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-5">
                                        <Input
                                            placeholder="e.g. Shikara Ride"
                                            value={item.name}
                                            onChange={(e) => {
                                                const newActivities = [...activities];
                                                newActivities[index].name = e.target.value;
                                                setActivities(newActivities);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <CurrencyInput
                                            value={item.rate}
                                            onChange={(val) => {
                                                const newActivities = [...activities];
                                                newActivities[index].rate = val;
                                                setActivities(newActivities);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => {
                                                const newActivities = [...activities];
                                                newActivities[index].quantity = parseInt(e.target.value) || 1;
                                                setActivities(newActivities);
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => removeActivity(item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={addActivity} className="w-full border-dashed text-gray-500 hover:text-purple-600 hover:border-purple-300">
                                <Plus className="w-4 h-4 mr-2" /> Add Activity
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN - TOTALS */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8 space-y-6">
                        {/* Commission Card */}
                        <Card className="border-emerald-100 shadow-lg overflow-hidden">
                            <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                                <CardTitle className="text-emerald-800">Final Pricing</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">

                                {/* Calculations Summary */}
                                <div className="space-y-3 pb-6 border-b border-dashed">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Net Cost (Hotel+Cab+Act)</span>
                                        <span className="font-medium">₹{netTotal.toLocaleString("en-IN")}</span>
                                    </div>
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="text-emerald-600 font-medium">Your Profit / Commission</span>
                                        <div className="w-28">
                                            <CurrencyInput value={commission} onChange={setCommission} placeholder="Margin" />
                                        </div>
                                    </div>
                                </div>

                                {/* Grand Total */}
                                <div className="text-center pt-2">
                                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Grand Total Price</div>
                                    <div className="text-4xl font-bold text-gray-900 bg-gray-50 py-4 rounded-xl border border-gray-100">
                                        ₹{grandTotal.toLocaleString("en-IN")}
                                    </div>
                                </div>

                                <Button
                                    onClick={copyToClipboard}
                                    size="lg"
                                    className={`w-full text-white shadow-xl transition-all ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
                                >
                                    {isCopied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {isCopied ? "Copied to Clipboard!" : "Copy Quote to Clipboard"}
                                </Button>

                                <div className="text-xs text-center text-gray-400">
                                    Calculated values are estimates.
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Tips */}
                        <div className="bg-blue-50 rounded-xl p-5 text-sm text-blue-700 space-y-2">
                            <p className="font-semibold flex items-center gap-2">
                                <Calculator className="w-4 h-4" /> Pro Tip:
                            </p>
                            <p className="opacity-80">
                                Add a 10-15% margin on top of Net Cost to cover unexpected expenses and profit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
