const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Delete all bookings first due to foreign key constraints (if cascade isn't set, but prisma usually requires manual deletion or cascade setup)
    // Checking schema might be good, but safe bet is delete bookings then customers.
    // Actually, I should check if bookings exist.

    const deletedBookings = await prisma.booking.deleteMany({});
    console.log(`Deleted ${deletedBookings.count} bookings.`);

    const deletedCustomers = await prisma.customer.deleteMany({});
    console.log(`Deleted ${deletedCustomers.count} customers.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
