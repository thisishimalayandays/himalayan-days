import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const folder = '/The Ultimate Kashmir Spring Symphony';
    const imgs = [
        `${folder}/godson-gnanaraj-aIT2q4Dqnxk-unsplash.jpg`,
        `${folder}/imad-clicks-F-_Toc4yl-g-unsplash.jpg`,
        `${folder}/naweedey-XHG0uFAlEGM-unsplash.jpg`,
        `${folder}/rodrigo-curi-e7JSxtpnCw4-unsplash.jpg`,
        `${folder}/slava-stupachenko-tSc0IGImr-c-unsplash.jpg`,
    ];

    const result = await prisma.package.update({
        where: { slug: 'kashmir-spring-symphony' },
        data: {
            image: imgs[0],
            gallery: JSON.stringify(imgs),
        },
    });

    console.log('✅ Images updated for:', result.title);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
