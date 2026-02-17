
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const count = await prisma.inquiry.count({
        where: {
            createdAt: {
                gte: today
            }
        }
    });

    console.log(`Leads Created Today: ${count}`);

    // Also list them for review (name/type)
    const leads = await prisma.inquiry.findMany({
        where: {
            createdAt: { gte: today }
        },
        select: {
            id: true,
            name: true,
            type: true,
            budget: true,
            createdAt: true
        }
    });
    console.log(JSON.stringify(leads, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
