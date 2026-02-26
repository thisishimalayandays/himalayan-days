
import { prisma } from '../lib/prisma';
import { db } from '../lib/db';

if (prisma === db) {
    console.log('✅ Singleton Pattern Verified: prisma and db are the SAME instance.');
} else {
    console.error('❌ Singleton Pattern FAILED: prisma and db are DIFFERENT instances.');
    process.exit(1);
}

async function checkConnection() {
    try {
        await prisma.$connect();
        console.log('✅ Database Connection Successful.');
    } catch (error) {
        console.error('❌ Database Connection Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkConnection();
