const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'sales@himalayandays.in';
    const password = 'kptGI>85+1J9'; // Updated as per user request
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: 'SALES',
            password: hashedPassword // Update password just in case
        },
        create: {
            email,
            name: 'Sales Team',
            password: hashedPassword,
            role: 'SALES',
        },
    });

    console.log(`Created/Updated user: ${user.email} with role ${user.role}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
