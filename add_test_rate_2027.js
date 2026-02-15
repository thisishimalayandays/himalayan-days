
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Adding 2027 Test Rate...');
    const hotelName = 'Welcome Hotel at Dal Lake';

    // Find the hotel
    const hotel = await prisma.hotel.findFirst({
        where: { name: hotelName },
        include: { rooms: true }
    });

    if (!hotel) {
        console.error('Hotel not found');
        return;
    }

    console.log(`Found hotel: ${hotel.name}`);

    // Add rate to all rooms for Feb 2027
    const yesterday = new Date('2026-02-13'); // Expired
    const validFrom = new Date('2027-01-01');
    const validTo = new Date('2027-12-31');

    for (const room of hotel.rooms) {
        await prisma.roomRate.create({
            data: {
                roomTypeId: room.id,
                validFrom: validFrom,
                validTo: validTo,
                bookingValidUntil: yesterday, // EXPIRED
                // Cheap rates to distinguish from Base Rate
                priceEP: 1000,
                priceCP: 2000,
                priceMAP: 3000,
                priceAP: 4000,
                extraBed: 500,
                extraBedEP: 500,
                extraBedCP: 500,
                extraBedMAP: 500,
                extraBedAP: 500
            }
        });
        console.log(`Added Expired 2027 Rate for room: ${room.name}`);
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
