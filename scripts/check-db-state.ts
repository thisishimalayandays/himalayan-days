
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Checking Database State...');

    const hotelCount = await prisma.hotel.count();
    const hotelGrand = await prisma.hotel.findFirst({ where: { name: 'Hotel Grand Boulevard' } });

    // Check Job Applications
    // @ts-ignore
    const jobAppCount = await prisma.jobApplication ? await prisma.jobApplication.count() : 'Model might not exist?';

    console.log(`\n🏨 Hotels Total: ${hotelCount}`);
    console.log(`   Grand Boulevard Exists: ${!!hotelGrand} (${hotelGrand?.id || 'N/A'})`);

    console.log(`\n📄 Job Applications Total: ${jobAppCount}`);

    // Check for Soft Delete filters if any
    const deletedHotels = await prisma.hotel.count({ where: { deletedAt: { not: null } } });
    console.log(`   Deleted Hotels (Soft): ${deletedHotels}`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
