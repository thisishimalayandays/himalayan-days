const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function main() {
    console.log('\n🔐 Admin Password Reset Utility\n');

    rl.question('Enter new password for Admin: ', async (password) => {
        if (!password || password.length < 6) {
            console.error('❌ Error: Password must be at least 6 characters long.');
            rl.close();
            process.exit(1);
        }

        try {
            console.log('Hashing password...');
            const hashedPassword = await bcrypt.hash(password, 10);

            console.log('Updating database...');
            const user = await prisma.user.update({
                where: { email: 'admin@himalayandays.in' },
                data: {
                    password: hashedPassword,
                },
            });

            console.log('\n✅ Success! Password for ' + user.email + ' has been updated.');
            console.log('You can now login with your new password.\n');
        } catch (error) {
            console.error('\n❌ Failed to update password:', error);
            if (error.code === 'P2025') {
                console.error('Reason: Admin user "admin@himalayandays.in" not found in database.');
            }
        } finally {
            await prisma.$disconnect();
            rl.close();
        }
    });
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
