
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.deal.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error("API Delete Error:", e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
