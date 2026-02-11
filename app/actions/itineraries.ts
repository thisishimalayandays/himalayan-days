"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { logActivity } from "./audit";

export async function saveItinerary(name: string, clientName: string | undefined, data: any, id?: string) {
    try {
        let itinerary;
        if (id) {
            // Update existing
            itinerary = await db.itinerary.update({
                where: { id },
                data: {
                    name,
                    clientName,
                    data,
                },
            });
        } else {
            // Create new
            itinerary = await db.itinerary.create({
                data: {
                    name,
                    clientName,
                    data,
                },
            });
        }

        await logActivity(
            'SAVED_ITINERARY',
            'Itinerary',
            itinerary.id,
            `Saved itinerary: ${name}`
        );

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
