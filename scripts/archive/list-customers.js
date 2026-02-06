const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const customers = await prisma.customer.findMany({
        include: { bookings: true }
    });
    console.log("Existing Customers:");
    customers.forEach(c => {
        console.log(`- [${c.id}] ${c.name} (${c.bookings.length} bookings)`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
