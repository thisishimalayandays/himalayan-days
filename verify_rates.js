
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Rates...');
    const rates = await prisma.roomRate.findMany({
        include: {
            roomType: {
                include: {
                    hotel: true
                }
            }
        }
    });

    console.log(`Found ${rates.length} rates.`);
    rates.forEach(r => {
        console.log(`------------------------------------------------`);
        console.log(`Hotel: ${r.roomType.hotel.name}`);
        console.log(`Room: ${r.roomType.name}`);
        console.log(`Valid: ${r.validFrom.toISOString().split('T')[0]} to ${r.validTo.toISOString().split('T')[0]}`);
        console.log(`Book By: ${r.bookingValidUntil ? r.bookingValidUntil.toISOString().split('T')[0] : 'N/A'}`);
    });
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
