"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "./audit";

export async function saveQuote(name: string, clientName: string | undefined, data: any, id?: string) {
    try {
        let quote;
        if (id) {
            // Update existing
            quote = await db.quote.update({
                where: { id },
                data: {
                    name,
                    clientName,
                    data,
                },
            });
            await logActivity(
                'UPDATED_QUOTE',
                'Quote',
                quote.id,
                `Updated calculator quote: ${name}`
            );
        } else {
            // Create new
            quote = await db.quote.create({
                data: {
                    name,
                    clientName,
                    data,
                },
            });
            await logActivity(
                'SAVED_QUOTE',
                'Quote',
                quote.id,
                `Created calculator quote: ${name}`
            );
        }

        revalidatePath("/admin/tools/calculator");
        return { success: true, quote };
    } catch (error) {
        console.error("Failed to save quote:", error);
        return { success: false, error: "Failed to save quote" };
    }
}

export async function getQuotes() {
    try {
        const quotes = await db.quote.findMany({
            orderBy: { createdAt: "desc" },
        });
        return quotes;
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
        return [];
    }
}

export async function deleteQuote(id: string) {
    try {
        await db.quote.delete({
            where: { id },
        });
        revalidatePath("/admin/tools/calculator");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete quote:", error);
        return { success: false, error: "Failed to delete quote" };
    }
}
