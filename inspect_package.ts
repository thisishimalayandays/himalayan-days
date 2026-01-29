
import { prisma } from "./lib/prisma";

async function main() {
    const packages = await prisma.package.findMany({
        take: 1,
    });
    console.log(JSON.stringify(packages, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
