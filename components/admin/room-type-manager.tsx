"use client";

import { useState } from "react";
import { RoomType, RoomRate } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { addRoomType, updateRoomType, deleteRoomType, addRoomRate, updateRoomRate, deleteRoomRate } from "@/app/actions/hotels";
import { toast } from "sonner";
import { Plus, Trash, Save, Edit, Loader2, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface RoomTypeWithRates extends RoomType {
    rates: RoomRate[];
}

interface RoomTypeManagerProps {
    hotelId: string;
    rooms: RoomTypeWithRates[];
}

export function RoomTypeManager({ hotelId, rooms }: RoomTypeManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<RoomType | null>(null);
    const [loading, setLoading] = useState(false);

    // Rate Management State
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [isAddRateOpen, setIsAddRateOpen] = useState(false);
    const [activeRateId, setActiveRateId] = useState<string | null>(null);

    // Derived active room for the Manage Rates Dialog
    const activeRoom = rooms.find(r => r.id === activeRoomId);

    const [rateFormData, setRateFormData] = useState<any>({
        validFrom: new Date(),
        validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        priceEP: "", priceCP: "", priceMAP: "", priceAP: "", extraBed: "",
        extraBedEP: "", extraBedCP: "", extraBedMAP: "", extraBedAP: "",
        bookingValidUntil: undefined
    });

    // Room Form State
    const [formData, setFormData] = useState<any>({
        name: "",
        baseRate: "", // Unused?
        priceEP: "",
        priceCP: "",
        priceMAP: "",
        priceAP: "",
        extraBed: "",
    });

    const resetForm = () => {
        setFormData({
            name: "",
            baseRate: "",
            priceEP: "",
            priceCP: "",
            priceMAP: "",
            priceAP: "",
            extraBed: "",
        });
        setEditingRoom(null);
    };

    const handleOpen = (room?: RoomType) => {
        if (room) {
            setEditingRoom(room);
            setFormData({
                name: room.name,
                baseRate: room.baseRate,
                priceEP: room.priceEP,
                priceCP: room.priceCP,
                priceMAP: room.priceMAP,
                priceAP: room.priceAP,
                extraBed: room.extraBed,
            });
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        if (!formData.name) return toast.error("Room name is required");
        setLoading(true);

        const payload = {
            ...formData,
            baseRate: Number(formData.baseRate) || 0,
            priceEP: Number(formData.priceEP) || 0,
            priceCP: Number(formData.priceCP) || 0,
            priceMAP: Number(formData.priceMAP) || 0,
            priceAP: Number(formData.priceAP) || 0,
            extraBed: Number(formData.extraBed) || 0,
        };

        try {
            if (editingRoom) {
                const res = await updateRoomType(editingRoom.id, payload);
                if (res.success) {
                    toast.success("Room updated!");
                    setIsDialogOpen(false);
                } else {
                    toast.error(res.error);
                }
            } else {
                const res = await addRoomType(hotelId, payload);
                if (res.success) {
                    toast.success("Room added!");
                    setIsDialogOpen(false);
                } else {
                    toast.error(res.error);
                }
            }
        } catch (e) {
            toast.error("Failed to save room");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this room type?")) {
            await deleteRoomType(id);
            toast.success("Room deleted");
        }
    };

    // --- Rate Handlers ---

    const openManageRates = (roomId: string) => {
        setActiveRoomId(roomId);
    };

    const closeManageRates = () => {
        setActiveRoomId(null);
    }

    const handleAddRateClick = () => {
        setActiveRateId(null);
        setRateFormData({
            validFrom: new Date(),
            validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            priceEP: "", priceCP: "", priceMAP: "", priceAP: "",
            extraBed: "", // Fallback
            extraBedEP: "", extraBedCP: "", extraBedMAP: "", extraBedAP: "",
            bookingValidUntil: undefined
        });
        setIsAddRateOpen(true);
    }

    const editRate = (rate: RoomRate) => {
        setRateFormData({
            validFrom: new Date(rate.validFrom),
            validTo: new Date(rate.validTo),
            priceEP: rate.priceEP,
            priceCP: rate.priceCP,
            priceMAP: rate.priceMAP,
            priceAP: rate.priceAP,
            extraBed: rate.extraBed,
            extraBedEP: rate.extraBedEP,
            extraBedCP: rate.extraBedCP,
            extraBedMAP: rate.extraBedMAP,
            extraBedAP: rate.extraBedAP,
            // @ts-ignore
            bookingValidUntil: rate.bookingValidUntil ? new Date(rate.bookingValidUntil) : undefined
        });
        setActiveRateId(rate.id);
        setIsAddRateOpen(true);
    }

    const handleRateSubmit = async () => {
        if (!activeRoomId) return;
        setLoading(true);

        const payload = {
            ...rateFormData,
            priceEP: Number(rateFormData.priceEP) || 0,
            priceCP: Number(rateFormData.priceCP) || 0,
            priceMAP: Number(rateFormData.priceMAP) || 0,
            priceAP: Number(rateFormData.priceAP) || 0,
            extraBed: Number(rateFormData.extraBed) || 0,
            extraBedEP: Number(rateFormData.extraBedEP) || 0,
            extraBedCP: Number(rateFormData.extraBedCP) || 0,
            extraBedMAP: Number(rateFormData.extraBedMAP) || 0,
            extraBedAP: Number(rateFormData.extraBedAP) || 0,
            bookingValidUntil: rateFormData.bookingValidUntil || null,
        };

        try {
            let res;
            if (activeRateId) {
                res = await updateRoomRate(activeRateId, payload);
            } else {
                res = await addRoomRate(activeRoomId, payload);
            }

            if (res.success) {
                toast.success(activeRateId ? "Rate updated!" : "Seasonal rate added!");
                setIsAddRateOpen(false);
                setActiveRateId(null);
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Failed to save rate");
        } finally {
            setLoading(false);
        }
    };

    const deleteRate = async (id: string) => {
        if (confirm("Delete this rate period?")) {
            await deleteRoomRate(id);
            toast.success("Rate deleted");
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Room Types & Rates</CardTitle>
                <Button onClick={() => handleOpen()} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" /> Add Room Type
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {rooms.length === 0 ? (
                        <p className="text-muted-foreground text-sm text-center py-4">No room types added yet.</p>
                    ) : (
                        <div className="grid gap-4">
                            {rooms.map((room) => (
                                <div key={room.id} className="border rounded-lg bg-card overflow-hidden">
                                    <div className="flex items-center justify-between p-4 hover:bg-accent/5 transition-colors">
                                        <div className="flex-1">
                                            <div className="font-semibold flex items-center gap-2">
                                                {room.name}
                                                {room.rates.length > 0 && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{room.rates.length} Seasons</span>}
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                                <div className="inline-flex items-center px-2 py-1 rounded-md bg-muted/50 text-muted-foreground border">
                                                    Base EP: <span className="font-semibold text-foreground ml-1">₹{room.priceEP}</span>
                                                </div>
                                                <div className="inline-flex items-center px-2 py-1 rounded-md bg-muted/50 text-muted-foreground border">
                                                    Base MAP: <span className="font-semibold text-foreground ml-1">₹{room.priceMAP}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openManageRates(room.id)}
                                                className="h-8 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900"
                                            >
                                                <Calendar className="w-3.5 h-3.5 mr-2" /> Manage Rates
                                            </Button>
                                            <div className="w-px h-6 bg-border mx-1"></div>
                                            <Button variant="ghost" size="icon" onClick={() => handleOpen(room)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(room.id)}>
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Room Add/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingRoom ? "Edit Room Type" : "Add Room Type"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="space-y-2">
                                <Label>Room Name / Category</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Deluxe Room, Suite"
                                />
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted/50 text-muted-foreground font-medium">
                                        <tr>
                                            <th className="p-4 w-1/4">Rate Type</th>
                                            <th className="p-4 text-center">EP<br /><span className="text-[10px] font-normal">(Room Only)</span></th>
                                            <th className="p-4 text-center">CP<br /><span className="text-[10px] font-normal">(Breakfast)</span></th>
                                            <th className="p-4 text-center">MAP<br /><span className="text-[10px] font-normal">(B+D)</span></th>
                                            <th className="p-4 text-center">AP<br /><span className="text-[10px] font-normal">(All Meals)</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <tr>
                                            <td className="p-4 font-medium">Triple/Double Sharing</td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={formData.priceEP} onChange={(e) => setFormData({ ...formData, priceEP: e.target.value })} /></td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={formData.priceCP} onChange={(e) => setFormData({ ...formData, priceCP: e.target.value })} /></td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={formData.priceMAP} onChange={(e) => setFormData({ ...formData, priceMAP: e.target.value })} /></td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={formData.priceAP} onChange={(e) => setFormData({ ...formData, priceAP: e.target.value })} /></td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium">Extra Bed Charges</td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={formData.extraBed} onChange={(e) => setFormData({ ...formData, extraBed: e.target.value })} /></td>
                                            <td className="p-3 text-center text-xs text-muted-foreground bg-muted/20 italic" colSpan={3}>
                                                Base extra bed rates. Use seasonal rates for date-specific pricing.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Manage Rates Dialog (Replaces Accordion) */}
                <Dialog open={!!activeRoomId} onOpenChange={(open) => !open && closeManageRates()}>
                    <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex justify-between items-center pr-8">
                                <span>Manage Rates: {activeRoom?.name}</span>
                                <Button size="sm" onClick={handleAddRateClick}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Seasonal Rate
                                </Button>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6 py-4">
                            {/* Base Rates Read-Only Summary */}
                            <div className="bg-muted/30 p-4 rounded-lg border">
                                <h4 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Default / Base Rates</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div><span className="text-muted-foreground mr-2">EP:</span> <span className="font-semibold">₹{activeRoom?.priceEP}</span></div>
                                    <div><span className="text-muted-foreground mr-2">CP:</span> <span className="font-semibold">₹{activeRoom?.priceCP}</span></div>
                                    <div><span className="text-muted-foreground mr-2">MAP:</span> <span className="font-semibold">₹{activeRoom?.priceMAP}</span></div>
                                    <div><span className="text-muted-foreground mr-2">AP:</span> <span className="font-semibold">₹{activeRoom?.priceAP}</span></div>
                                </div>
                            </div>

                            {/* Seasonal Rates List */}
                            <div>
                                <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Seasonal & Custom Rates</h4>
                                {activeRoom?.rates && activeRoom.rates.length > 0 ? (
                                    <div className="space-y-4">
                                        {activeRoom.rates.map(rate => (
                                            <div key={rate.id} className="bg-background rounded-md border shadow-sm overflow-hidden">
                                                {/* Rate Header */}
                                                <div className="flex justify-between items-center bg-muted/40 px-3 py-2 border-b">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1.5 text-blue-600 font-medium text-sm">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>{format(new Date(rate.validFrom), 'dd MMM yyyy')}</span>
                                                            <span className="text-muted-foreground">-</span>
                                                            <span>{format(new Date(rate.validTo), 'dd MMM yyyy')}</span>
                                                        </div>
                                                        {/* @ts-ignore */}
                                                        {rate.bookingValidUntil && (
                                                            <span className="ml-2 text-[10px] uppercase tracking-wider font-semibold bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-900">
                                                                {/* @ts-ignore */}
                                                                Book by: {format(new Date(rate.bookingValidUntil), 'dd MMM')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-blue-500 hover:bg-blue-50" onClick={() => editRate(rate)}>
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-50" onClick={() => deleteRate(rate.id)}>
                                                            <Trash className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Rate Table */}
                                                <div className="p-0">
                                                    <table className="w-full text-xs text-left">
                                                        <thead className="bg-muted/20 text-muted-foreground font-medium">
                                                            <tr>
                                                                <th className="p-2 pl-3 w-24">Type</th>
                                                                <th className="p-2 text-center text-foreground/80">EP</th>
                                                                <th className="p-2 text-center text-foreground/80">CP</th>
                                                                <th className="p-2 text-center text-foreground/80">MAP</th>
                                                                <th className="p-2 text-center text-foreground/80">AP</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y">
                                                            <tr>
                                                                <td className="p-2 pl-3 font-medium text-muted-foreground">Room Rate</td>
                                                                <td className="p-2 text-center font-medium">₹{rate.priceEP}</td>
                                                                <td className="p-2 text-center font-medium">₹{rate.priceCP}</td>
                                                                <td className="p-2 text-center font-medium">₹{rate.priceMAP}</td>
                                                                <td className="p-2 text-center font-medium">₹{rate.priceAP}</td>
                                                            </tr>
                                                            <tr className="bg-muted/5">
                                                                <td className="p-2 pl-3 font-medium text-muted-foreground">Extra Bed</td>
                                                                {/* @ts-ignore */}
                                                                <td className="p-2 text-center text-muted-foreground">₹{rate.extraBedEP || rate.extraBed}</td>
                                                                {/* @ts-ignore */}
                                                                <td className="p-2 text-center text-muted-foreground">₹{rate.extraBedCP || rate.extraBed}</td>
                                                                {/* @ts-ignore */}
                                                                <td className="p-2 text-center text-muted-foreground">₹{rate.extraBedMAP || rate.extraBed}</td>
                                                                {/* @ts-ignore */}
                                                                <td className="p-2 text-center text-muted-foreground">₹{rate.extraBedAP || rate.extraBed}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
                                        <div className="bg-background rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center shadow-sm">
                                            <Calendar className="w-6 h-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-sm font-semibold">No seasonal rates yet</h3>
                                        <p className="text-xs text-muted-foreground mt-1 mb-4 max-w-xs mx-auto">
                                            Add custom rates for specific dates (e.g., Summer Peak, Diwali) to override the base rates.
                                        </p>
                                        <Button size="sm" variant="outline" onClick={handleAddRateClick}>
                                            <Plus className="w-3.5 h-3.5 mr-2" /> Add First Seasonal Rate
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Add Rate Dialog (Nested or stacked) */}
                <Dialog open={isAddRateOpen} onOpenChange={setIsAddRateOpen}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>{activeRateId ? "Edit Seasonal Rate" : "Add Seasonal Rate"}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Valid From</Label>
                                    <Input
                                        type="date"
                                        value={rateFormData.validFrom ? format(rateFormData.validFrom, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => setRateFormData({ ...rateFormData, validFrom: new Date(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Valid To</Label>
                                    <Input
                                        type="date"
                                        value={rateFormData.validTo ? format(rateFormData.validTo, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => setRateFormData({ ...rateFormData, validTo: new Date(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Book By (Optional)</Label>
                                    <Input
                                        type="date"
                                        value={rateFormData.bookingValidUntil ? format(rateFormData.bookingValidUntil, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => setRateFormData({ ...rateFormData, bookingValidUntil: e.target.value ? new Date(e.target.value) : null })}
                                    />
                                </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground font-medium">
                                        <tr>
                                            <th className="p-3 w-1/5">Rate Type</th>
                                            <th className="p-3 text-center">EP (Room Only)</th>
                                            <th className="p-3 text-center">CP (Breakfast)</th>
                                            <th className="p-3 text-center">MAP (B+D)</th>
                                            <th className="p-3 text-center">AP (All Meals)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {/* Room Rates */}
                                        <tr>
                                            <td className="p-3 font-medium">Double Occupancy</td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={rateFormData.priceEP} onChange={(e) => setRateFormData({ ...rateFormData, priceEP: e.target.value })} /></td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={rateFormData.priceCP} onChange={(e) => setRateFormData({ ...rateFormData, priceCP: e.target.value })} /></td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={rateFormData.priceMAP} onChange={(e) => setRateFormData({ ...rateFormData, priceMAP: e.target.value })} /></td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={rateFormData.priceAP} onChange={(e) => setRateFormData({ ...rateFormData, priceAP: e.target.value })} /></td>
                                        </tr>
                                        {/* Extra Bed Rates */}
                                        <tr>
                                            <td className="p-3 font-medium">Extra Bed / Pax</td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={rateFormData.extraBedEP} onChange={(e) => setRateFormData({ ...rateFormData, extraBedEP: e.target.value })} /></td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={rateFormData.extraBedCP} onChange={(e) => setRateFormData({ ...rateFormData, extraBedCP: e.target.value })} /></td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={rateFormData.extraBedMAP} onChange={(e) => setRateFormData({ ...rateFormData, extraBedMAP: e.target.value })} /></td>
                                            <td className="p-2"><Input type="number" className="h-11 text-center font-medium shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="₹0" value={rateFormData.extraBedAP} onChange={(e) => setRateFormData({ ...rateFormData, extraBedAP: e.target.value })} /></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsAddRateOpen(false)}>Cancel</Button>
                            <Button onClick={handleRateSubmit} disabled={loading}>
                                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Add Rate
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
