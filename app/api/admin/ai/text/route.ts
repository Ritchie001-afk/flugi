import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
        }
        const genAI = new GoogleGenerativeAI(apiKey);

        const { type, destination, startDate, endDate } = await req.json();

        if (!destination) {
            return NextResponse.json({ error: "Missing destination" }, { status: 400 });
        }

        // Using verified model from search
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        let prompt = "";
        if (type === 'description') {
            prompt = `Napiš lákavý marketingový popis pro dovolenou v destinaci "${destination}". Maximálně 3 odstavce. Použij emotikony.`;
        } else if (type === 'requirements') {
            prompt = `Jaké jsou aktuální vstupní podmínky a vízová povinnost pro občany ČR do destinace "${destination}"?
            Odpověz stručně (max 2 věty).
            Na konec PŘIDEJ oficiální odkaz na stránky Ministerstva zahraničních věcí ČR (mzv.cz) s informacemi pro tuto zemi/oblast.
            Pokud odkaz neznáš přesně, vygeneruj odkaz na vyhledávání na mzv.cz.
            Formát: "[Podmínky]. Více info: [URL]"`;
        } else if (type === 'weather') {
            const dates = startDate ? `v termínu od ${startDate} do ${endDate}` : 'v tomto období';
            prompt = `Jsi expert na počasí. Popiš stručně (max 2 věty) typické počasí a teploty pro destinaci "${destination}" ${dates}. Odpověz česky.`;
        } else if (type === 'facebook_post') {
            const { price, origin, airline, baggage, transfers, dealType } = await req.json().catch(() => ({}));

            // Build context string from available data
            let details = [];
            if (price) details.push(`Cena: ${price} Kč`);
            if (origin) details.push(`Místo odletu: ${origin}`);
            if (startDate && endDate) {
                // Parse dates to nice format (e.g. 25.5.2026 - 8.6.2026)
                const start = new Date(startDate);
                const end = new Date(endDate);
                if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                    details.push(`Termín: ${start.getDate()}.${start.getMonth() + 1}.${start.getFullYear()} - ${end.getDate()}.${end.getMonth() + 1}.${end.getFullYear()}`);
                }
            }
            if (airline) details.push(`Letecká společnost: ${airline}`);
            if (baggage) details.push(`Zavazadla: ${baggage}`);
            if (transfers !== undefined && transfers !== '') {
                const tr = parseInt(transfers);
                if (tr === 0) details.push('Přestupy: Přímý let');
                else if (tr === 1) details.push('Přestupy: 1 přestup');
                else details.push(`Přestupy: ${tr} přestupy`);
            }
            const detailsStr = details.length > 0 ? `\nParametry nabídky:\n- ${details.join('\n- ')}` : '';
            const isPackage = dealType === 'package' ? 'kompletní zájezd' : 'akční letenka';

            prompt = `Jsi copywriter cestovatelského portálu. Napiš krátký úvodní text (cca 1-2 věty) k nové nabídce (${isPackage}) do destinace "${destination}". 
            Následně shrň uživatelům tyto exaktní parametry formou bodů:
            ${detailsStr}
            
            DŮLEŽITÉ PRAVIDLO: V bodech použij PŘESNĚ ta data, která ti posílám. NESMÍŠ si vymýšlet detaily navíc (např. váhu zavazadla, města přestupů jako Istanbul, nebo měnit konkrétní datum). 
            Pokud píšeš o přestupech, napiš pouze počet přestupů bez měst.
            
            Můžeš dopsat jednu krátkou lákavou větu (např. o typickém počasí v této destinaci, nebo že se poletí s výbornou aerolinkou).
            Styl: Přehledný, stručný, informativní. Použij emotikony, na konec vlož jasnou výzvu (CTA) k zobrazení detailů a vhodné hashtagy. Nepoužívej markdownové formátování.`;
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("AI Text Gen Error:", error);
        return NextResponse.json({ error: `AI Error: ${error.message} ` }, { status: 500 });
    }
}
