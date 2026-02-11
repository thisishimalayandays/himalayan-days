"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

// --- Types ---
export interface HotelItem {
    id: string;
    type: string;
    location: string;
    name: string;
    rate: number;
    rooms: number;
    nights: number;
}

export interface TransportItem {
    id: string;
    type: string;
    rate: number;
    days: number;
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

// --- Sortable Row Component ---
function SortableHotelRow({
    item,
    index,
    updateRow,
    removeRow
}: {
    item: HotelItem;
    index: number;
    updateRow: (index: number, field: keyof HotelItem, value: any) => void;
    removeRow: (id: string) => void;
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

    return (
        <div ref={setNodeRef} style={style} className={`grid grid-cols-12 gap-2 items-center group bg-background ${isDragging ? "shadow-lg ring-1 ring-blue-500/20 rounded-md opacity-80" : ""}`}>
            {/* Drag Handle */}
            <div className="col-span-1 flex justify-center cursor-move touch-none" {...attributes} {...listeners}>
                <GripVertical className="w-4 h-4 text-muted-foreground/50 hover:text-foreground transition-colors" />
            </div>

            <div className="col-span-2">
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                    value={item.type}
                    onChange={(e) => updateRow(index, "type", e.target.value)}
                >
                    <option value="Hotel">Hotel</option>
                    <option value="Houseboat">Houseboat</option>
                </select>
            </div>
            <div className="col-span-2">
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                    value={item.location}
                    onChange={(e) => updateRow(index, "location", e.target.value)}
                >
                    <option value="Srinagar">Srinagar</option>
                    <option value="Gulmarg">Gulmarg</option>
                    <option value="Pahalgam">Pahalgam</option>
                    <option value="Sonmarg">Sonmarg</option>
                </select>
            </div>
            <div className="col-span-3">
                <Input
                    placeholder="Property Name"
                    value={item.name}
                    onChange={(e) => updateRow(index, "name", e.target.value)}
                    className="bg-background"
                />
            </div>
            <div className="col-span-2">
                <CurrencyInput
                    value={item.rate}
                    onChange={(val) => updateRow(index, "rate", val)}
                />
            </div>
            <div className="col-span-1">
                <Input
                    type="number"
                    min="0"
                    value={item.rooms || ""}
                    onChange={(e) => updateRow(index, "rooms", parseInt(e.target.value) || 0)}
                    className="px-2 text-center"
                />
            </div>
            <div className="col-span-1">
                <Input
                    type="number"
                    min="0"
                    value={item.nights || ""}
                    onChange={(e) => updateRow(index, "nights", parseInt(e.target.value) || 0)}
                    className="px-2 text-center"
                    onKeyDown={(e) => {
                        // Prevent drag trigger when typing/navigating in input
                        e.stopPropagation();
                    }}
                />
            </div>
            <div className="absolute -right-8 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
    );
}

// --- Section Components ---

export function HotelCalculator({
    items,
    setItems,
    total,
}: {
    items: HotelItem[];
    setItems: (items: HotelItem[]) => void;
    total: number;
}) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addRow = () => {
        setItems([...items, { id: Date.now().toString(), type: "Hotel", location: "Srinagar", name: "", rate: 0, rooms: 1, nights: 1 }]);
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
                    <div className="text-sm font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-900/50">
                        ₹{total.toLocaleString("en-IN")}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-12 gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 px-1 pl-6">
                    <div className="col-span-2">Type</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-3">Property Name</div>
                    <div className="col-span-2">Rate (₹)</div>
                    <div className="col-span-1">Rms</div>
                    <div className="col-span-1">Nts</div>
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
}: {
    items: TransportItem[];
    setItems: (items: TransportItem[]) => void;
    total: number;
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
            <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-12 gap-3 text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-2 px-1">
                    <div className="col-span-5">Vehicle Type</div>
                    <div className="col-span-3">Rate/Day (₹)</div>
                    <div className="col-span-3">Days</div>
                    <div className="col-span-1"></div>
                </div>

                {items.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-center group">
                        <div className="col-span-5">
                            <Input
                                placeholder="e.g. Innova Crysta"
                                value={item.type}
                                onChange={(e) => updateRow(index, "type", e.target.value)}
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
                                value={item.days || ""}
                                onChange={(e) => updateRow(index, "days", parseInt(e.target.value) || 0)}
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
                    className="w-full border border-dashed border-border text-muted-foreground hover:text-orange-600 hover:border-orange-500/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20"
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
                    <div className="col-span-3">Quantity</div>
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
