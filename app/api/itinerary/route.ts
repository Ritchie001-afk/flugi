
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { destination, days } = body;

        if (!destination) {
            return NextResponse.json({ error: "Chybí destinace" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
        Jsi zkušený cestovní průvodce. Vytvoř detailní itinerář na ${days || 3} dní pro destinaci: ${destination}.
        
        Struktura odpovědi (v Markdown):
        - Nadpis: Skvělý plán pro ${destination}
        - Úvod: Krátké nalákání (1 věta).
        - Pro každý den (Den 1, Den 2...):
          - Hlavní aktivity (ráno, odpoledne, večer).
          - Konkrétní tipy na památky, pláže nebo zážitky.
        - Závěr: Tip na místní jídlo, které musí ochutnat.

        Buď stručný, ale informačně hodnotný. Používej emotikony. Piš česky.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ itinerary: text });

    } catch (error: any) {
        console.error("Gemini API Error Detail:", error?.message || error);
        return NextResponse.json({
            error: "Nepodařilo se vygenerovat itinerář.",
            details: error?.message
        }, { status: 500 });
    }
}
