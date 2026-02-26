
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🏨 Adding Hotel Grand Boulevard...');

    // 1. Create or Find the Hotel
    // Using findFirst because 'name' is not @unique in schema.
    let hotel = await prisma.hotel.findFirst({
        where: { name: 'Hotel Grand Boulevard' }
    });

    if (!hotel) {
        hotel = await prisma.hotel.create({
            data: {
                name: 'Hotel Grand Boulevard',
                location: 'Srinagar',
                type: 'Hotel', // Required
                address: 'Boulevard Road, Opp. Ghat 10, Dal Lake, Srinagar, J&K, 190001',
                stars: 4,
                image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/495056711.jpg?k=3045095406085149470908864703803801842854084351052150918070868108&o=&hp=1',
                // Removed: slug, description, amenities, baseRatesValidUntil
            },
        });
        console.log(`✅ Hotel Created: ${hotel.name}`);
    } else {
        console.log(`ℹ️ Hotel Found: ${hotel.name}`);
    }

    // 2. Define Room Types
    const roomTypes = [
        {
            name: 'Luxury Deluxe',
            // No capacity or description in RoomType schema
            baseEp: 7000,
            baseCp: 8000,
            baseMap: 10000,
            baseAp: 12000,
            extraBedEp: 1000,
            extraBedCp: 1500,
            extraBedMap: 2000,
            extraBedAp: 2500,
        },
        {
            name: 'Luxury Suite',
            baseEp: 8000,
            baseCp: 9000,
            baseMap: 11000,
            baseAp: 13000,
            extraBedEp: 1000,
            extraBedCp: 1500,
            extraBedMap: 2000,
            extraBedAp: 2500,
        },
        {
            name: 'Luxury Family Suite',
            baseEp: 11000,
            baseCp: 12000,
            baseMap: 14500,
            baseAp: 16500,
            extraBedEp: 1000,
            extraBedCp: 1500,
            extraBedMap: 2000,
            extraBedAp: 2500,
        },
        {
            name: 'Luxury Family Studios',
            baseEp: 13000,
            baseCp: 14000,
            baseMap: 16500,
            baseAp: 18500,
            extraBedEp: 1000,
            extraBedCp: 1500,
            extraBedMap: 2000,
            extraBedAp: 2500,
        },
    ];

    for (const rt of roomTypes) {
        // Upsert logic for RoomType manually since composite unique might not exist
        let roomType = await prisma.roomType.findFirst({
            where: {
                hotelId: hotel.id,
                name: rt.name
            }
        });

        if (!roomType) {
            roomType = await prisma.roomType.create({
                data: {
                    hotelId: hotel.id,
                    name: rt.name,
                    priceEP: rt.baseEp,
                    priceCP: rt.baseCp,
                    priceMAP: rt.baseMap,
                    priceAP: rt.baseAp,
                    extraBedEP: rt.extraBedEp,
                    extraBedCP: rt.extraBedCp,
                    extraBedMAP: rt.extraBedMap,
                    extraBedAP: rt.extraBedAp,
                },
            });
            console.log(`   🔹 Room Created: ${rt.name}`);
        } else {
            console.log(`   ℹ️ Room Found: ${rt.name}`);
        }

        // 3. Add Seasonal Rates (20 Mar 2026 - 31 July 2026)
        // Check if rate already exists to avoid duplicates
        const startDate = new Date('2026-03-20');
        const endDate = new Date('2026-07-31');

        const existingRate = await prisma.roomRate.findFirst({
            where: {
                roomTypeId: roomType.id,
                validFrom: startDate,
                validTo: endDate
            }
        });

        if (!existingRate) {
            await prisma.roomRate.create({
                data: {
                    roomTypeId: roomType.id,
                    validFrom: startDate, // Correct field name
                    validTo: endDate,     // Correct field name
                    priceEP: rt.baseEp,
                    priceCP: rt.baseCp, // Matches screenshot
                    priceMAP: rt.baseMap, // Matches screenshot
                    priceAP: rt.baseAp,
                    extraBedEP: rt.extraBedEp,
                    extraBedCP: rt.extraBedCp, // 1500
                    extraBedMAP: rt.extraBedMap, // 2000
                    extraBedAP: rt.extraBedAp,
                    bookingValidUntil: null // Optional
                },
            });
            console.log(`      📅 Seasonal Rate Added (20 Mar - 31 Jul)`);
        } else {
            console.log(`      ℹ️ Seasonal Rate already exists.`);
        }
    }

    console.log('✅ All Data Inserted!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
