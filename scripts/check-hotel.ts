
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking for Hotel Grand Boulevard...');
    const hotel = await prisma.hotel.findFirst({
        where: { name: 'Hotel Grand Boulevard' },
        include: { rooms: true }
    });

    if (hotel) {
        console.log(`✅ Found Hotel: ${hotel.name} (ID: ${hotel.id})`);
        console.log(`   📍 Location: ${hotel.location}`);
        console.log(`   🏠 Rooms: ${hotel.rooms.length}`);
    } else {
        console.log('❌ Hotel NOT found in this database.');
    }
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
