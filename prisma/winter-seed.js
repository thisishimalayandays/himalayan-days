const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Winter Packages...');

    const winterPackages = [
        {
            slug: "gulmarg-skiing-snowboarding-thrill",
            title: "Gulmarg Skiing & Snowboarding Thrill",
            duration: "5 Nights / 6 Days",
            startingPrice: 24500,
            image: "/Destinations/Gulmarg.jpeg", // Using existing image for now, user can update later
            gallery: [
                "/Destinations/Gulmarg.jpeg",
                "/Winter%20Wonderland%20Kashmir/Winter%20Wonderland%20Kashmir%20(2).jpeg",
                "/Winter%20Wonderland%20Kashmir/Winter%20Wonderland%20Kashmir%20(3).jpeg"
            ],
            category: "Adventure",
            location: "Gulmarg",
            features: ["Professional Ski Instructor", "Gear Rental Included", "Gondola Passes"],
            overview: "Unleash your inner adventurer on the world-class slopes of Gulmarg. This package is dedicated to skiing and snowboarding enthusiasts, offering guided lessons, equipment, and stays in ski-friendly resorts. Experience the rush of gliding down the powdery white slopes of Mt. Apharwat.",
            itinerary: [
                { day: 1, title: "Arrival & Transfer to Gulmarg", desc: "Arrive at Srinagar Airport and transfer directly to Gulmarg (2-hour drive). Check into your hotel. Get fitted for your ski/snowboard equipment. Evening briefing by your instructor." },
                { day: 2, title: "Skiing Lesson - Day 1", desc: "Begin your skiing course on the gentle slopes of the baby lift area. Learn basic techniques: balance, sliding, and snowplow stops. practicing until sunset." },
                { day: 3, title: "Skiing Lesson - Day 2 & Gondola Ride", desc: "Advance your skills. Take the Gondola to Phase 1 (Kungdoor) for iconic views. Attempt longer runs if confident. Enjoy a hot lunch on the slopes." },
                { day: 4, title: "Intermediate Skiing & Phase 2", desc: "Optional ride to Phase 2 (Apharwat Peak) for sightseeing or advanced skiing (for pros only). Experience the thrill of high-altitude winter sports. Evening bonfire at the hotel." },
                { day: 5, title: "Free Day / Snowmobile Ride", desc: "Rest day or optional Snowmobile/ATV ride. Explore the Gulmarg market. Buy local winter wear or souvenirs. Farewell dinner." },
                { day: 6, title: "Departure", desc: "Morning drive back to Srinagar Airport. Leave with a new skill and adrenaline-filled memories." }
            ],
            inclusions: [
                "Stay in Heated Hotel",
                "Breakfast & Dinner",
                "Ski/Snowboard Equipment Rental",
                "Instructor Fees (3 Days)",
                "Transfers"
            ],
            exclusions: ["Gondola Tickets", "Lunch", "Personal Gear (Gloves/Goggles)"]
        },
        {
            slug: "snow-kissed-kashmir-honeymoon",
            title: "Snow-Kissed Kashmir Honeymoon",
            duration: "6 Nights / 7 Days",
            startingPrice: 28999,
            image: "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(1).png",
            gallery: [
                "/Magical%20Kashmir%20Honeymoon/Magical%20Kashmir%20Honeymoon%20(2).png",
                "/Destinations/Pahalgham.jpeg",
                "/Destinations/Srinagar.jpeg"
            ],
            category: "Honeymoon",
            location: "Srinagar, Gulmarg, Pahalgam",
            features: ["Candlelight Dinner", "Flower Bed Decoration", "Private Transfers"],
            overview: "Celebrate your love amidst the snowy wonderland of Kashmir. Cozy up in warm houseboats, take romantic walks in snow-covered meadows, and enjoy exclusive couple experiences. This winter edition adds a magical white touch to your romantic getaway.",
            itinerary: [
                { day: 1, title: "Romantic Arrival", desc: "Welcome to a snowy Srinagar. Transfer to a luxury heated houseboat. Welcome cake and flower decoration in your room. Romantic Shikara ride wrapped in warm blankets." },
                { day: 2, title: "Srinagar to Gulmarg", desc: "Drive to Gulmarg. The entire route is dazzling white. Check-in. Enjoy a sledge ride together. Candlelight dinner at the hotel." },
                { day: 3, title: "Gulmarg Romance", desc: "Ride the Gondola hand-in-hand. Have a snowball fight. Visit the frozen Alpather lake (if accessible). Evening at leisure." },
                { day: 4, title: "Gulmarg to Pahalgam", desc: "Scenic drive to Pahalgam. The Lidder river flows through snow-banks. Check-in to a riverside resort. Enjoy the sound of the river." },
                { day: 5, title: "Pahalgam Solitude", desc: "Visit Aru Valley - it looks like a winter fairyland. Perfect for couple photography. Relax by the fireplace in your hotel in the evening." },
                { day: 6, title: "Return to Srinagar", desc: "Drive back to Srinagar. Shopping for gifts. Visit Hazratbal Shrine. Farewell dinner on a houseboat." },
                { day: 7, title: "Departure", desc: "Transfer to airport with hearts full of warm memories." }
            ],
            inclusions: [
                "Luxury Accommodation",
                "All Meals",
                "Honeymoon Inclusions (Cake, Decor, Milk)",
                "Exclusive Vehicle"
            ],
            exclusions: ["Flights", "Adventure Activities", "Lunch"]
        },
        {
            slug: "winter-family-fun-kashmir",
            title: "Winter Family Fun in Kashmir",
            duration: "5 Nights / 6 Days",
            startingPrice: 18500,
            image: "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(1).png",
            gallery: [
                "/Destinations/Gulmarg.jpeg",
                "/Destinations/Sonmarg.jpeg",
                "/Kashmir%20Family%20Adventure/Kashmir%20Family%20Adventure%20(3).png"
            ],
            category: "Family",
            location: "Srinagar, Gulmarg",
            features: ["Snowman Building", "Sledge Rides", "Child Friendly"],
            overview: "Make your winter holidays unforgettable for the kids! A fun-filled package focusing on snow activities that are safe and enjoyable for the whole family. Build snowmen, go sledging, and enjoy hot chocolate by the fire.",
            itinerary: [
                { day: 1, title: "Welcome to the snow", desc: "Arrival in Srinagar. Transfer to hotel. Evening walk on the Boulevard to see the frozen edges of Dal Lake." },
                { day: 2, title: "Sonmarg Snow Day", desc: "Day trip to Sonmarg. It is usually buried under heavy snow in winter. Great for playing in deep snow. Sledge rides for kids. Return to Srinagar." },
                { day: 3, title: "Gulmarg Fun", desc: "Proceed to Gulmarg. Check-in. The meadows are perfect for building a snowman. Family tube rides on the snow." },
                { day: 4, title: "Gondola & Views", desc: "Take the Gondola ride. The view of Himalayas is educational and breathtaking for children. Visit the snow park." },
                { day: 5, title: "Srinagar Sightseeing", desc: "Return to Srinagar. Visit the indoor markets or museums if it's too cold outside. Enjoy a traditional Wazwan lunch." },
                { day: 6, title: "Departure", desc: "Transfer to airport." }
            ],
            inclusions: ["Family Room", "Breakfast & Dinner", "Sledge Rides (Complimentary)", "Vehicle"],
            exclusions: ["Flights", "Gondola Tickets"]
        },
        {
            slug: "frozen-glories-of-srinagar-pahalgam",
            title: "Frozen Glories of Srinagar & Pahalgam",
            duration: "4 Nights / 5 Days",
            startingPrice: 12999,
            image: "/Destinations/Srinagar.jpeg",
            gallery: [
                "/Destinations/Srinagar.jpeg",
                "/Destinations/Pahalgham.jpeg",
                "/Destinations/Verinag.jpeg"
            ],
            category: "Leisure",
            location: "Srinagar, Pahalgam",
            features: ["Frozen Dal Lake", "Winter Landscapes", "Relaxed Pace"],
            overview: "Witness the surreal beauty of frozen lakes and snow-dusted pine forests. This leisure tour focuses on the scenic beauty of Srinagar and Pahalgam during the chill of winter, avoiding the rush of skiers.",
            itinerary: [
                { day: 1, title: "Arrival", desc: "Arrive Srinagar. Check-in. Enjoy the view of the misty Dal Lake. Shikara ride through the breaking ice (thin layer)." },
                { day: 2, title: "Srinagar City Tour", desc: "Visit Shankaracharya Temple. Explore the Mughal Gardens which have a unique charm in winter with bare trees and mist. Visit local handicraft shops." },
                { day: 3, title: "Pahalgam Winter Drive", desc: "Drive to Pahalgam. The journey through saffron fields under snow is beautiful. Visit Betaab Valley. The turquoise water against white snow is stunning." },
                { day: 4, title: "Pahalgam to Srinagar", desc: "Morning at leisure in Pahalgam. Drive back to Srinagar. Free evening for shopping." },
                { day: 5, title: "Departure", desc: "Transfer to airport." }
            ],
            inclusions: ["Hotel", "Breakfast & Dinner", "Transport"],
            exclusions: ["Entry Fees", "Lunch"]
        },
        {
            slug: "premium-winter-escape",
            title: "Premium Winter Escape",
            duration: "5 Nights / 6 Days",
            startingPrice: 45000,
            image: "/Luxury%20Houseboat%20Retreat/Luxury%20Houseboat%20Retreat%20(1).jpeg",
            gallery: [
                "/Luxury%20Houseboat%20Retreat/Luxury%20Houseboat%20Retreat%20(3).jpeg",
                "/Destinations/Gulmarg.jpeg",
                "/Destinations/Pahalgham.jpeg"
            ],
            category: "Luxury",
            location: "Gulmarg, Srinagar",
            features: ["5-Star Hotels", "Private Butler", "Helicopter Ride (Optional)"],
            overview: "Experience winter in the lap of luxury. Stay in the finest 5-star properties like The Khyber (Gulmarg) or Taj (Srinagar). Enjoy gourmet meals, spa treatments, and the highest level of comfort while watching the snow fall outside.",
            itinerary: [
                { day: 1, title: "Luxury Arrival", desc: "Chauffeur driven transfer to Vivanta by Taj / Lalit. Welcome drink. Dinner with a view of the Zabarwan range." },
                { day: 2, title: "Gulmarg - The Khyber Experience", desc: "Transfer to Gulmarg in a luxury SUV. Check into The Khyber Himalayan Resort & Spa. Enjoy the heated indoor pool with glass walls overlooking snow peaks." },
                { day: 3, title: "Gondola Experience", desc: "VIP access to Gondola. Lunch at Cloud 9. Evening spa session to rejuvenate." },
                { day: 4, title: "Return to Srinagar", desc: "Leisurely breakfast. Drive back to Srinagar. Check-in to a luxury houseboat. Private musical evening." },
                { day: 5, title: "Private Heritage Tour", desc: "Personal guide for a tour of Srinagar's heritage spots. Artisanal shopping experience. Farewell Royal Dinner." },
                { day: 6, title: "Departure", desc: "Luxury transfer to airport." }
            ],
            inclusions: ["5-Star Accommodation", "All Meals", "Luxury SUV", "Guide"],
            exclusions: ["Flights", "Spa Treatments", "Tips"]
        }
    ];

    for (const pkg of winterPackages) {
        const p = await prisma.package.upsert({
            where: { slug: pkg.slug },
            update: {
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
        console.log(`Created Winter package: ${p.title}`);
    }

    console.log('Winter Seeding finished.');
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
