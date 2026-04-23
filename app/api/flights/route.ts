import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { raw_text, url } = body;
    
    // 1. Jednoduchá ochrana - kontrola tokenu
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.FLUGI_SECRET_TOKEN}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!raw_text) {
      return NextResponse.json({ error: 'Missing raw_text' }, { status: 400 });
    }

    // 2. Inicializace Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 3. Prompt pro zpracování textu
    const prompt = `
      Jsi expert na letenky pro web Flugi.cz. Z níže uvedeného textu (raw scrap z Google Flights) 
      vytáhni data. Z vlastních znalostí doplň reálné informace o počasí/klimatu a vstupních podmínkách do cílové destinace, a napiš poutavého průvodce.
      
      TEXT ZE STRÁNKY:
      ${raw_text}
      
      URL ADRESA:
      ${url}

      PRAVIDLA:
      - Titulek musí být chytlavý (použij emoji).
      - STRIKTNÍ ZÁKAZ MARKDOWNU: V popisu (description) NEPOUŽÍVEJ formátování Markdown (absolutně žádné hvězdičky ** pro tučné písmo), vracej jen čistý text!
      - Z textu vyčti informace o letu: letecká společnost, počet přestupů (číslo, 0=přímý), konkrétní data odletu a návratu.
      - ZAVAZADLO: Z textu vytáhni JEN rozměry a váhu základního zavazadla v ceně podle aerolinky (např. "40x30x20 cm, 8 kg").
      - POPIS (CESTOPIS): V poli description vůbec nepopisuj detaily letenky (zavazadla, aerolinky, přestupy). Místo toho napiš poutavého cestovatelského průvodce destinací (délka cca 2-3 kratší odstavce). Zmiň hlavní památky, co tam vidět, jaké aktivity se tam dají dělat a jakou to má atmosféru. Znovu opakuji: ZÁKAZ MARKDOWNU v tomto textu.
      - ODKAZ NA SKYSCANNER: Z cílové a výchozí destinace a termínů odvoď IATA kódy a přesná data letu, a sestav URL odkaz v přesně tomto formátu: "https://www.skyscanner.cz/transport/flights/[IATA_odletu]/[IATA_priletu]/[YYMMDD_tam]/[YYMMDD_zpet]/". Vlož jej do pole "link".
      - Cena musí být v CZK.
      - Časové údaje (startDate, endDate) vrať v platném formátu ISO 8601 (např. "2024-05-10T00:00:00Z"). Pokud z textu nejde vyčíst přesný formát, zkus ho odvodit, jinak použij null.
      - Vždy a bezpodmínečně vygeneruj JSON, který bude obsahovat úplně všechny níže definované klíče. Nesmí nic vynechat! Pokud hodnotu neznáš, odhadni ji nebo vrať nullovou hodnotu, ale klíče zachovej v JSONu za každou cenu.
      
      VRAŤ POUZE ČISTÝ JSON (nic jiného!) V TOMTO FORMÁTU (dodrž typy dat - čísla jako čísla, řetězce jako řetězce):
      {
        "title": "Titulek příspěvku",
        "price": "1234 Kč",
        "destination": "Město",
        "dates": "Krátce textově termín",
        "description": "Poutavý cestopis o destinaci. 2-3 odstavce. Čistý text BEZ markdownu.",
        "link": "https://www.skyscanner.cz/transport/flights/PRG/BCN/240510/240515/",
        "airline": "Název letecké společnosti",
        "transfers": 0,
        "baggage": "40x30x20 cm, 8 kg",
        "requirements": "Informace o vízech či pasech...",
        "weather": "Teploty a počasí v tomto termínu (vlastní znalost)...",
        "startDate": "2024-06-01T00:00:00.000Z",
        "endDate": "2024-06-10T00:00:00.000Z"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().replace(/```json|```/g, '').trim();
    
    const flightData = JSON.parse(text);

    // Vytvoření dynamického obrázku z názvu destinace
    const normalizedDest = flightData.destination ? flightData.destination.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase() : "travel";
    const dynamicImage = `https://loremflickr.com/1200/600/${normalizedDest},city,travel`;

    // 4. Uložení do DB do tabulky Deal
    const savedDeal = await prisma.deal.create({
      data: {
        title: flightData.title,
        slug: flightData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now(),
        description: flightData.description,
        price: parseInt(String(flightData.price).replace(/[^\d]/g, '')) || 0,
        currency: "CZK",
        destination: flightData.destination,
        url: flightData.link,
        image: dynamicImage,
        type: 'flight',
        airline: flightData.airline || null,
        transferCount: flightData.transfers ?? 0,
        baggageInfo: flightData.baggage || null,
        entryRequirements: flightData.requirements || null,
        weatherInfo: flightData.weather || null,
        availableDates: flightData.dates || null,
        startDate: flightData.startDate ? new Date(flightData.startDate) : null,
        endDate: flightData.endDate ? new Date(flightData.endDate) : null,
      }
    });

    console.log("Nová letenka připravena:", flightData);

    return NextResponse.json({ success: true, data: flightData });

  } catch (error) {
    console.error("Chyba API:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
