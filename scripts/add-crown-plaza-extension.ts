
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Adding extended rates for Hotel Crown Plaza Residency...');

    const hotel = await prisma.hotel.findFirst({
        where: { name: 'Hotel Crown Plaza Residency' },
        include: { rooms: true }
    });

    if (!hotel) {
        console.error('Hotel not found!');
        return;
    }

    // Update Hotel Validity to cover the new range
    await prisma.hotel.update({
        where: { id: hotel.id },
        data: { rateValidUntil: new Date('2026-06-30') }
    });
    console.log('Updated Hotel Rate Validity to 30th June 2026.');

    const validFrom = new Date('2026-03-20');
    const validTo = new Date('2026-06-30');

    // Map room names to new rates
    const newRates: Record<string, any> = {
        'Deluxe Non AC': {
            priceEP: 2500, priceCP: 3000, priceMAP: 4000,
            extraBedEP: 500, extraBedCP: 750, extraBedMAP: 1000
        },
        'Deluxe Hot & Cold AC': {
            priceEP: 2500, priceCP: 3500, priceMAP: 4500,
            extraBedEP: 500, extraBedCP: 750, extraBedMAP: 1000
        },
        'Family Room Hot & Cold AC': {
            priceEP: 3500, priceCP: 4500, priceMAP: 6500,
            extraBedEP: 500, extraBedCP: 750, extraBedMAP: 1000
        }
    };

    for (const room of hotel.rooms) {
        const rates = newRates[room.name];
        if (rates) {
            await prisma.roomRate.create({
                data: {
                    roomTypeId: room.id,
                    validFrom: validFrom,
                    validTo: validTo,
                    ...rates
                }
            });
            console.log(`Added extended rates for ${room.name}`);
        } else {
            console.warn(`No matching rates found for room: ${room.name}`);
        }
    }

    console.log('Extension seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
