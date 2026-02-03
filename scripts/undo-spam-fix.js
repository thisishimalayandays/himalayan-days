const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function undo() {
    // Find leads updated to PENDING in the last 10 minutes (the duration of my mistake)
    // We filter by updatedAt being recent AND status being 'PENDING'.
    // NOTE: This assumes no *genuine* new pending leads came in exactly in this window 
    // or that it's safer to mark potential few false positives as SPAM than to leave junk in Pending.
    // However, to be safer, we can check if they *were* SPAM before? Prisma doesn't track history.
    // We'll rely on the very short time window.

    // Actually, I just ran the previous script. It updated them. 
    // They will have a very recent `updatedAt`.

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const leadsToRevert = await prisma.inquiry.findMany({
        where: {
            status: 'PENDING',
            updatedAt: { gte: tenMinutesAgo }
        }
    });

    console.log(`Found ${leadsToRevert.length} leads modified recently to PENDING.`);

    // Update them back to SPAM
    if (leadsToRevert.length > 0) {
        const result = await prisma.inquiry.updateMany({
            where: {
                id: { in: leadsToRevert.map(l => l.id) }
            },
            data: {
                status: 'SPAM'
            }
        });
        console.log(`Reverted ${result.count} leads back to SPAM.`);
    }
}

undo()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
