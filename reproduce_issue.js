
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Reproducing Hotel Update Issue...');

    // 1. Create a dummy hotel
    const hotel = await prisma.hotel.create({
        data: {
            name: 'Update Test Hotel',
            location: 'Srinagar',
            type: 'Hotel',
            stars: 4,
        },
    });
    console.log('Created hotel:', hotel.id, 'Stars:', hotel.stars);

    // 2. Update the hotel stars to 3 (Simulate what the form sends)
    const updatePayload = {
        stars: 3,
        // Add other fields that might be sent
        name: 'Update Test Hotel',
        location: 'Srinagar',
        type: 'Hotel',
        image: '',
        address: '',
        contact: '',
        email: '',
        phone: '',
    };

    console.log('Updating to 3 stars...');

    // direct prisma update first to verify DB can handle it
    const updatedHotel = await prisma.hotel.update({
        where: { id: hotel.id },
        data: {
            stars: 3
        }
    });

    console.log('Updated hotel stars in DB:', updatedHotel.stars);

    // Clean up
    await prisma.hotel.delete({ where: { id: hotel.id } });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
