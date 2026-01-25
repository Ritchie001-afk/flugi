import { NextResponse } from 'next/server';
import { scrapeTripAdvisor } from '@/app/adminF/scrape-action';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'Chybí URL' }, { status: 400 });
        }

        const result = await scrapeTripAdvisor(url);

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: result.data });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
