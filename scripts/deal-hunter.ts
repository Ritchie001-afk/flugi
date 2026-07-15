import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { scrapePelikanFlights } from '../src/lib/scrapers.bak/pelikan';
import cloudinary from '../src/lib/cloudinary';
import { getAffiliateFlightUrl } from '../src/lib/affiliates';

dotenv.config();

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper to generate destination photos using Gemini
async function generateDestinationImage(destination: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return 'https://placehold.co/1200x600/e2e8f0/475569.png?text=Gemini+API+Key+Missing';
    }

    try {
        console.log(`[AI Image] Generating photography for: ${destination}`);
        const prompt = `Hyper-realistic professional travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting, photorealistic, national geographic style. No text, no people.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                }),
            }
        );

        if (!response.ok) {
            console.error(`[AI Image] Gemini API error: ${response.status}`);
            return 'https://placehold.co/1200x600/e2e8f0/475569.png?text=Gemini+Image+Error';
        }

        const data = await response.json();
        const base64Image = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Image) {
            const buffer = Buffer.from(base64Image, 'base64');
            return await new Promise<string>((resolve) => {
                cloudinary.uploader.upload_stream(
                    { resource_type: 'image', folder: 'flugi_automated_deals' },
                    (error, result) => {
                        if (error || !result?.secure_url) {
                            console.error('[AI Image] Cloudinary upload error:', error);
                            resolve('https://placehold.co/1200x600/e2e8f0/475569.png?text=Cloudinary+Upload+Error');
                        } else {
                            console.log(`[AI Image] Uploaded to Cloudinary: ${result.secure_url}`);
                            resolve(result.secure_url);
                        }
                    }
                ).end(buffer);
            });
        }
    } catch (e) {
        console.error('[AI Image] Generation failed:', e);
    }

    return 'https://placehold.co/1200x600/e2e8f0/475569.png?text=Generation+Failed';
}

// Process a raw scraped deal through Gemini to enrich it
async function enrichDealWithAI(dealTitle: string, destination: string, type: 'flight' | 'package') {
    try {
        console.log(`[AI Text] Enriching deal: "${dealTitle}" for destination: ${destination}`);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `
            Jsi expert na vyhledávání akčních zájezdů a letenek pro cestovatelský portál Flugi.cz.
            Máme následující surovou nabídku:
            Název: ${dealTitle}
            Destinace: ${destination}
            Typ: ${type === 'flight' ? 'Letenka' : 'Zájezd / Dovolená'}

            Tvým úkolem je napsat poutavý a atraktivní cestopis o této destinaci (2-3 odstavce v češtině).
            Zaměř se na:
            - Památky, pláže, atmosféru, místní kulturu a jídlo.
            - Proč se vyplatí tam jet právě teď.
            - Napiš to přátelským a inspirativním tónem.

            STRÍKTNÍ PRAVIDLA:
            - STRIKTNÍ ZÁKAZ MARKDOWNU: V textu vůbec nepoužívej hvězdičky pro tučné písmo (**), podtržení ani odrážky! Vracej čistý text s odstavci.
            - Vytvoř také chytlavý titulek s emoji.

            Vrať výhradně platný JSON v tomto přesném formátu:
            {
                "title": "Chytlavý titulek s emoji",
                "description": "Zde bude poutavý cestopis bez jakéhokoliv markdownu."
            }
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().replace(/\ncopy\n\n\n\|\n/g, '').trim();
        return JSON.parse(responseText);
    } catch (e) {
        console.error('[AI Text] Enrichment failed:', e);
        return {
            title: `Akční ${type === 'flight' ? 'letenka' : 'zájezd'} do ${destination}! ✈️`,
            description: `Objevte krásy destinace ${destination} za skvělou akční cenu. Rezervujte co nejdříve, dokud jsou volné kapacity.`
        };
    }
}

