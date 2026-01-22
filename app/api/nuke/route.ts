import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("API NUKE: Starting deletion...");

        // 1. Count before
        const before = await prisma.deal.count();
        console.log(`API NUKE: Found ${before} deals.`);

        // 2. Delete All
        const result = await prisma.deal.deleteMany({});
        console.log(`API NUKE: Deleted ${result.count} deals.`);

        return NextResponse.json({
            success: true,
            message: `Successfully nuked ${result.count} deals.`,
            count: result.count,
            beforeCount: before
        });

    } catch (error: any) {
        console.error("API NUKE ERROR:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
