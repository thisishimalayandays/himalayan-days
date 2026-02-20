"use client";

import { useState, useMemo } from "react";
import { RoomType, RoomRate } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateSeasonalRates, deleteRoomRate } from "@/app/actions/hotels";
import { toast } from "sonner";
import { Plus, Trash, Save, Edit, Loader2, Calendar, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { format, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface RoomTypeWithRates extends RoomType {
    rates: RoomRate[];
}

interface SeasonalRateManagerProps {
    hotelId: string;
    rooms: RoomTypeWithRates[];
}

interface Season {
    id: string; // Composite key of dates
    validFrom: Date;
    validTo: Date;
    bookingValidUntil?: Date | null;
    rates: {
        roomTypeId: string;
        rateId?: string;
        priceEP: number;
        priceCP: number;
        priceMAP: number;
        priceAP: number;
        extraBed: number;
        extraBedEP: number;
        extraBedCP: number;
        extraBedMAP: number;
        extraBedAP: number;
    }[];
}

export function SeasonalRateManager({ hotelId, rooms }: SeasonalRateManagerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editingSeason, setEditingSeason] = useState<Season | null>(null);

    // Group rates into seasons
    const seasons = useMemo(() => {
        const seasonMap = new Map<string, Season>();

        rooms.forEach((room) => {
            room.rates.forEach((rate) => {
                const key = `${rate.validFrom.toISOString()}-${rate.validTo.toISOString()}`;

                if (!seasonMap.has(key)) {
                    seasonMap.set(key, {
                        id: key,
                        validFrom: new Date(rate.validFrom),
                        validTo: new Date(rate.validTo),
                        // @ts-ignore
                        bookingValidUntil: rate.bookingValidUntil ? new Date(rate.bookingValidUntil) : null,
                        rates: []
                    });
                }

                const season = seasonMap.get(key)!;
                season.rates.push({
                    roomTypeId: room.id,
                    rateId: rate.id,
                    priceEP: rate.priceEP,
                    priceCP: rate.priceCP,
                    priceMAP: rate.priceMAP,
                    priceAP: rate.priceAP,
                    extraBed: rate.extraBed,
                    extraBedEP: rate.extraBedEP,
                    extraBedCP: rate.extraBedCP,
                    extraBedMAP: rate.extraBedMAP,
                    extraBedAP: rate.extraBedAP,
                });
            });
        });

        return Array.from(seasonMap.values()).sort((a, b) => a.validFrom.getTime() - b.validFrom.getTime());
    }, [rooms]);

    const [formData, setFormData] = useState({
        validFrom: new Date(),
        validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        bookingValidUntil: undefined as Date | undefined,
        rates: {} as Record<string, {
            priceEP: string; priceCP: string; priceMAP: string; priceAP: string;
            extraBed: string;
            extraBedEP: string; extraBedCP: string; extraBedMAP: string; extraBedAP: string;
        }>
    });

    const initializeForm = (season?: Season) => {
        if (season) {
            const ratesMap: any = {};
            rooms.forEach(room => {
                const existingRate = season.rates.find(r => r.roomTypeId === room.id);
                if (existingRate) {
                    ratesMap[room.id] = {
                        priceEP: existingRate.priceEP.toString(),
                        priceCP: existingRate.priceCP.toString(),
                        priceMAP: existingRate.priceMAP.toString(),
                        priceAP: existingRate.priceAP.toString(),
                        extraBed: existingRate.extraBed.toString(),
                        extraBedEP: existingRate.extraBedEP.toString(),
                        extraBedCP: existingRate.extraBedCP.toString(),
                        extraBedMAP: existingRate.extraBedMAP.toString(),
                        extraBedAP: existingRate.extraBedAP.toString(),
                    };
                } else {
                    // Default to room base rates if not found in season (partial season)
                    ratesMap[room.id] = {
                        priceEP: room.priceEP.toString(),
                        priceCP: room.priceCP.toString(),
                        priceMAP: room.priceMAP.toString(),
                        priceAP: room.priceAP.toString(),
                        extraBed: room.extraBed.toString(),
                        extraBedEP: room.extraBedEP.toString(),
                        extraBedCP: room.extraBedCP.toString(),
                        extraBedMAP: room.extraBedMAP.toString(),
                        extraBedAP: room.extraBedAP.toString(),
                    };
                }
            });

            setFormData({
                validFrom: season.validFrom,
                validTo: season.validTo,
                bookingValidUntil: season.bookingValidUntil || undefined,
                rates: ratesMap
            });
            setEditingSeason(season);
        } else {
            // New Season - Initialize with Room Base Rates
            const ratesMap: any = {};
            rooms.forEach(room => {
                ratesMap[room.id] = {
                    priceEP: room.priceEP.toString(),
                    priceCP: room.priceCP.toString(),
                    priceMAP: room.priceMAP.toString(),
                    priceAP: room.priceAP.toString(),
                    extraBed: room.extraBed.toString(),
                    extraBedEP: room.extraBedEP.toString(),
                    extraBedCP: room.extraBedCP.toString(),
                    extraBedMAP: room.extraBedMAP.toString(),
                    extraBedAP: room.extraBedAP.toString(),
                };
            });

            setFormData({
                validFrom: new Date(),
                validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                bookingValidUntil: undefined,
                rates: ratesMap
            });
            setEditingSeason(null);
        }
        setIsDialogOpen(true);
    };

    const handleRateChange = (roomId: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            rates: {
                ...prev.rates,
                [roomId]: {
                    ...prev.rates[roomId],
                    [field]: value
                }
            }
        }));
    };

    const handleApplyToAll = (field: string, value: string) => {
        setFormData(prev => {
            const newRates = { ...prev.rates };
            Object.keys(newRates).forEach(roomId => {
                // @ts-ignore
                newRates[roomId][field] = value;
            });
            return { ...prev, rates: newRates };
        });
        toast.info(`Applied ${value} to all rooms for ${field}`);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const ratesPayload = rooms.map(room => {
                const r = formData.rates[room.id];
                return {
                    roomTypeId: room.id,
                    priceEP: Number(r.priceEP) || 0,
                    priceCP: Number(r.priceCP) || 0,
                    priceMAP: Number(r.priceMAP) || 0,
                    priceAP: Number(r.priceAP) || 0,
                    extraBed: Number(r.extraBed) || 0,
                    extraBedEP: Number(r.extraBedEP) || 0,
                    extraBedCP: Number(r.extraBedCP) || 0,
                    extraBedMAP: Number(r.extraBedMAP) || 0,
                    extraBedAP: Number(r.extraBedAP) || 0,
                };
            });

            const res = await updateSeasonalRates(
                hotelId,
                formData.validFrom,
                formData.validTo,
                ratesPayload,
                formData.bookingValidUntil
            );

            if (res.success) {
                toast.success("Seasonal rates updated successfully!");
                setIsDialogOpen(false);
            } else {
                toast.error(res.error || "Failed to update seasonal rates");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSeason = async (season: Season) => {
        if (!confirm("Are you sure you want to delete this season and all its rates?")) return;

        try {
            // Delete all rates in this season
            // This is a client-side loop, not ideal but safe enough for small numbers
            // In a real app we'd want a bulk delete action
            let hasError = false;
            for (const rate of season.rates) {
                if (rate.rateId) {
                    const res = await deleteRoomRate(rate.rateId);
                    if (!res.success) hasError = true;
                }
            }
            if (!hasError) {
                toast.success("Season deleted");
            } else {
                toast.error("Some rates could not be deleted");
            }
        } catch (error) {
            toast.error("Failed to delete season");
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Seasonal Rate Calendar</CardTitle>
                    <CardDescription>Manage rates for specific date ranges across all rooms.</CardDescription>
                </div>
                <Button onClick={() => initializeForm()} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Add New Season
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {seasons.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/20">
                            <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                            <h3 className="font-medium text-lg">No Seasons Configured</h3>
                            <p className="text-muted-foreground mb-4">Add a date range to set special rates for that period.</p>
                            <Button onClick={() => initializeForm()} variant="outline">
                                Create First Season
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {seasons.map((season) => (
                                <div key={season.id} className="border rounded-xl bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-muted/20 border-b gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white dark:bg-card p-2 rounded-lg border shadow-sm">
                                                <Calendar className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-lg flex items-center gap-2">
                                                    {format(season.validFrom, 'dd MMM yyyy')}
                                                    <span className="text-muted-foreground text-sm font-normal">to</span>
                                                    {format(season.validTo, 'dd MMM yyyy')}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {Math.ceil((season.validTo.getTime() - season.validFrom.getTime()) / (1000 * 60 * 60 * 24))} Days • {season.rates.length} Rooms Configured
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {season.bookingValidUntil && (
                                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                    Book by {format(season.bookingValidUntil, 'dd MMM')}
                                                </Badge>
                                            )}
                                            <div className="h-6 w-px bg-border mx-2 hidden md:block"></div>
                                            <Button variant="outline" size="sm" onClick={() => initializeForm(season)}>
                                                <Edit className="w-4 h-4 mr-2" /> Edit Rates
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleDeleteSeason(season)}>
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Quick Preview of Rates */}
                                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-white dark:bg-card">
                                        {season.rates.slice(0, 4).map(rate => {
                                            const room = rooms.find(r => r.id === rate.roomTypeId);
                                            return (
                                                <div key={rate.roomTypeId} className="text-xs border rounded p-2 bg-muted/10">
                                                    <div className="font-medium truncate mb-1" title={room?.name}>{room?.name}</div>
                                                    <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                                                        <span>EP: <span className="text-foreground font-semibold">₹{rate.priceEP}</span></span>
                                                        <span>MAP: <span className="text-foreground font-semibold">₹{rate.priceMAP}</span></span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {season.rates.length > 4 && (
                                            <div className="flex items-center justify-center text-xs text-muted-foreground bg-muted/10 rounded border p-2">
                                                +{season.rates.length - 4} more rooms
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[95vh] overflow-y-auto w-full">
                        <DialogHeader>
                            <DialogTitle>{editingSeason ? "Edit Season Rates" : "Create New Season"}</DialogTitle>
                            <DialogDescription>
                                Set rates for all rooms for this specific date range.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 py-6">
                            <div className="space-y-6 lg:col-span-1 border-r lg:pr-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Valid From</Label>
                                        <Input
                                            type="date"
                                            value={formData.validFrom ? format(formData.validFrom, 'yyyy-MM-dd') : ''}
                                            onChange={(e) => setFormData({ ...formData, validFrom: new Date(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Valid To</Label>
                                        <Input
                                            type="date"
                                            value={formData.validTo ? format(formData.validTo, 'yyyy-MM-dd') : ''}
                                            onChange={(e) => setFormData({ ...formData, validTo: new Date(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Book By (Optional)</Label>
                                        <Input
                                            type="date"
                                            value={formData.bookingValidUntil ? format(formData.bookingValidUntil, 'yyyy-MM-dd') : ''}
                                            onChange={(e) => setFormData({ ...formData, bookingValidUntil: e.target.value ? new Date(e.target.value) : undefined })}
                                        />
                                        <p className="text-xs text-muted-foreground">If set, these rates are only valid for bookings made before this date.</p>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm flex items-center">
                                        <Copy className="w-3 h-3 mr-2" /> Bulk Apply
                                    </h4>
                                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">Copy values to all rooms to save time.</p>
                                    <div className="flex flex-col gap-2">
                                        <Button size="sm" variant="outline" className="text-xs w-full justify-start bg-white dark:bg-black" onClick={() => handleApplyToAll('extraBed', formData.rates[rooms[0]?.id]?.extraBed || '0')}>
                                            Apply Extra Bed
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-xs w-full justify-start bg-white dark:bg-black" onClick={() => handleApplyToAll('priceMAP', formData.rates[rooms[0]?.id]?.priceMAP || '0')}>
                                            Apply MAP
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-3 space-y-4">
                                <div className="border rounded-lg overflow-hidden shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted text-muted-foreground font-medium">
                                                <tr>
                                                    <th className="p-3 min-w-[200px] sticky left-0 bg-muted z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)]">Room Type</th>
                                                    <th className="p-3 text-center min-w-[100px]">EP</th>
                                                    <th className="p-3 text-center min-w-[100px]">CP</th>
                                                    <th className="p-3 text-center min-w-[100px]">MAP</th>
                                                    <th className="p-3 text-center min-w-[100px]">AP</th>
                                                    <th className="p-3 text-center min-w-[100px] border-l bg-muted/30">Ex. Bed</th>
                                                    <th className="p-3 text-center min-w-[100px] bg-muted/30">Ex. MAP</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {rooms.map(room => {
                                                    const rate = formData.rates[room.id] || {};
                                                    return (
                                                        <tr key={room.id} className="hover:bg-muted/5 group">
                                                            <td className="p-3 font-medium sticky left-0 bg-background shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] group-hover:bg-muted/5 border-r transition-colors">
                                                                {room.name}
                                                                <div className="text-[10px] text-muted-foreground font-normal">Base: ₹{room.priceMAP}</div>
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    className="h-9 px-2 text-center"
                                                                    placeholder="₹0"
                                                                    value={rate.priceEP}
                                                                    onChange={(e) => handleRateChange(room.id, 'priceEP', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    className="h-9 px-2 text-center"
                                                                    placeholder="₹0"
                                                                    value={rate.priceCP}
                                                                    onChange={(e) => handleRateChange(room.id, 'priceCP', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    className="h-9 px-2 text-center"
                                                                    placeholder="₹0"
                                                                    value={rate.priceMAP}
                                                                    onChange={(e) => handleRateChange(room.id, 'priceMAP', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <Input
                                                                    className="h-9 px-2 text-center"
                                                                    placeholder="₹0"
                                                                    value={rate.priceAP}
                                                                    onChange={(e) => handleRateChange(room.id, 'priceAP', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="p-2 border-l bg-muted/5">
                                                                <Input
                                                                    className="h-9 px-2 text-center bg-white dark:bg-card border-muted-foreground/30"
                                                                    placeholder="₹0"
                                                                    value={rate.extraBed}
                                                                    onChange={(e) => handleRateChange(room.id, 'extraBed', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="p-2 bg-muted/5">
                                                                <Input
                                                                    className="h-9 px-2 text-center bg-white dark:bg-card border-muted-foreground/30"
                                                                    placeholder="₹0"
                                                                    value={rate.extraBedMAP}
                                                                    onChange={(e) => handleRateChange(room.id, 'extraBedMAP', e.target.value)}
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t sticky bottom-0 bg-background z-20">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={loading} className="min-w-[120px]">
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Season
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
