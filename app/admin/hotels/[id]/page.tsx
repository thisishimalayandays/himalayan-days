import { getHotelById } from "@/app/actions/hotels";
import { HotelForm } from "@/components/admin/hotel-form";
import { RoomTypeManager } from "@/components/admin/room-type-manager";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditHotelPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditHotelPage({ params }: EditHotelPageProps) {
    const { id } = await params;
    const { hotel, error } = await getHotelById(id);

    if (error || !hotel) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto py-8 px-4">
            <div className="flex items-center gap-2">
                <Link href="/admin/hotels" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <HotelForm hotel={hotel} />
                </div>
                <div className="md:col-span-2">
                    <RoomTypeManager hotelId={hotel.id} rooms={hotel.rooms} />
                </div>
            </div>
        </div>
    );
}
