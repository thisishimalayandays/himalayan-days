"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { createTransport, updateTransport } from "@/app/actions/transport";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TransportFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

interface TransportFormData {
    name: string;
    type: string;
    rate: string | number;
    capacity: string | number;
    image: string;
}

export function TransportForm({ initialData, onSuccess }: TransportFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<TransportFormData>({
        name: initialData?.name || "",
        type: initialData?.type || "SUV",
        rate: initialData?.rate || "",
        capacity: initialData?.capacity || "",
        image: initialData?.image || "",
    });

    const handleChange = (field: keyof TransportFormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                rate: Number(formData.rate) || 0,
                capacity: Number(formData.capacity) || 0,
            };

            let res;
            if (initialData) {
                res = await updateTransport(initialData.id, payload);
            } else {
                res = await createTransport(payload);
            }

            if (res.success) {
                toast.success(initialData ? "Transport updated!" : "Transport created!");
                if (onSuccess) onSuccess();
            } else {
                toast.error(res.error || "Something went wrong");
            }
        } catch (error) {
            toast.error("Failed to submit form");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label>Vehicle Name</Label>
                <Input
                    placeholder="e.g. Innova Crysta"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Type</Label>
                    <Select
                        value={formData.type}
                        onValueChange={(val) => handleChange("type", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SUV">SUV</SelectItem>
                            <SelectItem value="Sedan">Sedan</SelectItem>
                            <SelectItem value="Mini Bus">Mini Bus</SelectItem>
                            <SelectItem value="Tempo Traveller">Tempo Traveller</SelectItem>
                            <SelectItem value="Luxury">Luxury</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Seating Capacity</Label>
                    <Input
                        type="number"
                        min="1"
                        value={formData.capacity}
                        onChange={(e) => handleChange("capacity", e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Rate per Day (₹)</Label>
                <Input
                    type="number"
                    min="0"
                    value={formData.rate}
                    onChange={(e) => handleChange("rate", e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label>Image (Optional)</Label>
                <ImageUpload
                    value={formData.image}
                    onChange={(url) => handleChange("image", url)}
                />
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData ? "Update Vehicle" : "Add Vehicle"}
                </Button>
            </div>
        </form>
    );
}
