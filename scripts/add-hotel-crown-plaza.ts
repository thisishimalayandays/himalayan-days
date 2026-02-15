
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed for Hotel Crown Plaza Residency...');

    const hotel = await prisma.hotel.create({
        data: {
            name: 'Hotel Crown Plaza Residency',
            location: 'Srinagar',
            address: 'Munawara Abad, Srinagar, Jammu and Kashmir 190001',
            type: 'Hotel',
            stars: 3,
            // "B2B - Tariff Sheet (1 Jan 2026 - 20 Mar 2026)"
            rateValidUntil: new Date('2026-03-20'),
            phone: '+91-8491047066',
            email: 'info@crownplazakashmir.co.in',
            rooms: {
                create: [
                    {
                        name: 'Deluxe Non AC',
                        baseRate: 1500, // Using EP as base
                        priceEP: 1500,
                        priceCP: 1900,
                        priceMAP: 2500,
                        priceAP: 0, // Not specified
                        extraBedEP: 500,
                        extraBedCP: 700,
                        extraBedMAP: 1000,
                        extraBedAP: 0,
                    },
                    {
                        name: 'Deluxe Hot & Cold AC',
                        baseRate: 2000,
                        priceEP: 2000,
                        priceCP: 2400,
                        priceMAP: 3000,
                        priceAP: 0,
                        extraBedEP: 500,
                        extraBedCP: 700,
                        extraBedMAP: 1000,
                        extraBedAP: 0,
                    },
                    {
                        name: 'Family Room Hot & Cold AC',
                        baseRate: 2800,
                        priceEP: 2800,
                        priceCP: 3600,
                        priceMAP: 5500,
                        priceAP: 0,
                        extraBedEP: 500,
                        extraBedCP: 700,
                        extraBedMAP: 1000,
                        extraBedAP: 0,
                    }
                ],
            },
        },
        include: {
            rooms: true,
        },
    });

    console.log(`Created Hotel: ${hotel.name} with ${hotel.rooms.length} rooms.`);

    // Since validity is short term (Jan-Mar 2026), we might want to ensure these are also
    // added as a "Seasonal Rate" entry just in case the user wants to keep "base rates" separate later.
    // But for now, putting them as the main rates is what the user likely expects for immediate use.
    // I will ALSO add a RoomRate entry for this specific period to be robust.

    const validFrom = new Date('2026-01-01');
    const validTo = new Date('2026-03-20');

    for (const room of hotel.rooms) {
        await prisma.roomRate.create({
            data: {
                roomTypeId: room.id,
                validFrom: validFrom,
                validTo: validTo,
                // Rates match the base creation above
                priceEP: room.priceEP,
                priceCP: room.priceCP,
                priceMAP: room.priceMAP,
                priceAP: room.priceAP,
                extraBedEP: room.extraBedEP,
                extraBedCP: room.extraBedCP,
                extraBedMAP: room.extraBedMAP,
                extraBedAP: room.extraBedAP,
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
