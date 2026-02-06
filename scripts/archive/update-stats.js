const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const pkg = await prisma.package.update({
            where: { slug: 'winter-wonderland-kashmir' },
            data: {
                reviews: 915,
                rating: 4.9,
            },
        });
        console.log('Updated package:', pkg.title);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
