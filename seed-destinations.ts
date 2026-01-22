import { prisma } from './lib/prisma';
import { destinations } from './lib/data';

async function main() {
    console.log("Seeding Destinations...");

    for (const dest of destinations) {
        // Sanitize slug just in case
        const safeSlug = dest.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        await prisma.destination.upsert({
            where: { slug: safeSlug },
            update: {},
            create: {
                name: dest.name,
                slug: safeSlug,
                image: dest.image,
                description: dest.description,
                rating: dest.rating,
                reviews: dest.reviews
            }
        });
        console.log(`Seeded: ${dest.name}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
