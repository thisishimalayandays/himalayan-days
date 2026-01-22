const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@himalayandays.in' },
        update: {},
        create: {
            email: 'admin@himalayandays.in',
            name: 'Admin',
            password: hashedPassword,
        },
    });
    console.log(`Created user with id: ${user.id}`);

    // Seed Packages (Using raw data hardcoded here to avoid TS import issues in simple script)
    const packages = [
        {
            slug: "magical-kashmir-honeymoon",
            title: "Magical Kashmir Honeymoon",
            duration: "5 Nights / 6 Days",
            startingPrice: 18999,
            image: "/Magical%20Kashmir%20Honeymoon%20(1).png",
            gallery: [
                "/Magical%20Kashmir%20Honeymoon%20(1).png",
                "/Magical%20Kashmir%20Honeymoon%20(2).png"
            ],
            category: "Honeymoon",
            location: "Srinagar, Gulmarg, Pahalgam",
            features: ["Houseboat Stay", "Candlelight Dinner", "Flower Decoration"],
            overview: "Experience the romantic charm of Kashmir with our specially curated honeymoon package.",
            itinerary: [
                { day: 1, title: "Arrival in Srinagar", desc: "Welcome to Srinagar." },
                { day: 2, title: "Srinagar to Gulmarg", desc: "Proceed to Gulmarg." }
            ],
            inclusions: ["Accommodation", "Breakfast & Dinner"],
            exclusions: ["Airfare"]
        },
        {
            slug: "kashmir-family-adventure",
            title: "Kashmir Family Adventure",
            duration: "6 Nights / 7 Days",
            startingPrice: 15500,
            image: "/Kashmir%20Family%20Adventure%20(1).png",
            gallery: ["/Kashmir%20Family%20Adventure%20(1).png"],
            category: "Family",
            location: "Srinagar, Sonmarg, Gulmarg",
            features: ["Gondola Ride", "Pony Ride"],
            overview: "The perfect family getaway exploring the golden triangle of Kashmir.",
            itinerary: [{ day: 1, title: "Arrival", desc: "Pickup from airport." }],
            inclusions: ["Stay", "Meals"],
            exclusions: ["Flights"]
        }
        // Add more if needed, just a subset for testing
    ];

    for (const pkg of packages) {
        const p = await prisma.package.upsert({
            where: { slug: pkg.slug },
            update: {},
            create: {
                slug: pkg.slug,
                title: pkg.title,
                duration: pkg.duration,
                startingPrice: pkg.startingPrice,
                image: pkg.image,
                gallery: JSON.stringify(pkg.gallery),
                category: pkg.category,
                location: pkg.location,
                features: JSON.stringify(pkg.features),
                overview: pkg.overview,
                itinerary: JSON.stringify(pkg.itinerary),
                inclusions: JSON.stringify(pkg.inclusions),
                exclusions: JSON.stringify(pkg.exclusions),
            },
        });
        console.log(`Created package with id: ${p.id}`);
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
