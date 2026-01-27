
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Perform a lightweight query to wake up the DB connection
        const count = await prisma.package.count({ take: 1 });

        return NextResponse.json({
            status: 'alive',
            timestamp: new Date().toISOString(),
            db: 'connected',
            count
        }, { status: 200 });
    } catch (error) {
        console.error('Keep-alive failed:', error);
        return NextResponse.json({
            status: 'error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
