
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addRates(hotelName, roomName, rates) {
    const hotel = await prisma.hotel.findFirst({
        where: { name: hotelName },
        include: { rooms: true },
    });

    if (!hotel) {
        console.log(`Hotel not found: ${hotelName}`);
        return;
    }

    const room = hotel.rooms.find((r) => r.name === roomName);
    if (!room) {
        console.log(`Room not found: ${roomName} in ${hotelName}`);
        return;
    }

    await prisma.roomRate.create({
        data: {
            roomTypeId: room.id,
            validFrom: new Date('2026-02-01'),
            validTo: new Date('2026-03-15'),
            bookingValidUntil: new Date('2026-02-28'),
            priceEP: rates.EP || 0,
            priceCP: rates.CP || 0,
            priceMAP: rates.MAP || 0,
            priceAP: rates.AP || 0,
            extraBed: rates.extraBed || 0,
            extraBedEP: rates.extraBedEP || 0,
            extraBedCP: rates.extraBedCP || 0,
            extraBedMAP: rates.extraBedMAP || 0,
            extraBedAP: rates.extraBedAP || 0,
        },
    });
    console.log(`Added rate for ${hotelName} - ${roomName}`);
}

async function main() {
    console.log('Seeding Welcome Group Rates (Feb-Mar)...');

    // 1. Hotel Welcome Residency Shivpora
    await addRates('Hotel Welcome Residency Shivpora', 'Deluxe Room', {
        CP: 1800, MAP: 2800, extraBedCP: 900, extraBedMAP: 1000
    });
    await addRates('Hotel Welcome Residency Shivpora', 'Heritage Deluxe Room', {
        CP: 2200, MAP: 3200, extraBedCP: 900, extraBedMAP: 1000
    });

    // 2. Welcome Hotel Gulmarg
    // Note: Image says "Standard Deluxe Room" but script above created it.
    // Assuming name matches.
    await addRates('Welcome Hotel Gulmarg', 'Standard Deluxe Room', {
        CP: 4500, MAP: 5500, extraBedCP: 1000, extraBedMAP: 1500
    });

    // 3. Welcome Hotel at Dal Lake
    await addRates('Welcome Hotel at Dal Lake', 'Standard Deluxe Room', {
        CP: 4300, MAP: 5600, extraBedCP: 900, extraBedMAP: 1500
    });
    await addRates('Welcome Hotel at Dal Lake', 'Deluxe Premium Room', {
        CP: 5200, MAP: 6600, extraBedCP: 900, extraBedMAP: 1500
    });
    await addRates('Welcome Hotel at Dal Lake', 'Executive Suite Room (Front Lake View)', {
        CP: 7800, MAP: 9200, extraBedCP: 900, extraBedMAP: 1500
    });
    await addRates('Welcome Hotel at Dal Lake', 'Luxury Suite Room (Side Lake View)', {
        CP: 9500, MAP: 10700, extraBedCP: 900, extraBedMAP: 1500
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
