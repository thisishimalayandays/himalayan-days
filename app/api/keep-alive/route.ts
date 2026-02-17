
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    // Return a static response without touching the DB to save Compute Hours
    return NextResponse.json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        db: 'disconnected_to_save_costs'
    }, { status: 200 });
}
