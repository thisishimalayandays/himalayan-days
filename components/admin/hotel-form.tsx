"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createHotel, updateHotel } from "@/app/actions/hotels";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface HotelFormProps {
    hotel?: Hotel;
}

export function HotelForm({ hotel }: HotelFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Hotel>>({
        name: hotel?.name || "",
        location: hotel?.location || "Srinagar",
        type: hotel?.type || "Hotel",
        stars: hotel?.stars || 3,
        image: hotel?.image || "",
        address: hotel?.address || "",
        contact: hotel?.contact || "",
        email: hotel?.email || "",
        phone: hotel?.phone || "",
    });

    const isEdit = !!hotel;

    const handleChange = (field: keyof Hotel, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit && hotel) {
                const res = await updateHotel(hotel.id, formData);
                if (res.success) {
                    toast.success("Hotel updated successfully!");
                    router.refresh();
                } else {
                    toast.error(res.error || "Failed to update hotel");
                }
            } else {
                const res = await createHotel(formData);
                if (res.success && res.hotel) {
                    toast.success("Hotel created successfully!");
                    router.push(`/admin/hotels/${res.hotel.id}`);
                } else {
                    toast.error(res.error || "Failed to create hotel");
                }
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-bold">{isEdit ? "Edit Property" : "Add New Property"}</div>
                {loading && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />}
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="name">Property Name</Label>
                    <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="e.g. Grand Mumtaz"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <select
                        id="location"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={formData.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                    >
                        {["Srinagar", "Pahalgam", "Gulmarg", "Sonamarg", "Yusmarg", "Gurez", "Doodhpathri"].map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <select
                            id="type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={formData.type}
                            onChange={(e) => handleChange("type", e.target.value)}
                        >
                            <option value="Hotel">Hotel</option>
                            <option value="Houseboat">Houseboat</option>
                            <option value="Resort">Resort</option>
                            <option value="Homestay">Homestay</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stars">Star Rating</Label>
                        <select
                            id="stars"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            value={formData.stars}
                            onChange={(e) => handleChange("stars", Number(e.target.value))}
                        >
                            <option value={1}>1 Star</option>
                            <option value={2}>2 Star</option>
                            <option value={3}>3 Star</option>
                            <option value={4}>4 Star</option>
                            <option value={5}>5 Star</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="address">Address (Optional)</Label>
                    <Input
                        id="address"
                        value={formData.address || ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Complete address of the property"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="hotel@example.com"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={formData.phone || ""}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="+91 9906..."
                    />
                </div>

                {/* Base Rates Valid Until Removed */}

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="contact">Other Contact Details</Label>
                    <Input
                        id="contact"
                        value={formData.contact || ""}
                        onChange={(e) => handleChange("contact", e.target.value)}
                        placeholder="Manager Name etc."
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="image">Image URL (Optional)</Label>
                    <Input
                        id="image"
                        value={formData.image || ""}
                        onChange={(e) => handleChange("image", e.target.value)}
                        placeholder="https://..."
                    />
                </div>
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isEdit ? "Update Property" : "Create Property"}
            </Button>
        </form>
    );
}
