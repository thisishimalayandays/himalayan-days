
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Deleting 2027 Test Rates...');
    const result = await prisma.roomRate.deleteMany({
        where: {
            validFrom: {
                gte: new Date('2027-01-01')
            }
        }
    });
    console.log(`Deleted ${result.count} rates.`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
