import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const total = await prisma.inquiry.count();

        const byStatus = await prisma.inquiry.groupBy({
            by: ['status'],
            _count: { _all: true },
        });

        const byType = await prisma.inquiry.groupBy({
            by: ['type'],
            _count: { _all: true },
        });

        // Get Today's count
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await prisma.inquiry.count({
            where: {
                createdAt: {
                    gte: today
                }
            }
        });

        console.log("=== PERFORMANCE STATS ===");
        console.log(`Total Leads: ${total}`);
        console.log(`Leads Today: ${todayCount}`);

        console.log("\n--- By Status ---");
        byStatus.forEach(g => {
            console.log(`${g.status}: ${g._count._all}`);
        });

        console.log("\n--- By Type ---");
        byType.forEach(g => {
            console.log(`${g.type}: ${g._count._all}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
