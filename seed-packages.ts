import { prisma } from './lib/prisma';
import { packages } from './lib/data';

async function main() {
    console.log("Seeding Packages...");

    for (const pkg of packages) {
        // Sanitize slug
        const safeSlug = pkg.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Ensure arrays are stringified for SQLite/Prisma string fields
        // required by the current schema which uses String for JSON fields
        const galleryJson = JSON.stringify(pkg.gallery || []);
        const featuresJson = JSON.stringify(pkg.features || []);
        const itineraryJson = JSON.stringify(pkg.itinerary || []);
        const inclusionsJson = JSON.stringify(pkg.inclusions || []);
        const exclusionsJson = JSON.stringify(pkg.exclusions || []);

        await prisma.package.upsert({
            where: { slug: safeSlug },
            update: {
                title: pkg.title,
                duration: pkg.duration,
                startingPrice: pkg.startingPrice,
                image: pkg.image,
                gallery: galleryJson,
                category: pkg.category,
                location: pkg.location,
                features: featuresJson,
                overview: pkg.overview,
                itinerary: itineraryJson,
                inclusions: inclusionsJson,
                exclusions: exclusionsJson,
            },
            create: {
                slug: safeSlug,
                title: pkg.title,
                duration: pkg.duration,
                startingPrice: pkg.startingPrice,
                image: pkg.image,
                gallery: galleryJson,
                category: pkg.category,
                location: pkg.location,
                features: featuresJson,
                overview: pkg.overview,
                itinerary: itineraryJson,
                inclusions: inclusionsJson,
                exclusions: exclusionsJson,
            }
        });
        console.log(`Seeded: ${pkg.title}`);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
