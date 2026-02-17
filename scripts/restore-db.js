const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restore() {
    const backupPath = path.join(__dirname, '..', 'backup-full.json');
    if (!fs.existsSync(backupPath)) {
        console.error('❌ Backup file not found at:', backupPath);
        process.exit(1);
    }

    console.log('Reading backup file...');
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    console.log('Starting restoration...');

    try {
        // 1. Users
        if (data.users?.length) {
            console.log(`Restoring ${data.users.length} Users...`);
            for (const user of data.users) {
                try {
                    await prisma.user.upsert({
                        where: { email: user.email },
                        update: {},
                        create: user
                    });
                } catch (e) {
                    console.error(`Failed User ${user.email}:`, e.message);
                }
            }
        }

        // 2. Destinations
        if (data.destinations?.length) {
            console.log(`Restoring ${data.destinations.length} Destinations...`);
            for (const dest of data.destinations) {
                try {
                    await prisma.destination.upsert({
                        where: { slug: dest.slug },
                        update: {},
                        create: dest
                    });
                } catch (e) {
                    console.error(`Failed Destination ${dest.slug}:`, e.message);
                }
            }
        }

        // 3. Packages
        if (data.packages?.length) {
            console.log(`Restoring ${data.packages.length} Packages...`);
            for (const pkg of data.packages) {
                try {
                    await prisma.package.upsert({
                        where: { slug: pkg.slug },
                        update: {},
                        create: pkg
                    });
                } catch (e) {
                    console.error(`Failed Package ${pkg.slug}:`, e.message);
                }
            }
        }

        // 4. Transport
        if (data.transports?.length) {
            console.log(`Restoring ${data.transports.length} Transports...`);
            for (const t of data.transports) {
                try {
                    // Transport has no unique slug, usually just ID. upsert by ID.
                    await prisma.transport.upsert({
                        where: { id: t.id },
                        update: {},
                        create: t
                    });
                } catch (e) {
                    console.error(`Failed Transport ${t.name}:`, e.message);
                }
            }
        }

        // 5. Hotels & Rooms Hierarchy
        if (data.hotels?.length) {
            console.log(`Restoring ${data.hotels.length} Hotels...`);
            for (const hotel of data.hotels) {
                const { rooms, ...hotelData } = hotel;

                try {
                    await prisma.hotel.upsert({
                        where: { id: hotel.id },
                        update: {},
                        create: hotelData
                    });

                    if (rooms?.length) {
                        for (const room of rooms) {
                            const { rates, ...roomData } = room;
                            await prisma.roomType.upsert({
                                where: { id: room.id },
                                update: {},
                                create: { ...roomData, hotelId: hotel.id }
                            });

                            if (rates?.length) {
                                for (const rate of rates) {
                                    await prisma.roomRate.upsert({
                                        where: { id: rate.id },
                                        update: {},
                                        create: { ...rate, roomTypeId: room.id }
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error(`Failed Hotel ${hotel.name}:`, e.message);
                }
            }
        }

        // 6. Customers
        if (data.customers?.length) {
            console.log(`Restoring ${data.customers.length} Customers...`);
            for (const customer of data.customers) {
                try {
                    await prisma.customer.upsert({
                        where: { id: customer.id },
                        update: {},
                        create: customer
                    });
                } catch (e) {
                    console.error(`Failed Customer ${customer.name}:`, e.message);
                }
            }
        }

        // 7. Inquiries
        if (data.inquiries?.length) {
            console.log(`Restoring ${data.inquiries.length} Inquiries...`);
            for (const inquiry of data.inquiries) {
                try {
                    await prisma.inquiry.upsert({
                        where: { id: inquiry.id },
                        update: {},
                        create: inquiry
                    });
                } catch (e) {
                    console.error(`Failed Inquiry ${inquiry.id}:`, e.message);
                }
            }
        }

        // 8. Bookings Hierarchy
        if (data.bookings?.length) {
            console.log(`Restoring ${data.bookings.length} Bookings...`);
            for (const booking of data.bookings) {
                const { payments, expenses, ...bookingData } = booking;
                try {
                    await prisma.booking.upsert({
                        where: { id: booking.id },
                        update: {},
                        create: {
                            ...bookingData,
                            payments: { create: payments }, // Nested create might fail on re-run if payments exist
                            expenses: { create: expenses }
                        }
                    });
                } catch (e) {
                    // If upsert failed, it might be due to nested create conflict.
                    // Try create booking without nested, then add nested?
                    // Or just log error.
                    console.error(`Failed Booking ${booking.id}:`, e.message);
                }
            }
        }

        // 9. Tools
        if (data.quotes?.length) {
            console.log(`Restoring ${data.quotes.length} Quotes...`);
            for (const quote of data.quotes) {
                try {
                    await prisma.quote.upsert({
                        where: { id: quote.id },
                        update: {},
                        create: quote
                    });
                } catch (e) { console.error(`Failed Quote ${quote.id}`, e.message); }
            }
        }

        if (data.itineraries?.length) {
            console.log(`Restoring ${data.itineraries.length} Itineraries...`);
            for (const it of data.itineraries) {
                try {
                    await prisma.itinerary.upsert({
                        where: { id: it.id },
                        update: {},
                        create: it
                    });
                } catch (e) { console.error(`Failed Itinerary ${it.id}`, e.message); }
            }
        }

        // 10. Jobs
        if (data.jobs?.length) {
            console.log(`Restoring ${data.jobs.length} Jobs...`);
            for (const job of data.jobs) {
                const { applications, ...jobData } = job;
                try {
                    await prisma.job.upsert({
                        where: { id: job.id },
                        update: {},
                        create: {
                            ...jobData,
                            applications: { create: applications }
                        }
                    });
                } catch (e) { console.error(`Failed Job ${job.id}`, e.message); }
            }
        }

        // 11. Subscribers & Logs
        if (data.subscribers?.length) {
            console.log(`Restoring ${data.subscribers.length} Subscribers...`);
            for (const sub of data.subscribers) {
                try {
                    await prisma.subscriber.upsert({
                        where: { email: sub.email },
                        update: {},
                        create: sub
                    });
                } catch (e) { console.error(`Failed Subscriber ${sub.email}`, e.message); }
            }
        }

        console.log('✅ Restoration completed successfully!');

    } catch (error) {
        console.error('❌ Restore critical failure:', error);
    } finally {
        await prisma.$disconnect();
    }
}

restore();
