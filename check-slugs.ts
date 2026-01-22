import { prisma } from './lib/prisma';

async function main() {
    const packages = await prisma.package.findMany({
        select: { id: true, title: true, slug: true }
    });
    console.log("Current Packages:");
    packages.forEach(p => {
        console.log(`ID: ${p.id} | Title: "${p.title}" | Slug: "${p.slug}"`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
