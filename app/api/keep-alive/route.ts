import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent static caching

export async function GET() {
    return NextResponse.json(
        { status: 'ok', time: new Date().toISOString() },
        { status: 200 }
    );
}
