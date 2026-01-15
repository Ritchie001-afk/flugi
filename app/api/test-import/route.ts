
import { NextResponse } from 'next/server';
import { parseAndImportInviaXML } from '@/lib/xml-parser';

// Sample XML from your Invia link
const SAMPLE_XML = `<?xml version="1.0" encoding="utf-8"?>
<zajezdy>
    <zajezd>
        <tour_id>SAMPLE-TEST-001</tour_id>
        <tour_title>Testovací hotel Invia XML</tour_title>
        <hotel hotel_kat="4">Hotel Budoucnosti</hotel>
        <destinace>
            <zeme name="Španělsko">
                <lokalita name="Costa Brava" />
            </zeme>
        </destinace>
        <popisy>
            <popis name="Info">Toto je testovací import z XML parseru.</popis>
        </popisy>
        <fotky>
            <fotka url="https://images.unsplash.com/photo-1566073771259-6a8506099945" />
        </fotky>
        <!-- Mocking terms since they were complex in raw sample -->
    </zajezd>
</zajezdy>`;

export async function GET(req: Request) {
    if (process.env.NODE_ENV === 'production') {
        // Simple auth
        const url = new URL(req.url);
        if (url.searchParams.get('secret') !== 'flugi-import-test') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    try {
        // We simulate parsing logic here for the test
        // In real app, we would fetch URL
        const result = await parseAndImportInviaXML(SAMPLE_XML);

        // Simulating the DB save part since parser.ts had it commented out
        // We will enable it fully once verified

        return NextResponse.json({
            success: true,
            message: "Parsed successfully. Check console logs for details.",
            parsed: result
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
