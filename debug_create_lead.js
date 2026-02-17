
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Attempting to create a debug lead...');

    try {
        const lead = await prisma.inquiry.create({
            data: {
                name: 'Debug Test Lead',
                phone: '+919999999999',
                type: 'GENERAL',
                message: 'This is a test lead to verify DB writes.',
                status: 'PENDING'
            }
        });
        console.log('Successfully created lead:', lead.id);

        // Clean up
        await prisma.inquiry.delete({ where: { id: lead.id } });
        console.log('Successfully deleted debug lead.');
    } catch (e) {
        console.error('Failed to create lead:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
