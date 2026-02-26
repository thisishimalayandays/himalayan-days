
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');

    // --- Hotel 1: Hotel Welcome Residency Shivpora, Srinagar ---
    const hotel1 = await prisma.hotel.create({
        data: {
            name: 'Hotel Welcome Residency',
            location: 'Srinagar',
            address: 'Shivpora, Srinagar',
            type: 'Hotel',
            stars: 3, // Assuming 3 star based on "Residency" title, user didn't specify
            // rateValidUntil: new Date('2026-02-28'), // "Booking dates Valid till: 28 Feb 2026"
            rooms: {
                create: [
                    {
                        name: 'Deluxe Room',
                        priceCP: 2400,
                        priceMAP: 3400,
                        extraBedCP: 900,
                        extraBedMAP: 1000,
                        // Assuming CNB matches Extra Bed logic or ignoring for now as schema doesn't have explicit CNB fields? 
                        // Schema has `extraBed` fields. User image shows "Child without bed(CNB)".
                        // I'll map Extra Bed to `extraBed`. CNB is usually lower, but schema only has one set of extra bed fields per plan.
                        // I will use Extra Bed rates for `extraBed` fields.
                    },
                    {
                        name: 'Heritage Deluxe Room',
                        priceCP: 2900,
                        priceMAP: 4000,
                        extraBedCP: 900,
                        extraBedMAP: 1000,
                    },
                ],
            },
        },
        include: {
            rooms: true,
        },
    });

    console.log(`Created Hotel: ${hotel1.name} with ${hotel1.rooms.length} roooms.`);

    // Add Seasonal Rates for Hotel 1 (16th March 2026 to 30th June 2026)
    // The image says "Booking dates Valid till: 28 Feb 2026 for bookings from 16th March..."
    // This implies these rates apply for that season, IF booked by Feb 28th. 
    // Base rates in `RoomType` should probably be these rates, or should these be seasonal?
    // Since they are specific dates, I will add them as `RoomRate` entries.
    // And also set them as base rates for convenience if no other rate exists.

    const validFrom = new Date('2026-03-16');
    const validTo = new Date('2026-06-30');
    const bookingVal = new Date('2026-02-28');

    for (const room of hotel1.rooms) {
        await prisma.roomRate.create({
            data: {
                roomTypeId: room.id,
                validFrom: validFrom,
                validTo: validTo,
                bookingValidUntil: bookingVal,
                priceCP: room.priceCP,
                priceMAP: room.priceMAP,
                extraBedCP: room.extraBedCP,
                extraBedMAP: room.extraBedMAP,
            }
        });
    }

    // --- Hotel 2: Welcome Hotel Gulmarg ---
    const hotel2 = await prisma.hotel.create({
        data: {
            name: 'Welcome Hotel Gulmarg',
            location: 'Gulmarg',
            type: 'Hotel',
            stars: 3, // Assuming 3 star
            // rateValidUntil: new Date('2026-02-28'),
            rooms: {
                create: [
                    {
                        name: 'Standard Deluxe Room',
                        priceCP: 4000,
                        priceMAP: 5000,
                        extraBedCP: 900,
                        extraBedMAP: 1200,
                    },
                ],
            },
        },
        include: {
            rooms: true,
        },
    });

    console.log(`Created Hotel: ${hotel2.name} with ${hotel2.rooms.length} roooms.`);

    for (const room of hotel2.rooms) {
        await prisma.roomRate.create({
            data: {
                roomTypeId: room.id,
                validFrom: validFrom,
                validTo: validTo,
                bookingValidUntil: bookingVal,
                priceCP: room.priceCP,
                priceMAP: room.priceMAP,
                extraBedCP: room.extraBedCP,
                extraBedMAP: room.extraBedMAP,
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