// Process direct Google Flights raw text input
async function processRawGoogleFlights(text: string) {
    console.log("\n==========================================");
    console.log("✈️ RAW GOOGLE FLIGHTS IMPORT ACTIVATED");
    console.log("==========================================");

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `
          Jsi expert na letenky pro web Flugi.cz. Z níže uvedeného textu (raw scrap nebo volný popis z Google Flights) 
          vytáhni data. Z vlastních znalostí doplň reálné informace o počasí/klimatu a vstupních podmínkách do cílové destinace, a napiš poutavého průvodce.
          
          TEXT ZE STRÁNKY:
          ${text}
          
          PRAVIDLA:
          - Titulek musí být chytlavý (použij emoji).
          - STRIKTNÍ ZÁKAZ MARKDOWNU: V popisu (description) NEPOUŽÍVEJ formátování Markdown (absolutně žádné hvězdičky ** pro tučné písmo), vracej jen čistý text!
          - Z textu vyčti informace o letu: letecká společnost, odletové letiště (origin - např. "Praha (PRG)"), počet přestupů (číslo, 0=přímý), konkrétní data odletu a návratu.
          - ZAVAZADLO: Z textu vytáhni JEN rozměry a váhu základního zavazadla v ceně podle aerolinky (např. "40x30x20 cm, 8 kg").
          - POPIS (CESTOPIS): V poli description vůbec nepopisuj detaily letenky (zavazadla, aerolinky, přestupy). Místo toho napiš poutavého cestovatelského průvodce destinací (délka cca 2-3 kratší odstavce). Zmiň hlavní památky, co tam vidět, jaké aktivity se tam dají dělat a jakou to má atmosféru. Znovu opakuji: ZÁKAZ MARKDOWNU v tomto textu.
          - ODKAZ NA SKYSCANNER: Z cílové a výchozí destinace a termínů odvoď IATA kódy a přesná data letu, a sestav URL odkaz v přesně tomto formátu: "https://www.skyscanner.cz/transport/flights/[IATA_odletu]/[IATA_priletu]/[YYMMDD_tam]/[YYMMDD_zpet]/". Vlož jej do pole "link".
          - Cena musí být číslo v CZK (jen čisté číslo, např. 2400).
          - Časové údaje (startDate, endDate) vrať v platném formátu ISO 8601 (např. "2024-05-10T00:00:00Z"). Pokud z textu nejde vyčíst přesný formát, zkus ho odvodit, jinak použij null.
          
          VRAŤ POUZE ČISTÝ JSON V TOMTO FORMÁTU:
          {
            "title": "Titulek příspěvku s emoji",
            "price": 1234,
            "origin": "Praha (PRG)",
            "destination": "Město, Země",
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
        const responseText = result.response.text().replace(/\ncopy\n\n\n\|\n/g, '').trim();
        const flightData = JSON.parse(responseText);

        console.log(`[Raw Mode] Successfully parsed input! Destination: ${flightData.destination}`);

        const imageUrl = await generateDestinationImage(flightData.destination);
        const cleanDest = flightData.destination.split(',')[0].trim();
        
        const slug = cleanDest.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
            
        await prisma.deal.create({
            data: {
                title: flightData.title,
                slug: slug,
                description: flightData.description,
                price: parseInt(String(flightData.price).replace(/[^\d]/g, '')) || 0,
                currency: 'CZK',
                destination: flightData.destination,
                url: getAffiliateFlightUrl(flightData.link),
                image: imageUrl,
                type: 'flight',
                origin: flightData.origin || null,
                airline: flightData.airline || null,
                transferCount: flightData.transfers ?? 0,
                baggageInfo: flightData.baggage || null,
                entryRequirements: flightData.requirements || null,
                weatherInfo: flightData.weather || null,
                availableDates: flightData.dates || null,
                startDate: flightData.startDate ? new Date(flightData.startDate) : null,
                endDate: flightData.endDate ? new Date(flightData.endDate) : null,
                tags: ['Výhodná Letenka', 'Google Flights']
            }
        });

        console.log(`[Raw Mode] SUCCESS! Saved Google Flights deal: "${flightData.title}" to DB!`);

    } catch (e) {
        console.error("[Raw Mode] Failed to process raw text import:", e);
    } finally {
        await prisma.$disconnect();
    }
}

async function runHunter(maxPrice: number, destFilter: string | null, typeFilter: string | null) {
    console.log("==========================================");
    console.log("🚀 FLUGI DEAL HUNTER ACTIVATED");
    console.log(`🔧 Filtry: Max Cena: ${maxPrice} Kč, Destinace: ${destFilter || 'Všechny'}, Typ: ${typeFilter || 'Všechny'}`);
    console.log("==========================================");

    try {
        // --- 1. LETENKY (Pelikan.cz) ---
        if (!typeFilter || typeFilter === 'flight') {
            console.log("\n[Hunter] Scraping Pelikan Flights...");
            const rawFlights = await scrapePelikanFlights();
            console.log(`[Hunter] Found ${rawFlights.length} raw flights from Pelikan.`);

            let processedFlightsCount = 0;
            for (const flight of rawFlights) {
                // Check Max Price Filter
                if (flight.price > maxPrice) {
                    continue;
                }

                // Check Destination Filter
                if (destFilter && !flight.destination.toLowerCase().includes(destFilter.toLowerCase())) {
                    continue;
                }

                // Limit processing to 3 new flights per run to manage API tokens
                if (processedFlightsCount >= 3) break;

                const cleanDest = flight.destination.split(',')[0].trim();
                const existing = await prisma.deal.findFirst({
                    where: {
                        OR: [
                            { url: flight.url },
                            { destination: flight.destination, type: 'flight' }
                        ]
                    }
                });

                if (existing) {
                    console.log(`[Hunter] Flight to ${flight.destination} already exists in DB. Skipping.`);
                    continue;
                }

                console.log(`[Hunter] Found NEW matching flight: ${flight.destination} for ${flight.price} Kč!`);

                // AI Enrichment
                const enriched = await enrichDealWithAI(flight.title, flight.destination, 'flight');
                const imageUrl = await generateDestinationImage(flight.destination);

                // Generate slug
                const slug = cleanDest.toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
                    
                // Save to Database
                await prisma.deal.create({
                    data: {
                        title: enriched.title,
                        slug: slug,
                        description: enriched.description,
                        price: flight.price,
                        currency: 'CZK',
                        destination: flight.destination,
                        url: getAffiliateFlightUrl(flight.url),
                        image: imageUrl,
                        type: 'flight',
                        tags: ['Akční Letenka', 'Pelikan'],
                        airline: 'Letecká společnost',
                        transferCount: 0,
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    }
                });

                console.log(`[Hunter] Saved flight deal: "${enriched.title}" to DB!`);
                processedFlightsCount++;
            }
        }

        // --- 2. ZÁJEZDY (Invia - Fallback Seed) ---
        if (!typeFilter || typeFilter === 'package') {
            console.log("\n[Hunter] Checking Last Minute vacations...");
            const existingPackagesCount = await prisma.deal.count({ where: { type: 'package' } });
            
            if (existingPackagesCount === 0) {
                console.log("[Hunter] Injecting seed Last Minute vacation deals from Invia/Dovolená...");
                const samplePackages = [
                    {
                        title: "🌴 All Inclusive Řecko, Kréta za polovic!",
                        destination: "Kréta, Řecko",
                        price: 11990,
                        url: "https://www.invia.cz/last-minute/recko/kreta/",
                        hotel: "Hotel Blue Star 4*",
                        mealPlan: "All Inclusive"
                    },
                    {
                        title: "☀️ Slunné Španělsko, Mallorca z Prahy",
                        destination: "Mallorca, Španělsko",
                        price: 13490,
                        url: "https://www.invia.cz/last-minute/spanelsko/mallorca/",
                        hotel: "Sol Guadalupes 4*",
                        mealPlan: "Polopenze"
                    }
                ];

                for (const pkg of samplePackages) {
                    if (pkg.price > maxPrice) continue;
                    if (destFilter && !pkg.destination.toLowerCase().includes(destFilter.toLowerCase())) continue;

                    const enriched = await enrichDealWithAI(pkg.title, pkg.destination, 'package');
                    const imageUrl = await generateDestinationImage(pkg.destination);
                    const slug = pkg.destination.split(',')[0].toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);
                        
                    await prisma.deal.create({
                        data: {
                            title: enriched.title,
                            slug: slug,
                            description: enriched.description,
                            price: pkg.price,
                            currency: 'CZK',
                            destination: pkg.destination,
                            url: pkg.url,
                            image: imageUrl,
                            type: 'package',
                            tags: ['Last Minute', 'All Inclusive'],
                            hotel: pkg.hotel,
                            mealPlan: pkg.mealPlan,
                            startDate: new Date(),
                            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                        }
                    });
                    console.log(`[Hunter] Saved package deal: "${enriched.title}" to DB!`);
                }
            }
        }

    } catch (error) {
        console.error("[Hunter] Fatal error in Deal Hunter:", error);
    } finally {
        await prisma.$disconnect();
        console.log("\n==========================================");
        console.log("🏁 FLUGI DEAL HUNTER COMPLETED");
        console.log("==========================================");
    }
}

// MAIN ENTRY POINT
const args = process.argv.slice(2);
const rawIndex = args.indexOf('--raw');

if (rawIndex !== -1 && args[rawIndex + 1]) {
    // RUN IN GOOGLE FLIGHTS IMPORT MODE
    const textInput = args[rawIndex + 1];
    processRawGoogleFlights(textInput);
} else {
    // RUN IN AUTOMATIC CRAWLING MODE
    const maxPriceIndex = args.indexOf('--max-price');
    const destFilterIndex = args.indexOf('--dest');
    const typeFilterIndex = args.indexOf('--type');

    const maxPrice = maxPriceIndex !== -1 && args[maxPriceIndex + 1] ? parseInt(args[maxPriceIndex + 1]) : 8000;
    const destFilter = destFilterIndex !== -1 && args[destFilterIndex + 1] ? args[destFilterIndex + 1] : null;
    const typeFilter = typeFilterIndex !== -1 && args[typeFilterIndex + 1] ? args[typeFilterIndex + 1] : null;

    runHunter(maxPrice, destFilter, typeFilter);
}
