
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Updating Booking Validity to expire yesterday (for testing)...');

    // Set to yesterday
    const yesterday = new Date('2026-02-13');

    const result = await prisma.roomRate.updateMany({
        where: {
            // Update only the Welcome group rates we added
            validFrom: { equals: new Date('2026-02-01') },
            validTo: { equals: new Date('2026-03-15') }
        },
        data: {
            bookingValidUntil: yesterday
        }
    });

    console.log(`Updated ${result.count} rates to expire on ${yesterday.toISOString().split('T')[0]}`);
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
