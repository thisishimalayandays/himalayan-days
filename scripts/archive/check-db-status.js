const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const userCount = await prisma.user.count();
        const destCount = await prisma.destination.count();
        const pkgCount = await prisma.package.count();
        const transCount = await prisma.transport.count();
        const hotelCount = await prisma.hotel.count();
        const customerCount = await prisma.customer.count();
        const inquiryCount = await prisma.inquiry.count();
        const bookingCount = await prisma.booking.count();
        const quoteCount = await prisma.quote.count();
        const jobCount = await prisma.job.count();
        const subCount = await prisma.subscriber.count();

        console.log('--- DB Status ---');
        console.log(`Users: ${userCount}`);
        console.log(`Destinations: ${destCount}`);
        console.log(`Packages: ${pkgCount}`);
        console.log(`Transports: ${transCount}`);
        console.log(`Hotels: ${hotelCount}`);
        console.log(`Customers: ${customerCount}`);
        console.log(`Inquiries: ${inquiryCount}`);
        console.log(`Bookings: ${bookingCount}`);
        console.log(`Quotes: ${quoteCount}`);
        console.log(`Jobs: ${jobCount}`);
        console.log(`Subscribers: ${subCount}`);

    } catch (e) {
        console.error('Check failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
