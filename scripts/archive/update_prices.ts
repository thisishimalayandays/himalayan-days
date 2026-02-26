
import { prisma } from "../lib/prisma";

// Min Cost Constants
const MIN_HOTEL_SRINAGAR = 3000;
const MIN_HOTEL_OTHERS = 4500; // Low range
const MIN_CAB_PER_DAY = 2200; // Low range
const MIN_SHIKARA = 1000;
const MIN_COMMISSION = 3000; // Low range

// Max Cost Constants
const MAX_HOTEL_SRINAGAR = 3000; // Fixed? User said 3000. Let's assume standard.
const MAX_HOTEL_OTHERS = 5500; // High range
const MAX_CAB_PER_DAY = 3200; // High range
const MAX_SHIKARA = 1000;
const MAX_COMMISSION = 7000; // High range

const DO_UPDATE = process.env.UPDATE === 'true';

async function main() {
    console.log(`🚀 Starting Price RANGE Update Script...`);
    console.log(`MODE: ${DO_UPDATE ? "LIVE UPDATE" : "DRY RUN (Read-Only)"}`);
    console.log("------------------------------------------------");

    const packages = await prisma.package.findMany({
        orderBy: { title: 'asc' }
    });

    const updates = [];

    for (const pkg of packages) {
        // 1. Parse Duration
        let days = 0;
        const dayMatch = pkg.duration.match(/(\d+)\s*Days?/i);
        if (dayMatch) {
            days = parseInt(dayMatch[1]);
        } else {
            const digits = pkg.duration.match(/\d+/g);
            if (digits && digits.length > 0) days = Math.max(...digits.map(d => parseInt(d)));
            else days = 5;
        }

        const expectedNights = Math.max(1, days - 1);
        let srinagarNights = 0;
        let otherNights = 0;

        let itinerary = [];
        try {
            if (typeof pkg.itinerary === 'string') itinerary = JSON.parse(pkg.itinerary);
            else itinerary = pkg.itinerary;
        } catch (e) { }

        if (itinerary.length > 0) {
            let countedNights = 0;
            const nightsToAnalyze = itinerary.slice(0, Math.min(itinerary.length, expectedNights));
            for (const item of nightsToAnalyze) {
                const text = (item.title + " " + item.desc).toLowerCase();
                if (text.includes("gulmarg") || text.includes("pahalgam") || text.includes("sonmarg") || text.includes("gurez") || text.includes("kargil") || text.includes("leh")) {
                    otherNights++;
                } else {
                    srinagarNights++;
                }
                countedNights++;
            }
            const remaining = expectedNights - countedNights;
            if (remaining > 0) srinagarNights += remaining;
        } else {
            srinagarNights = Math.floor(expectedNights / 2);
            otherNights = expectedNights - srinagarNights;
        }

        // --- CALCULATE MIN PRICE ---
        const minHotel = (srinagarNights * MIN_HOTEL_SRINAGAR) + (otherNights * MIN_HOTEL_OTHERS);
        const minCab = days * MIN_CAB_PER_DAY;
        const minTotal = minHotel + minCab + MIN_SHIKARA + MIN_COMMISSION;
        // Special Override for "Winter Wonderland" to hit magic number 13999 if close?
        // User specifically asked for range. So let's stick to math.
        const priceMin = Math.ceil(minTotal / 2);

        // --- CALCULATE MAX PRICE ---
        const maxHotel = (srinagarNights * MAX_HOTEL_SRINAGAR) + (otherNights * MAX_HOTEL_OTHERS);
        const maxCab = days * MAX_CAB_PER_DAY;
        const maxTotal = maxHotel + maxCab + MAX_SHIKARA + MAX_COMMISSION;
        const priceMax = Math.ceil(maxTotal / 2);

        // Format Logic
        // Round to nearest 50 or 99?
        // Let's just use raw for now.

        // Construct Range String
        const rangeString = `₹${priceMin.toLocaleString()} - ₹${priceMax.toLocaleString()}`;

        console.log(`📦 ${pkg.title}`);
        console.log(`   Internal Calc: [Min: ₹${priceMin} | Max: ₹${priceMax}]`);
        console.log(`   New Range: ${rangeString}`);

        if (DO_UPDATE) {
            updates.push(
                prisma.package.update({
                    where: { id: pkg.id },
                    data: {
                        startingPrice: priceMin, // Lower bound for sorting
                        priceRange: rangeString
                    }
                })
            );
        }
    }

    if (DO_UPDATE) {
        console.log(`\n💾 Persisting ${updates.length} updates...`);
        await prisma.$transaction(updates);
        console.log("✅ Done!");
    } else {
        console.log(`\n📢 Dry Run Complete.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
