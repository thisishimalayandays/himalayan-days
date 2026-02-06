const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
    // 1. Find all leads marked as SPAM in the last 7 days
    const spamLeads = await prisma.inquiry.findMany({
        where: {
            status: 'SPAM',
            createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
    });

    console.log(`Found ${spamLeads.length} leads marked as SPAM.`);

    if (spamLeads.length > 0) {
        // 2. Update them to PENDING
        const result = await prisma.inquiry.updateMany({
            where: {
                status: 'SPAM',
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            },
            data: {
                status: 'PENDING'
            }
        });
        console.log(`Updated ${result.count} leads to PENDING.`);
    }
}

fix()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
