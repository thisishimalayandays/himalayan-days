'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Hotel, RoomType, RoomRate } from "@prisma/client";
import { logActivity } from "./audit";

// --- Hotel Actions ---

export async function getHotels(filters?: { location?: string; type?: string; stars?: number, trash?: boolean }) {
    try {
        const where: any = {};
        if (filters?.location && filters.location !== 'All') where.location = filters.location;
        if (filters?.type && filters.type !== 'All') where.type = filters.type;
        if (filters?.stars) where.stars = filters.stars;

        // Soft Delete Logic
        if (filters?.trash) {
            where.deletedAt = { not: null };
        } else {
            where.deletedAt = null;
        }

        const hotels = await prisma.hotel.findMany({
            where,
            include: {
                rooms: {
                    include: {
                        rates: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
        return { success: true, hotels };
    } catch (error) {
        console.error("Failed to fetch hotels:", error);
        return { success: false, error: "Failed to fetch hotels" };
    }
}

export async function getHotelById(id: string) {
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id },
            include: {
                rooms: {
                    include: {
                        rates: true
                    }
                }
            },
        });
        if (!hotel) return { success: false, error: "Hotel not found" };
        return { success: true, hotel };
    } catch (error) {
        console.error("Failed to fetch hotel:", error);
        return { success: false, error: "Failed to fetch hotel" };
    }
}

export async function createHotel(data: Partial<Hotel>) {
    try {
        const hotel = await prisma.hotel.create({
            data: {
                name: data.name!,
                location: data.location!,
                type: data.type || "Hotel",
                stars: data.stars || 3,
                image: data.image,
                address: data.address,
                contact: data.contact,
                email: data.email,
                phone: data.phone,
            },
        });
        revalidatePath("/admin/hotels");
        await logActivity("CREATE_HOTEL", "Hotel", hotel.id, `Created hotel ${hotel.name}`);
        return { success: true, hotel };
    } catch (error) {
        console.error("Failed to create hotel:", error);
        return { success: false, error: "Failed to create hotel" };
    }
}

export async function updateHotel(id: string, data: Partial<Hotel>) {
    try {
        const hotel = await prisma.hotel.update({
            where: { id },
            data: {
                name: data.name,
                location: data.location,
                type: data.type,
                stars: data.stars,
                image: data.image,
                address: data.address,
                contact: data.contact,
                email: data.email,
                phone: data.phone,
                deletedAt: data.deletedAt,
            },
        });
        revalidatePath("/admin/hotels");
        revalidatePath(`/admin/hotels/${id}`);
        await logActivity("UPDATE_HOTEL", "Hotel", hotel.id, `Updated hotel ${hotel.name}`);
        return { success: true, hotel };
    } catch (error) {
        console.error("Failed to update hotel:", error);
        return { success: false, error: "Failed to update hotel" };
    }
}

export async function deleteHotel(id: string) {
    try {
        // Soft Delete
        await prisma.hotel.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
        revalidatePath("/admin/hotels");
        await logActivity("DELETE_HOTEL", "Hotel", id, "Soft deleted hotel");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete hotel:", error);
        return { success: false, error: "Failed to delete hotel" };
    }
}

export async function restoreHotel(id: string) {
    try {
        await prisma.hotel.update({
            where: { id },
            data: { deletedAt: null }
        });
        revalidatePath("/admin/hotels");
        await logActivity("RESTORE_HOTEL", "Hotel", id, "Restored hotel");
        return { success: true };
    } catch (error) {
        console.error("Failed to restore hotel:", error);
        return { success: false, error: "Failed to restore hotel" };
    }
}

export async function permanentlyDeleteHotel(id: string) {
    try {
        await prisma.hotel.delete({ where: { id } });
        revalidatePath("/admin/hotels");
        await logActivity("PERMANENT_DELETE_HOTEL", "Hotel", id, "Permanently deleted hotel");
        return { success: true };
    } catch (error) {
        console.error("Failed to permanently delete hotel:", error);
        return { success: false, error: "Failed to permanently delete hotel" };
    }
}

// --- Room Type Actions ---

export async function addRoomType(hotelId: string, data: Partial<RoomType>) {
    try {
        const room = await prisma.roomType.create({
            data: {
                hotelId,
                name: data.name!,
                baseRate: data.baseRate || 0,
                priceEP: data.priceEP || 0,
                priceCP: data.priceCP || 0,
                priceMAP: data.priceMAP || 0,
                priceAP: data.priceAP || 0,
                extraBed: data.extraBed || 0,
                extraBedEP: data.extraBedEP || 0,
                extraBedCP: data.extraBedCP || 0,
                extraBedMAP: data.extraBedMAP || 0,
                extraBedAP: data.extraBedAP || 0,
            },
        });
        revalidatePath(`/admin/hotels/${hotelId}`);
        await logActivity("CREATE_ROOM_TYPE", "RoomType", room.id, `Created room type ${room.name}`);
        return { success: true, room };
    } catch (error) {
        console.error("Failed to add room type:", error);
        return { success: false, error: "Failed to add room type" };
    }
}


export async function updateRoomType(id: string, data: Partial<RoomType>) {
    try {
        const room = await prisma.roomType.update({
            where: { id },
            data: {
                ...data,
                extraBedEP: data.extraBedEP,
                extraBedCP: data.extraBedCP,
                extraBedMAP: data.extraBedMAP,
                extraBedAP: data.extraBedAP,
            },
        });
        // We need hotelId to revalidate the page, but room update returns it
        revalidatePath(`/admin/hotels/${room.hotelId}`);
        await logActivity("UPDATE_ROOM_TYPE", "RoomType", room.id, `Updated room type ${room.name}`);
        return { success: true, room };
    } catch (error) {
        console.error("Failed to update room type:", error);
        return { success: false, error: "Failed to update room type" };
    }
}

export async function deleteRoomType(id: string) {
    try {
        const room = await prisma.roomType.findUnique({ where: { id } });
        if (room) {
            await prisma.roomType.delete({ where: { id } });
            revalidatePath(`/admin/hotels/${room.hotelId}`);
            await logActivity("DELETE_ROOM_TYPE", "RoomType", id, `Deleted room type ${room.name}`);
        }
        return { success: true };
    } catch (error) {
        console.error("Failed to delete room type:", error);
        return { success: false, error: "Failed to delete room type" };
    }
}

// --- Room Rate Actions ---

export async function addRoomRate(roomTypeId: string, data: Partial<RoomRate>) {
    try {
        const rate = await prisma.roomRate.create({
            data: {
                roomTypeId,
                validFrom: data.validFrom!,
                validTo: data.validTo!,
                priceEP: data.priceEP || 0,
                priceCP: data.priceCP || 0,
                priceMAP: data.priceMAP || 0,
                priceAP: data.priceAP || 0,
                extraBed: data.extraBed || 0,
                extraBedEP: data.extraBedEP || 0,
                extraBedCP: data.extraBedCP || 0,
                extraBedMAP: data.extraBedMAP || 0,
                extraBedAP: data.extraBedAP || 0,
                // @ts-ignore: Schema updated but client not yet regenerated
                bookingValidUntil: data.bookingValidUntil,
            },
        });
        const room = await prisma.roomType.findUnique({ where: { id: roomTypeId } });
        revalidatePath(`/admin/hotels/${room?.hotelId}`);
        await logActivity("CREATE_ROOM_RATE", "RoomRate", rate.id, "Created room rate");
        return { success: true, rate };
    } catch (error) {
        console.error("Failed to add room rate:", error);
        return { success: false, error: "Failed to add room rate" };
    }
}

export async function updateRoomRate(rateId: string, data: Partial<RoomRate>) {
    try {
        const rate = await prisma.roomRate.update({
            where: { id: rateId },
            data: {
                validFrom: data.validFrom,
                validTo: data.validTo,
                priceEP: data.priceEP,
                priceCP: data.priceCP,
                priceMAP: data.priceMAP,
                priceAP: data.priceAP,
                extraBed: data.extraBed,
                extraBedEP: data.extraBedEP,
                extraBedCP: data.extraBedCP,
                extraBedMAP: data.extraBedMAP,
                extraBedAP: data.extraBedAP,
                // @ts-ignore
                bookingValidUntil: data.bookingValidUntil,
            },
            include: { roomType: true }
        });
        revalidatePath(`/admin/hotels/${rate.roomType.hotelId}`);
        await logActivity("UPDATE_ROOM_RATE", "RoomRate", rate.id, "Updated room rate");
        return { success: true, rate };
    } catch (error) {
        console.error("Failed to update room rate:", error);
        return { success: false, error: "Failed to update room rate" };
    }
}

export async function deleteRoomRate(id: string) {
    try {
        const rate = await prisma.roomRate.findUnique({
            where: { id },
            include: { roomType: true }
        });
        if (rate) {
            await prisma.roomRate.delete({ where: { id } });
            revalidatePath(`/admin/hotels/${rate.roomType.hotelId}`);
            await logActivity("DELETE_ROOM_RATE", "RoomRate", id, "Deleted room rate");
        }
        return { success: true };
    } catch (error) {
        console.error("Failed to delete room rate:", error);
        return { success: false, error: "Failed to delete room rate" };
    }
}

// --- Seasonal Rate Actions ---

export async function updateSeasonalRates(
    hotelId: string,
    validFrom: Date,
    validTo: Date,
    rates: {
        roomTypeId: string;
        priceEP: number;
        priceCP: number;
        priceMAP: number;
        priceAP: number;
        extraBed: number;
        extraBedEP: number;
        extraBedCP: number;
        extraBedMAP: number;
        extraBedAP: number;
    }[],
    bookingValidUntil?: Date
) {
    try {
        await prisma.$transaction(async (tx) => {
            for (const rate of rates) {
                // Delete existing rates for this room type that match the dates exactly
                await tx.roomRate.deleteMany({
                    where: {
                        roomTypeId: rate.roomTypeId,
                        validFrom: validFrom,
                        validTo: validTo,
                    }
                });

                await tx.roomRate.create({
                    data: {
                        roomTypeId: rate.roomTypeId,
                        validFrom,
                        validTo,
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
                        bookingValidUntil: bookingValidUntil || null,
                    }
                });
            }
        });

        revalidatePath(`/admin/hotels/${hotelId}`);
        await logActivity("UPDATE_SEASONAL_RATES", "Hotel", hotelId, "Updated seasonal rates");
        return { success: true };
    } catch (error) {
        console.error("Failed to update seasonal rates:", error);
        return { success: false, error: "Failed to update seasonal rates" };
    }
}

