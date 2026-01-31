
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const packages = await prisma.package.findMany({
            select: { title: true, slug: true, duration: true }
        });
        console.log(JSON.stringify(packages, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
