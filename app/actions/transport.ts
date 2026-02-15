'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "./audit";

// Define the shape since Prisma client might not be generated yet
interface TransportInput {
    name: string;
    type: string;
    rate: number;
    capacity: number;
    image?: string;
}

export async function getTransports() {
    try {
        // @ts-ignore - Transport model exists in schema but client might not be generated
        const transports = await prisma.transport.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, transports };
    } catch (error) {
        console.error("Failed to fetch transports:", error);
        return { success: false, error: "Failed to fetch transports" };
    }
}

export async function createTransport(data: TransportInput) {
    try {
        // @ts-ignore
        const transport = await prisma.transport.create({
            data: {
                name: data.name,
                type: data.type,
                rate: data.rate || 0,
                capacity: data.capacity || 4,
                image: data.image,
            },
        });
        revalidatePath("/admin/transport");
        await logActivity("CREATE_TRANSPORT", "Transport", transport.id, `Created transport ${transport.name}`);
        return { success: true, transport };
    } catch (error) {
        console.error("Failed to create transport:", error);
        return { success: false, error: "Failed to create transport" };
    }
}

export async function updateTransport(id: string, data: Partial<TransportInput>) {
    try {
        // @ts-ignore
        const transport = await prisma.transport.update({
            where: { id },
            data,
        });
        revalidatePath("/admin/transport");
        await logActivity("UPDATE_TRANSPORT", "Transport", id, `Updated transport`);
        return { success: true, transport };
    } catch (error) {
        console.error("Failed to update transport:", error);
        return { success: false, error: "Failed to update transport" };
    }
}

export async function deleteTransport(id: string) {
    try {
        // @ts-ignore
        await prisma.transport.delete({ where: { id } });
        revalidatePath("/admin/transport");
        await logActivity("DELETE_TRANSPORT", "Transport", id, "Deleted transport");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete transport:", error);
        return { success: false, error: "Failed to delete transport" };
    }
}
