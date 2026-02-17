const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backup() {
    console.log('Starting full database backup...');
    const data = {};

    try {
        // 1. Core Data
        console.log('Fetching Users...');
        data.users = await prisma.user.findMany();

        console.log('Fetching Destinations...');
        data.destinations = await prisma.destination.findMany();

        console.log('Fetching Packages...');
        data.packages = await prisma.package.findMany();

        console.log('Fetching Transport...');
        data.transports = await prisma.transport.findMany();

        // 2. Hotel Inventory (Hierarchy)
        console.log('Fetching Hotels & Rooms...');
        data.hotels = await prisma.hotel.findMany({
            include: {
                rooms: {
                    include: {
                        rates: true
                    }
                }
            }
        });

        // 3. CRM Data
        console.log('Fetching Customers...');
        data.customers = await prisma.customer.findMany();

        console.log('Fetching Inquiries...');
        data.inquiries = await prisma.inquiry.findMany();

        console.log('Fetching Subscribers...');
        data.subscribers = await prisma.subscriber.findMany();

        // 4. Booking System (Hierarchy)
        console.log('Fetching Bookings & Financials...');
        data.bookings = await prisma.booking.findMany({
            include: {
                payments: true,
                expenses: true
            }
        });

        // 5. Tools Data
        console.log('Fetching Quotes...');
        data.quotes = await prisma.quote.findMany();

        console.log('Fetching Itineraries...');
        data.itineraries = await prisma.itinerary.findMany();

        // 6. Jobs
        console.log('Fetching Jobs & Applications...');
        data.jobs = await prisma.job.findMany({
            include: {
                applications: true
            }
        });

        // 7. System
        console.log('Fetching Audit Logs...');
        data.auditLogs = await prisma.auditLog.findMany();

        // Write to file
        const backupPath = path.join(__dirname, '..', 'backup-full.json');
        fs.writeFileSync(backupPath, JSON.stringify(data, null, 2));

        console.log(`\n✅ Backup completed successfully!`);
        console.log(`📁 Saved to: ${backupPath}`);
        console.log(`📊 Statistics:`);
        console.log(`- Customers: ${data.customers.length}`);
        console.log(`- Bookings: ${data.bookings.length}`);
        console.log(`- Quotes: ${data.quotes.length}`);
        console.log(`- Hotels: ${data.hotels.length}`);

    } catch (error) {
        console.error('❌ Backup failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

backup();
