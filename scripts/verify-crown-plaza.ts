
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const hotel = await prisma.hotel.findFirst({
        where: { name: { contains: 'Crown Plaza' } },
        include: {
            rooms: {
                include: {
                    rates: true
                }
            }
        }
    });

    if (!hotel) {
        console.log("Hotel not found");
        return;
    }

    console.log(`Hotel: ${hotel.name}`);
    console.log(`Validity: ${hotel.rateValidUntil?.toISOString()}`);

    for (const room of hotel.rooms) {
        console.log(`\nRoom: ${room.name}`);
        console.log('--- Rates ---');
        room.rates.forEach(rate => {
            console.log(`From: ${rate.validFrom.toDateString()} To: ${rate.validTo.toDateString()}`);
            console.log(`  EP: ${rate.priceEP} | CP: ${rate.priceCP} | MAP: ${rate.priceMAP}`);
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
