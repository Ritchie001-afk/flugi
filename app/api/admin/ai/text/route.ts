import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { type, destination } = await req.json();

        if (!destination) {
            return NextResponse.json({ error: "Missing destination" }, { status: 400 });
        }

        // Using verified model from search (gemini-3-flash-preview)
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        let prompt = "";
        if (type === 'description') {
            prompt = `Napiš lákavý marketingový popis pro dovolenou v destinaci "${destination}". 
            Délka cca 2-3 krátké odstavce (do 100 slov). 
            Zaměř se na pláže, moře, relax, jídlo nebo památky (podle destinace).
            Česky. Nepoužívej markdown nadpisy, jen čistý text.`;
        } else if (type === 'requirements') {
            prompt = `Jaké jsou aktuální vstupní podmínky a vízová povinnost pro občany ČR do destinace "${destination}"?
            Odpověz stručně (max 2 věty).
            Na konec PŘIDEJ oficiální odkaz na stránky Ministerstva zahraničních věcí ČR (mzv.cz) s informacemi pro tuto zemi/oblast.
            Pokud odkaz neznáš přesně, vygeneruj odkaz na vyhledávání na mzv.cz.
            Formát: "[Podmínky]. Více info: [URL]"`;
        } else {
            return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error("AI Text Gen Error:", error);
        return NextResponse.json({ error: `AI Error: ${error.message}` }, { status: 500 });
    }
}
