
import { prisma } from '../lib/prisma';

async function checkSystemHealth() {
    console.log('🏥 Starting System Health Check...\n');

    try {
        // 1. Homepage Load Simulation (Packages & Destinations)
        console.log('1️⃣  Simulating Homepage Load...');
        const packages = await prisma.package.findMany({ take: 3 });
        const destinations = await prisma.destination.findMany({ take: 3 });
        console.log(`   ✅ Packages Loaded: ${packages.length}`);
        console.log(`   ✅ Destinations Loaded: ${destinations.length}`);

        // 2. Inquiry Submission (Lead Generation)
        console.log('\n2️⃣  Simulating Lead Submission...');
        const lead = await prisma.inquiry.create({
            data: {
                name: "Health Check Bot",
                phone: "9999999999",
                type: "GENERAL",
                message: "System health check test inquiry",
                isRead: true, // Mark as read so it doesn't alert admins
            }
        });
        console.log(`   ✅ Lead Created ID: ${lead.id}`);

        // Clean up test lead
        await prisma.inquiry.delete({ where: { id: lead.id } });
        console.log(`   🧹 Test Lead Cleaned Up`);

        // 3. Admin Panel Stats
        console.log('\n3️⃣  Checking Admin Stats...');
        const hotelCount = await prisma.hotel.count();
        // @ts-ignore
        const jobAppCount = await prisma.jobApplication ? await prisma.jobApplication.count() : 'Using old schema?';

        console.log(`   ✅ Hotels Count: ${hotelCount}`);
        console.log(`   ✅ Job Applications Count: ${jobAppCount}`);

        console.log('\n✅ SYSTEM HEALTH CHECK PASSED! Database is responsive.');
    } catch (error) {
        console.error('\n❌ SYSTEM HEALTH CHECK FAILED:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

checkSystemHealth();
