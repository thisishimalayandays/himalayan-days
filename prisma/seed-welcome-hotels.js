
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Welcome Group Hotels...');

    // --- 1. Hotel Welcome Residency Shivpora, Srinagar ---
    const hotel1 = await prisma.hotel.create({
        data: {
            name: 'Hotel Welcome Residency Shivpora',
            location: 'Srinagar',
            type: 'Hotel',
            stars: 3,
            address: 'Shivpora, Srinagar',
            rooms: {
                create: [
                    {
                        name: 'Deluxe Room',
                        baseRate: 2400, // Fallback to CP
                        priceEP: 0,
                        priceCP: 2400,
                        priceMAP: 3400,
                        priceAP: 0,
                        extraBed: 900, // Fallback CP
                        extraBedEP: 0,
                        extraBedCP: 900,
                        extraBedMAP: 1000,
                        extraBedAP: 0,
                        rates: {
                            create: [
                                {
                                    validFrom: new Date('2026-03-16'),
                                    validTo: new Date('2026-06-30'),
                                    priceEP: 0,
                                    priceCP: 2400,
                                    priceMAP: 3400,
                                    priceAP: 0,
                                    extraBed: 900,
                                    extraBedEP: 0,
                                    extraBedCP: 900,
                                    extraBedMAP: 1000,
                                    extraBedAP: 0,
                                    bookingValidUntil: new Date('2026-02-28'),
                                },
                            ],
                        },
                    },
                    {
                        name: 'Heritage Deluxe Room',
                        baseRate: 2900, // Fallback CP
                        priceEP: 0,
                        priceCP: 2900,
                        priceMAP: 4000,
                        priceAP: 0,
                        extraBed: 900, // Fallback CP
                        extraBedEP: 0,
                        extraBedCP: 900,
                        extraBedMAP: 1000,
                        extraBedAP: 0,
                        rates: {
                            create: [
                                {
                                    validFrom: new Date('2026-03-16'),
                                    validTo: new Date('2026-06-30'),
                                    priceEP: 0,
                                    priceCP: 2900,
                                    priceMAP: 4000,
                                    priceAP: 0,
                                    extraBed: 900,
                                    extraBedEP: 0,
                                    extraBedCP: 900,
                                    extraBedMAP: 1000,
                                    extraBedAP: 0,
                                    bookingValidUntil: new Date('2026-02-28'),
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    console.log('Created:', hotel1.name);

    // --- 2. Welcome Hotel Gulmarg ---
    const hotel2 = await prisma.hotel.create({
        data: {
            name: 'Welcome Hotel Gulmarg',
            location: 'Gulmarg',
            type: 'Hotel',
            stars: 3,
            rooms: {
                create: [
                    {
                        name: 'Standard Deluxe Room',
                        baseRate: 4000, // Fallback CP
                        priceEP: 0,
                        priceCP: 4000,
                        priceMAP: 5000,
                        priceAP: 0,
                        extraBed: 900, // Fallback CP
                        extraBedEP: 0,
                        extraBedCP: 900,
                        extraBedMAP: 1200,
                        extraBedAP: 0,
                        rates: {
                            create: [
                                {
                                    validFrom: new Date('2026-03-16'),
                                    validTo: new Date('2026-06-30'),
                                    priceEP: 0,
                                    priceCP: 4000,
                                    priceMAP: 5000,
                                    priceAP: 0,
                                    extraBed: 900,
                                    extraBedEP: 0,
                                    extraBedCP: 900,
                                    extraBedMAP: 1200,
                                    extraBedAP: 0,
                                    bookingValidUntil: new Date('2026-02-28'),
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    console.log('Created:', hotel2.name);

    // --- 3. Welcome Hotel at Dal Lake, Srinagar ---
    const hotel3 = await prisma.hotel.create({
        data: {
            name: 'Welcome Hotel at Dal Lake', // Using name from image
            location: 'Srinagar',
            type: 'Hotel',
            stars: 4, // Assume higher due to "Luxury Suite"
            address: 'Dal Lake, Srinagar',
            rooms: {
                create: [
                    {
                        name: 'Standard Deluxe Room',
                        baseRate: 5300,
                        priceEP: 0,
                        priceCP: 5300,
                        priceMAP: 7000,
                        priceAP: 0,
                        extraBed: 1200,
                        extraBedEP: 0,
                        extraBedCP: 1200,
                        extraBedMAP: 1800,
                        extraBedAP: 0,
                        rates: {
                            create: [
                                {
                                    validFrom: new Date('2026-03-16'),
                                    validTo: new Date('2026-06-30'),
                                    priceEP: 0,
                                    priceCP: 5300,
                                    priceMAP: 7000,
                                    priceAP: 0,
                                    extraBed: 1200,
                                    extraBedEP: 0,
                                    extraBedCP: 1200,
                                    extraBedMAP: 1800,
                                    extraBedAP: 0,
                                    bookingValidUntil: new Date('2026-02-28'),
                                },
                            ],
                        },
                    },
                    {
                        name: 'Deluxe Premium Room',
                        baseRate: 6000,
                        priceEP: 0,
                        priceCP: 6000,
                        priceMAP: 7800,
                        priceAP: 0,
                        extraBed: 1200,
                        extraBedEP: 0,
                        extraBedCP: 1200,
                        extraBedMAP: 1800,
                        extraBedAP: 0,
                        rates: {
                            create: [
                                {
                                    validFrom: new Date('2026-03-16'),
                                    validTo: new Date('2026-06-30'),
                                    priceEP: 0,
                                    priceCP: 6000,
                                    priceMAP: 7800,
                                    priceAP: 0,
                                    extraBed: 1200,
                                    extraBedEP: 0,
                                    extraBedCP: 1200,
                                    extraBedMAP: 1800,
                                    extraBedAP: 0,
                                    bookingValidUntil: new Date('2026-02-28'),
                                },
                            ],
                        },
                    },
                    {
                        name: 'Executive Suite Room (Front Lake View)',
                        baseRate: 10000,
                        priceEP: 0,
                        priceCP: 10000,
                        priceMAP: 11500,
                        priceAP: 0,
                        extraBed: 1200,
                        extraBedEP: 0,
                        extraBedCP: 1200,
                        extraBedMAP: 1800,
                        extraBedAP: 0,
                        rates: {
                            create: [
                                {
                                    validFrom: new Date('2026-03-16'),
                                    validTo: new Date('2026-06-30'),
                                    priceEP: 0,
                                    priceCP: 10000,
                                    priceMAP: 11500,
                                    priceAP: 0,
                                    extraBed: 1200,
                                    extraBedEP: 0,
                                    extraBedCP: 1200,
                                    extraBedMAP: 1800,
                                    extraBedAP: 0,
                                    bookingValidUntil: new Date('2026-02-28'),
                                },
                            ],
                        },
                    },
                    {
                        name: 'Luxury Suite Room (Side Lake View)',
                        baseRate: 11500,
                        priceEP: 0,
                        priceCP: 11500,
                        priceMAP: 13500,
                        priceAP: 0,
                        extraBed: 1200,
                        extraBedEP: 0,
                        extraBedCP: 1200,
                        extraBedMAP: 1800,
                        extraBedAP: 0,
                        rates: {
                            create: [
                                {
                                    validFrom: new Date('2026-03-16'),
                                    validTo: new Date('2026-06-30'),
                                    priceEP: 0,
                                    priceCP: 11500,
                                    priceMAP: 13500,
                                    priceAP: 0,
                                    extraBed: 1200,
                                    extraBedEP: 0,
                                    extraBedCP: 1200,
                                    extraBedMAP: 1800,
                                    extraBedAP: 0,
                                    bookingValidUntil: new Date('2026-02-28'),
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });
    console.log('Created:', hotel3.name);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
