"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveItinerary(name: string, clientName: string | undefined, data: any) {
    try {
        const itinerary = await db.itinerary.create({
            data: {
                name,
                clientName,
                data,
            },
        });
        revalidatePath("/admin/tools/itinerary-maker");
        return { success: true, itinerary };
    } catch (error) {
        console.error("Failed to save itinerary:", error);
        return { success: false, error: "Failed to save itinerary" };
    }
}

export async function getItineraries() {
    try {
        const itineraries = await db.itinerary.findMany({
            orderBy: { createdAt: "desc" },
        });
        return itineraries;
    } catch (error) {
        console.error("Failed to fetch itineraries:", error);
        return [];
    }
}

export async function deleteItinerary(id: string) {
    try {
        await db.itinerary.delete({
            where: { id },
        });
        revalidatePath("/admin/tools/itinerary-maker");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete itinerary:", error);
        return { success: false, error: "Failed to delete itinerary" };
    }
}
