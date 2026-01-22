import { prisma } from './lib/prisma';

async function main() {
    const packages = await prisma.package.findMany();
    console.log("Checking packages for bad slugs...");

    for (const pkg of packages) {
        if (pkg.slug.includes(' ') || pkg.slug !== pkg.slug.toLowerCase()) {
            const newSlug = pkg.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            console.log(`Fixing info for: "${pkg.title}" -> "${newSlug}"`);

            try {
                await prisma.package.update({
                    where: { id: pkg.id },
                    data: { slug: newSlug }
                });
                console.log("Fixed!");
            } catch (e) {
                console.error("Failed to fix (maybe duplicate?):", e);
            }
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
