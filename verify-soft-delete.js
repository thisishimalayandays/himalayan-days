
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Soft Delete...');

    // 1. Create a dummy hotel
    const hotel = await prisma.hotel.create({
        data: {
            name: 'Temp Delete Me',
            location: 'Test',
            type: 'Hotel',
            stars: 1,
        },
    });
    console.log('Created dummy hotel:', hotel.id);

    // 2. Soft Delete it (simulate what server action does)
    await prisma.hotel.update({
        where: { id: hotel.id },
        data: { deletedAt: new Date() },
    });
    console.log('Soft deleted hotel.');

    // 3. Verify it is filtered out by default
    const activeHotels = await prisma.hotel.findMany({
        where: { deletedAt: null },
    });
    const foundInActive = activeHotels.find(h => h.id === hotel.id);
    console.log('Found in Active List?', !!foundInActive);

    // 4. Verify it appears in Trash
    const trashHotels = await prisma.hotel.findMany({
        where: { deletedAt: { not: null } },
    });
    const foundInTrash = trashHotels.find(h => h.id === hotel.id);
    console.log('Found in Trash List?', !!foundInTrash);

    // 5. Restore it
    await prisma.hotel.update({
        where: { id: hotel.id },
        data: { deletedAt: null },
    });
    console.log('Restored hotel.');

    // 6. Permanently Delete
    await prisma.hotel.delete({
        where: { id: hotel.id },
    });
    console.log('Permanently deleted hotel.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
