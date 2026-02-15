
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const hotelId = "cmlme39se0000i8i0ctysvqed"; // ID from screenshot URL

    const rooms = [
        {
            name: "Standard Deluxe Room",
            priceCP: 5300,
            priceMAP: 7000,
            baseRate: 5300, // Using CP as base
            extraBed: 1200, // Using CP extra bed rate
        },
        {
            name: "Deluxe Premium Room",
            priceCP: 6000,
            priceMAP: 7800,
            baseRate: 6000,
            extraBed: 1200,
        },
        {
            name: "Executive Suite Room (Front Lake View)",
            priceCP: 10000,
            priceMAP: 11500,
            baseRate: 10000,
            extraBed: 1200,
        },
        {
            name: "Luxury Suite Room (Side Lake View)",
            priceCP: 11500,
            priceMAP: 13500,
            baseRate: 11500,
            extraBed: 1200,
        }
    ];

    console.log(`Checking hotel with ID: ${hotelId}...`);
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
        console.error("Hotel not found! Please check the ID.");
        // Try searching by name if ID fails
        const hotels = await prisma.hotel.findMany({
            where: { name: { contains: "Welcome", mode: "insensitive" } }
        });
        if (hotels.length > 0) {
            console.log("Found similar hotels:", hotels.map(h => `${h.name} (${h.id})`));
        }
        return;
    }

    console.log(`Adding rooms to hotel: ${hotel.name}`);

    for (const room of rooms) {
        const existing = await prisma.roomType.findFirst({
            where: {
                hotelId,
                name: room.name
            }
        });

        if (existing) {
            console.log(`Updating existing room: ${room.name}`);
            await prisma.roomType.update({
                where: { id: existing.id },
                data: {
                    priceCP: room.priceCP,
                    priceMAP: room.priceMAP,
                    baseRate: room.baseRate,
                    extraBed: room.extraBed,
                    priceEP: room.priceCP, // Fallback
                    priceAP: 0
                }
            });
        } else {
            console.log(`Creating new room: ${room.name}`);
            await prisma.roomType.create({
                data: {
                    hotelId,
                    name: room.name,
                    priceCP: room.priceCP,
                    priceMAP: room.priceMAP,
                    baseRate: room.baseRate,
                    extraBed: room.extraBed,
                    priceEP: room.priceCP, // Fallback
                    priceAP: 0
                }
            });
        }
    }
    console.log("Done!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
