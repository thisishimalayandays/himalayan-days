
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Testing database connection...');
        const count = await prisma.subscriber.count();
        console.log('Subscriber table exists. Count:', count);
    } catch (e) {
        console.error('Error connecting to database or finding table:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
