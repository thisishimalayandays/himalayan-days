const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const leads = await prisma.inquiry.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, status: true, type: true, createdAt: true }
    });
    console.log("Latest Leads:", leads);
}

check()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
