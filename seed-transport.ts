
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding Transport options...");

    const transports = [
        {
            name: "Innova",
            type: "SUV",
            capacity: 6,
            rate: 3500,
        },
        {
            name: "Innova Crysta",
            type: "SUV",
            capacity: 6,
            rate: 4500,
        },
        {
            name: "Tempo Traveller",
            type: "Tempo Traveller",
            capacity: 12,
            rate: 5500,
        },
        {
            name: "Sedan (Etios/Dzire)",
            type: "Sedan",
            capacity: 4,
            rate: 2800,
        },
        {
            name: "Urbania",
            type: "Luxury",
            capacity: 15,
            rate: 8000,
        }
    ];

    for (const t of transports) {
        const existing = await prisma.transport.findFirst({
            where: { name: t.name }
        });

        if (existing) {
            console.log(`Updating ${t.name}...`);
            await prisma.transport.update({
                where: { id: existing.id },
                data: {
                    rate: t.rate,
                    capacity: t.capacity,
                    type: t.type
                }
            });
        } else {
            console.log(`Creating ${t.name}...`);
            await prisma.transport.create({
                data: {
                    name: t.name,
                    type: t.type,
                    rate: t.rate,
                    capacity: t.capacity
                }
            });
        }
    }

    console.log("Transport seeding complete!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
