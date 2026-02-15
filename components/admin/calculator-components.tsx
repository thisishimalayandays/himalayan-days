"use client";

import { Plus, Trash2, GripVertical, Calendar as CalendarIcon, Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useState } from "react";

// --- Types ---
export interface HotelItem {
    id: string;
    type: string; // Keep for manual override or fallback
    location: string;
    hotelId?: string;
    roomTypeId?: string;
    name: string;
    rate: number;
    rooms: number;
    nights: number;
    plan: 'EP' | 'CP' | 'MAP' | 'AP';
    extraBedCount?: number;
    extraBedRate?: number;
    isCustom?: boolean;
}

export interface TransportItem {
    id: string;
    type: string;
    rate: number;
    days: number;
    isCustom?: boolean;
}

export interface ActivityItem {
    id: string;
    name: string;
    rate: number;
    quantity: number;
}

// --- Helper Input ---
export const CurrencyInput = ({
    value,
    onChange,
    placeholder = "0",
    className,
}: {
    value: number;
    onChange: (val: number) => void;
    placeholder?: string;
    className?: string;
}) => (
    <div className={`relative ${className}`}>
        <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
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

// Helper for Start of Day Comparison
const getStartOfDay = (d: Date | string) => {
    if (!d) return new Date();
    const date = new Date(d);
    if (isNaN(date.getTime())) return new Date(); // Handle invalid date strings
    date.setHours(0, 0, 0, 0);
    return date;
};

function SearchableHotelSelect({
    value,
    onValueChange,
    availableHotels,
    onCustomSelect
}: {
    value?: string;
    onValueChange: (hotelId: string) => void;
    availableHotels: any[];
    onCustomSelect: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const selectedHotel = availableHotels.find(h => h.id === value);

    const filtered = availableHotels.filter(h =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-9 text-xs font-normal border-input/60 bg-background/50 px-3"
                >
                    <span className="truncate">
                        {selectedHotel ? `${selectedHotel.name} ${selectedHotel.stars ? `(${selectedHotel.stars}★)` : ''}` : "Select property..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" align="start">
                <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Search hotel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>
                <div className="max-h-[200px] overflow-y-auto p-1">
                    {filtered.length === 0 && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            No hotel found.
                        </div>
                    )}
                    {filtered.map((hotel) => (
                        <div
                            key={hotel.id}
                            className={cn(
                                "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground",
                                value === hotel.id && "bg-accent/50 text-accent-foreground font-medium"
                            )}
                            onClick={() => {
                                onValueChange(hotel.id);
                                setOpen(false);
                                setSearchTerm(""); // Reset search on select
                            }}
                        >
                            <Check
                                className={cn(
                                    "mr-2 h-3 w-3",
                                    value === hotel.id ? "opacity-100" : "opacity-0"
                                )}
                            />
                            <span className="truncate">{hotel.name}</span>
                            {hotel.stars && <span className="ml-1 text-muted-foreground text-[10px]">({hotel.stars}★)</span>}
                        </div>
                    ))}
                    <div
                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none hover:bg-accent hover:text-accent-foreground text-blue-600 font-medium border-t mt-1"
                        onClick={() => {
                            onCustomSelect();
                            setOpen(false);
                            setSearchTerm("");
                        }}
                    >
                        <Plus className="mr-2 h-3 w-3" />
                        Custom / Not Listed
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// --- Sortable Row Component ---
// --- Sortable Row Component ---
function SortableHotelRow({
    item,
    index,
    updateRow,
    removeRow,
    availableHotels,
    startDate
}: {
    item: HotelItem;
    index: number;
    updateRow: (index: number, field: keyof HotelItem, value: any) => void;
    removeRow: (id: string) => void;
    availableHotels: any[];
    startDate: Date;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
    };

    // Filter hotels by location
    const filteredHotels = availableHotels.filter(h => h.location === item.location);

    // Get selected hotel object
    const selectedHotel = availableHotels.find(h => h.id === item.hotelId);

    // Get room types for selected hotel
    const roomTypes = selectedHotel?.rooms || [];

    // Calculate Rate Effect
    useEffect(() => {
        if (!item.isCustom && item.hotelId && item.roomTypeId && item.plan && startDate) {
            const room = roomTypes.find((r: any) => r.id === item.roomTypeId);
            if (room) {
                const checkDate = getStartOfDay(startDate);
                const uniqueId = new Date().getTime(); // For toast uniqueness

                // DEBUG LOGS
                // rateValidUntil check removed per user request

                let calculatedRate = 0;
                // Check for seasonal rates first
                let seasonalRate = room.rates?.find((rate: any) => {
                    const from = getStartOfDay(rate.validFrom);
                    const to = getStartOfDay(rate.validTo);
                    return checkDate >= from && checkDate <= to;
                });

                let isExpired = false;

                if (seasonalRate && seasonalRate.bookingValidUntil) {
                    const bookingDeadline = getStartOfDay(seasonalRate.bookingValidUntil);

                    // User Request: Only check if TODAY is past the booking deadline.
                    const isTodayExpired = getStartOfDay(new Date()) > bookingDeadline;

                    // If expired based on TODAY's date, invalidate the rate.
                    if (isTodayExpired) {
                        seasonalRate = null;
                        isExpired = true; // NEW FLAG
                    }
                }

                if (isExpired) {
                    calculatedRate = 0; // User input required
                } else if (seasonalRate) {
                    calculatedRate = seasonalRate[`price${item.plan}`] || 0;
                } else {
                    // Fallback to base rates
                    calculatedRate = room[`price${item.plan}`] || room.baseRate || 0;
                }

                if (calculatedRate !== item.rate) {
                    updateRow(index, "rate", calculatedRate);
                }

                // Update Extra Bed Rate from DB
                // PRIORITIZE: Seasonal Plan Specific > Seasonal Generic > Base Plan Specific > Base Generic
                let exBedRate = 0;
                if (seasonalRate) {
                    exBedRate = seasonalRate[`extraBed${item.plan}`] || seasonalRate.extraBed || 0;
                } else {
                    exBedRate = room[`extraBed${item.plan}`] || room.extraBed || 0;
                }

                if (exBedRate !== item.extraBedRate) {
                    updateRow(index, "extraBedRate", exBedRate);
                }
            }
        }
    }, [item.hotelId, item.roomTypeId, item.plan, startDate, roomTypes, item.isCustom]);

    return (
        <div ref={setNodeRef} style={style} className={`grid grid-cols-2 md:grid-cols-[30px_120px_minmax(180px,_3fr)_minmax(160px,_2fr)_80px_90px_80px_70px_70px] gap-3 md:gap-4 items-start group bg-background p-4 md:py-6 md:px-0 border-b border-border/60 last:border-0 ${isDragging ? "shadow-lg ring-1 ring-blue-500/20 rounded-md opacity-80 z-50 bg-card" : ""}`}>
            {/* Drag Handle */}
            <div className="flex justify-center cursor-move touch-none col-span-2 md:col-span-1 py-1 md:py-0 bg-muted/20 md:bg-transparent rounded md:rounded-none mb-1 md:mb-0" {...attributes} {...listeners}>
                <GripVertical className="w-4 h-4 text-muted-foreground/50 hover:text-foreground transition-colors rotate-90 md:rotate-0" />
            </div>

            <div className="col-span-1 md:col-span-1">
                <Select
                    value={item.location}
                    onValueChange={(val) => {
                        updateRow(index, "location", val);
                        if (!item.isCustom) {
                            updateRow(index, "hotelId", undefined);
                            updateRow(index, "roomTypeId", undefined);
                            updateRow(index, "name", "");
                        }
                    }}
                >
                    <SelectTrigger className="h-9 text-xs px-2 bg-background/50 dark:bg-background/20 border-input/60">
                        <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                        {["Srinagar", "Pahalgam", "Gulmarg", "Sonamarg", "Yusmarg", "Gurez", "Doodhpathri"].map(loc => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="col-span-1 md:col-span-1">
                {item.isCustom ? (
                    <div className="relative">
                        <Input
                            value={item.name}
                            onChange={(e) => updateRow(index, "name", e.target.value)}
                            className="h-9 text-xs"
                            placeholder="Enter Hotel Name"
                            autoFocus
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-9 w-6 text-muted-foreground hover:text-red-500"
                            onClick={() => {
                                updateRow(index, "isCustom", false);
                                updateRow(index, "name", "");
                                updateRow(index, "rate", 0);
                            }}
                            title="Back to List"
                        >
                            <span className="text-xs">×</span>
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <SearchableHotelSelect
                            value={item.hotelId}
                            availableHotels={filteredHotels}
                            onValueChange={(val) => {
                                const hotel = availableHotels.find((h: any) => h.id === val);
                                updateRow(index, "hotelId", val);
                                updateRow(index, "name", hotel?.name || "");
                                if (hotel?.rooms?.length > 0) {
                                    updateRow(index, "roomTypeId", hotel.rooms[0].id);
                                }
                            }}
                            onCustomSelect={() => {
                                updateRow(index, "isCustom", true);
                                updateRow(index, "hotelId", undefined);
                                updateRow(index, "roomTypeId", undefined);
                                updateRow(index, "name", "");
                                updateRow(index, "rate", 0);
                            }}
                        />

                        {/* INLINE EXPIRY ALERT */}
                        {(() => {
                            if (selectedHotel && item.roomTypeId) {
                                const room = selectedHotel.rooms.find((r: any) => r.id === item.roomTypeId);
                                if (room) {
                                    const checkDate = getStartOfDay(startDate);
                                    const seasonalRate = room.rates?.find((rate: any) => {
                                        const from = getStartOfDay(rate.validFrom);
                                        const to = getStartOfDay(rate.validTo);
                                        return checkDate >= from && checkDate <= to;
                                    });

                                    // Check Expiry Logic
                                    if (seasonalRate && seasonalRate.bookingValidUntil) {
                                        const bookingDeadline = getStartOfDay(seasonalRate.bookingValidUntil);
                                        // Only show alert if TODAY is past deadline
                                        const isTodayExpired = getStartOfDay(new Date()) > bookingDeadline;

                                        if (isTodayExpired) {
                                            return (
                                                <div className="text-[10px] bg-red-100 text-red-600 p-1 rounded border border-red-200 flex items-center gap-1 font-medium animate-pulse">
                                                    <span className="text-xs">⚠️</span>
                                                    Deadline Passed ({format(bookingDeadline, 'dd MMM')})! Please enter rate.
                                                </div>
                                            )
                                        }
                                    }
                                }
                            }
                            return null;
                        })()}
                    </div>
                )}
            </div>

            <div className="col-span-1 md:col-span-1">
                {item.isCustom ? (
                    <Input
                        value={item.roomTypeId || ""} // reusing roomTypeId field for custom room name
                        onChange={(e) => updateRow(index, "roomTypeId", e.target.value)}
                        className="h-9 text-xs"
                        placeholder="Room Type"
                    />
                ) : (
                    <Select
                        value={item.roomTypeId}
                        onValueChange={(val) => updateRow(index, "roomTypeId", val)}
                        disabled={!item.hotelId}
                    >
                        <SelectTrigger className="h-9 text-xs bg-background/50 dark:bg-background/20 border-input/60">
                            <SelectValue placeholder="Room" />
                        </SelectTrigger>
                        <SelectContent>
                            {roomTypes.map((r: any) => (
                                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <div className="col-span-1 md:col-span-1">
                <Select
                    value={item.plan}
                    onValueChange={(val) => updateRow(index, "plan", val)}
                >
                    <SelectTrigger className="h-9 text-xs px-1 bg-background/50 dark:bg-background/20 border-input/60">
                        <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EP">EP</SelectItem>
                        <SelectItem value="CP">CP</SelectItem>
                        <SelectItem value="MAP">MAP</SelectItem>
                        <SelectItem value="AP">AP</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="col-span-1 md:col-span-1">
                <div className="relative">
                    <Input
                        type="number"
                        min="0"
                        value={item.rate || ""}
                        onChange={(e) => updateRow(index, "rate", parseFloat(e.target.value) || 0)}
                        className={cn(
                            "h-9 px-2 text-center transition-colors bg-background/50 dark:bg-background/20 border-input/60",
                            // Dynamic Error Styling
                            (selectedHotel?.rateValidUntil && getStartOfDay(selectedHotel.rateValidUntil) < getStartOfDay(startDate))
                                ? "border-red-500 bg-red-50 text-red-900 focus-visible:ring-red-500"
                                : ""
                        )}
                        placeholder="Rate"
                        title={
                            (selectedHotel?.rateValidUntil && getStartOfDay(selectedHotel.rateValidUntil) < getStartOfDay(startDate))
                                ? `Rates Expired! Valid until: ${new Date(selectedHotel.rateValidUntil).toLocaleDateString()}`
                                : "Rate per Night"
                        }
                    />
                    {/* Visual Warning Icon */}
                    {(selectedHotel?.rateValidUntil && getStartOfDay(selectedHotel.rateValidUntil) < getStartOfDay(startDate)) && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full shadow-sm pointer-events-none">
                            EXP
                        </div>
                    )}
                </div>
            </div>

            <div className="col-span-1 md:col-span-1">
                <Input
                    type="number"
                    min="0"
                    value={item.extraBedCount || ""}
                    onChange={(e) => updateRow(index, "extraBedCount", parseInt(e.target.value) || 0)}
                    className="h-9 px-1 text-center bg-background/50 dark:bg-background/20 border-input/60"
                    placeholder="Ex. Bed"
                    title={`Extra Bed Rate: ₹${item.extraBedRate || 0}`}
                />
            </div>

            <div className="flex gap-1 col-span-1 md:col-span-1">
                <Input
                    type="number"
                    min="1"
                    value={item.rooms || ""}
                    onChange={(e) => updateRow(index, "rooms", parseInt(e.target.value) || 0)}
                    className="h-9 px-1 text-center bg-background/50 dark:bg-background/20 border-input/60"
                    title="Rooms"
                    placeholder="Rooms"
                />
            </div>

            <div className="flex col-span-1 md:col-span-1">
                <Input
                    type="number"
                    min="1"
                    value={item.nights || ""}
                    onChange={(e) => updateRow(index, "nights", parseInt(e.target.value) || 0)}
                    className="h-9 px-1 text-center bg-background/50 dark:bg-background/20 border-input/60"
                    title="Nights"
                    placeholder="Nights"
                    onKeyDown={(e) => e.stopPropagation()}
                />
            </div>

            <div className="absolute top-2 right-2 md:-right-8 md:top-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => removeRow(item.id)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div >
    );
}

// --- Section Components ---

export function HotelCalculator({
    items,
    setItems,
    total,
    availableHotels,
    startDate,
    setStartDate
}: {
    items: HotelItem[];
    setItems: (items: HotelItem[]) => void;
    total: number;
    availableHotels: any[];
    startDate: Date;
    setStartDate: (date: Date) => void;
}) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addRow = () => {
        setItems([...items, { id: Date.now().toString(), type: "Hotel", location: "Srinagar", name: "", rate: 0, rooms: 1, nights: 1, plan: "MAP" }]);
    };

    const removeRow = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const updateRow = (index: number, field: keyof HotelItem, value: any) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    };

    return (
        <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-lg text-lg">🏨</span>
                        Hotels & Stays
                    </CardTitle>
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-900/50">
                            ₹{total.toLocaleString("en-IN")}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="hidden md:grid grid-cols-[30px_120px_minmax(180px,_3fr)_minmax(160px,_2fr)_80px_90px_80px_70px_70px] gap-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-6 px-2">
                    <div></div> {/* Drag Handle Spacer */}
                    <div>Location</div>
                    <div>Property</div>
                    <div>Room Type</div>
                    <div>Plan</div>
                    <div>Rate (₹)</div>
                    <div className="text-center">Extra Bed</div>
                    <div className="text-center">Rooms</div>
                    <div className="text-center">Nights</div>
                </div>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-2">
                            {items.map((item, index) => (
                                <SortableHotelRow
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    updateRow={updateRow}
                                    removeRow={removeRow}
                                    availableHotels={availableHotels}
                                    startDate={startDate}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addRow}
                    className="w-full border border-dashed border-border text-muted-foreground hover:text-blue-600 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Hotel
                </Button>
            </CardContent>
        </Card>
    );
}

export function TransportCalculator({
    items,
    setItems,
    total,
    availableTransports = []
}: {
    items: TransportItem[];
    setItems: (items: TransportItem[]) => void;
    total: number;
    availableTransports?: any[];
}) {
    const addRow = () => {
        setItems([...items, { id: Date.now().toString(), type: "", rate: 0, days: 1 }]);
    };

    const removeRow = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const updateRow = (index: number, field: keyof TransportItem, value: any) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    return (
        <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg text-lg">🚖</span>
                        Transport & Cabs
                    </CardTitle>
                    <div className="text-sm font-medium px-3 py-1 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full border border-orange-100 dark:border-orange-900/50">
                        ₹{total.toLocaleString("en-IN")}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-12 gap-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-6 px-2">
                    <div className="col-span-5 md:col-span-6 lg:col-span-7">Vehicle Type</div>
                    <div className="col-span-4 md:col-span-3 lg:col-span-2">Rate/Day (₹)</div>
                    <div className="col-span-2 text-center">Days</div>
                    <div className="col-span-1"></div>
                </div>

                {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center group py-4 border-b border-border/50 last:border-0 border-dashed">
                        <div className="col-span-5 md:col-span-6 lg:col-span-7">
                            {item.isCustom ? (
                                <div className="relative">
                                    <Input
                                        value={item.type}
                                        onChange={(e) => updateRow(index, "type", e.target.value)}
                                        className="h-9"
                                        placeholder="Enter Vehicle Name"
                                        autoFocus
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-9 w-6 text-muted-foreground hover:text-red-500"
                                        onClick={() => {
                                            updateRow(index, "isCustom", false);
                                            updateRow(index, "type", "");
                                            updateRow(index, "rate", 0);
                                        }}
                                        title="Back to List"
                                    >
                                        <span className="text-xs">×</span>
                                    </Button>
                                </div>
                            ) : (
                                <Select
                                    value={availableTransports.find(t => t.name === item.type || t.id === item.type)?.id || (item.isCustom ? "custom" : "")}
                                    onValueChange={(val) => {
                                        if (val === "custom") {
                                            updateRow(index, "isCustom", true);
                                            updateRow(index, "type", "");
                                            updateRow(index, "rate", 0);
                                        } else {
                                            const selected = availableTransports.find(t => t.id === val);
                                            if (selected) {
                                                updateRow(index, "type", selected.name);
                                                updateRow(index, "rate", selected.rate);
                                            } else {
                                                updateRow(index, "type", val);
                                            }
                                        }
                                    }}
                                >
                                    <SelectTrigger className="h-9 bg-background/50 dark:bg-background/20 border-input/60">
                                        <SelectValue placeholder="Select Vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableTransports.map((t: any) => (
                                            <SelectItem key={t.id} value={t.id}>
                                                {t.name} ({t.type})
                                            </SelectItem>
                                        ))}
                                        <SelectItem value="custom" className="text-orange-600 font-medium border-t mt-1">
                                            + Custom / Not Listed
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                        <div className="col-span-4 md:col-span-3 lg:col-span-2">
                            <CurrencyInput
                                value={item.rate}
                                onChange={(val) => updateRow(index, "rate", val)}
                            />
                        </div>
                        <div className="col-span-2 md:col-span-2 lg:col-span-2">
                            <Input
                                type="number"
                                min="0"
                                value={item.days || ""}
                                onChange={(e) => updateRow(index, "days", parseInt(e.target.value) || 0)}
                                className="text-center bg-background/50 dark:bg-background/20 border-input/60"
                            />
                        </div>
                        <div className="col-span-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                onClick={() => removeRow(item.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addRow}
                    className="w-full border border-dashed border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 bg-orange-50/50 dark:bg-orange-950/20 hover:bg-orange-100/50 dark:hover:bg-orange-900/40 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Vehicle
                </Button>
            </CardContent>
        </Card>
    );
}

export function ActivityCalculator({
    items,
    setItems,
    total,
}: {
    items: ActivityItem[];
    setItems: (items: ActivityItem[]) => void;
    total: number;
}) {
    const addRow = () => {
        setItems([...items, { id: Date.now().toString(), name: "", rate: 0, quantity: 1 }]);
    };

    const removeRow = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const updateRow = (index: number, field: keyof ActivityItem, value: any) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    return (
        <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2 rounded-lg text-lg">🎿</span>
                        Activities & Extras
                    </CardTitle>
                    <div className="text-sm font-medium px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full border border-purple-100 dark:border-purple-900/50">
                        ₹{total.toLocaleString("en-IN")}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-12 gap-3 text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 px-1">
                    <div className="col-span-5">Activity</div>
                    <div className="col-span-3">Rate (₹)</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-1"></div>
                </div>

                {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-center group">
                        <div className="col-span-5">
                            <Input
                                placeholder="e.g. Shikara Ride"
                                value={item.name}
                                onChange={(e) => updateRow(index, "name", e.target.value)}
                            />
                        </div>
                        <div className="col-span-3">
                            <CurrencyInput
                                value={item.rate}
                                onChange={(val) => updateRow(index, "rate", val)}
                            />
                        </div>
                        <div className="col-span-3">
                            <Input
                                type="number"
                                min="0"
                                value={item.quantity || ""}
                                onChange={(e) => updateRow(index, "quantity", parseInt(e.target.value) || 0)}
                                className="text-center"
                            />
                        </div>
                        <div className="col-span-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                onClick={() => removeRow(item.id)}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addRow}
                    className="w-full border border-dashed border-border text-muted-foreground hover:text-purple-600 hover:border-purple-500/50 hover:bg-purple-50/50 dark:hover:bg-purple-950/20"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Activity
                </Button>
            </CardContent>
        </Card>
    );
}
