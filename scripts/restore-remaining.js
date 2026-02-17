const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreRemaining() {
    const backupPath = path.join(__dirname, '..', 'backup-full.json');
    if (!fs.existsSync(backupPath)) {
        console.error('❌ Backup file not found at:', backupPath);
        process.exit(1);
    }

    console.log('Reading backup file...');
    const data = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

    console.log('Starting remaining restoration...');

    try {
        // 8. Bookings Hierarchy
        if (data.bookings?.length) {
            console.log(`Restoring ${data.bookings.length} Bookings...`);
            for (const booking of data.bookings) {
                const { payments, expenses, ...bookingData } = booking;

                // Clean up nested objects (remove bookingId as it's implied in nested create)
                const cleanPayments = payments?.map(({ bookingId, ...p }) => p) || [];
                const cleanExpenses = expenses?.map(({ bookingId, ...e }) => e) || [];

                // Fix for potential JSON object vs String mismatch
                if (bookingData.hotelInfo && typeof bookingData.hotelInfo === 'object') {
                    bookingData.hotelInfo = JSON.stringify(bookingData.hotelInfo);
                }
                if (bookingData.transportInfo && typeof bookingData.transportInfo === 'object') {
                    bookingData.transportInfo = JSON.stringify(bookingData.transportInfo);
                }

                try {
                    await prisma.booking.upsert({
                        where: { id: booking.id },
                        update: {},
                        create: {
                            ...bookingData,
                            payments: { create: cleanPayments },
                            expenses: { create: cleanExpenses }
                        }
                    });
                    console.log(`Restored Booking ${booking.id}`);
                } catch (e) {
                    console.error(`Failed Booking ${booking.id}:`, e.message);
                }
            }
        } else {
            console.log('No bookings found in backup.');
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
                    console.log(`Restored Quote ${quote.id}`);
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
                    console.log(`Restored Itinerary ${it.id}`);
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
                    console.log(`Restored Job ${job.id}`);
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
                    console.log(`Restored Subscriber ${sub.email}`);
                } catch (e) { console.error(`Failed Subscriber ${sub.email}`, e.message); }
            }
        }

        console.log('✅ Remaining items restoration completed!');

    } catch (error) {
        console.error('❌ Restore critical failure:', error);
    } finally {
        await prisma.$disconnect();
    }
}

restoreRemaining();
