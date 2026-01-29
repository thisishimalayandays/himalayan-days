
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const WINTER_ITINERARY = [
    {
        day: 1,
        title: "Welcome to Kashmir - The Venice of the East",
        desc: "Arrival at Srinagar Airport. Meet our representative and transfer to a Luxury Heritage Houseboat on Dal Lake. Enjoy a Welcome 'Kahwa' (Saffron Tea). In the evening, verify your winter gear and enjoy a complimentary 1-Hour Shikara Ride during sunset. Dinner and overnight stay in the heated houseboat."
    },
    {
        day: 2,
        title: "Journey to the Meadow of Flowers (Gulmarg)",
        desc: "After breakfast, drive to Gulmarg (56km). En-route standard stop at Drung Waterfall (completely frozen in winter). Check-in to your Centrally Heated Hotel. The rest of the day is at leisure to explore the snow-covered meadows. Dinner at the hotel."
    },
    {
        day: 3,
        title: "Gulmarg Adventure - Gondola & Skiing",
        desc: "Full day in Gulmarg. We will assist you in boarding the Gondola Cable Car (Phase 1 or 2). Experience skiing or a snowmobile ride. Visit the famous Igloo Cafe (Snow Cafe) for lunch or a hot drink (at own cost). Return to the hotel for a cozy bonfire dinner."
    },
    {
        day: 4,
        title: "Return to Srinagar - Mughal Gardens",
        desc: "Drive back to Srinagar. Check-in to your 4-Star Hotel. Afternoon tour of the Mughal Gardens (Nishat & Shalimar Bagh) which look stunning with snow-capped mountains in the background. Evening free for shopping at Lal Chowk. Dinner at hotel."
    },
    {
        day: 5,
        title: "Departure with Sweet Memories",
        desc: "After breakfast, transfer to Srinagar Airport (SXR). Departure with photos and memories of your Winter Wonderland trip."
    }
];

const INCLUSIONS = [
    "4 Nights Accommodation (1N Houseboat + 2N Gulmarg + 1N Srinagar)",
    "Daily Breakfast & Dinner (Buffet)",
    "Private Innova/Scorpio Cab with Heating",
    "Snow Chains for Cab (Essential for Gulmarg)",
    "1 Hour Shikara Ride on Dal Lake",
    "Driver Allowances, Tolls & Parking",
    "24/7 On-Ground Support",
    "Electric Blankets / Central Heating at all stays"
];

const OVERVIEW = "Experience the magic of Kashmir at its snowy best. This 5-day premium package is designed for snow lovers, offering stays in centrally heated properties in Gulmarg and Srinagar. From the frozen Drung waterfall to the world's highest Gondola ride, we take care of every detail including snow-ready transport and cozy meals. Ideal for couples and families looking for a hassle-free winter luxury experience.";

async function main() {
    console.log("Updating Winter Wonderland Package...");

    const updated = await prisma.package.updateMany({
        where: {
            title: {
                contains: 'Winter Wonderland'
            }
        },
        data: {
            itinerary: JSON.stringify(WINTER_ITINERARY),
            inclusions: JSON.stringify(INCLUSIONS),
            overview: OVERVIEW,
            location: "Srinagar, Gulmarg, Drung"
        }
    });

    console.log(`Updated ${updated.count} package(s) with new rich content.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
