'use server';

// import { createSession, deleteSession } from '@/lib/session';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- Auth Actions ---

import { getDestinationImage } from '@/lib/images';

// --- AI Actions ---

export async function findImageAction(destination: string) {
    const url = getDestinationImage(destination, '');
    // If it returns empty string (meaning no match and no fallback provided), we return error or generic
    if (!url) return { error: 'Nenašel jsem obrázek pro tuto destinaci.' };
    return { url };
}

export async function generateDescriptionAction(destination: string) {
    if (!process.env.GEMINI_API_KEY) return { error: 'Chybí API klíč' };

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using gemini-3-flash-preview as requested by user (bleeding edge)
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `Napiš lákavý marketingový popis pro dovolenou v destinaci "${destination}". 
        Délka cca 2-3 krátké odstavce (do 100 slov). 
        Zaměř se na pláže, moře, relax, jídlo nebo památky (podle destinace).
        Česky. Nepoužívej markdown nadpisy, jen čistý text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return { text };
    } catch (e: any) {
        console.error("Gemini Details Generation Error:", JSON.stringify(e, Object.getOwnPropertyNames(e)));
        return { error: `Chyba AI (popis): ${e.message || 'Neznámá chyba'}` };
    }
}

export async function generateEntryRequirementsAction(destination: string) {
    if (!process.env.GEMINI_API_KEY) return { error: 'Chybí API klíč' };

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `Jaké jsou aktuální vstupní podmínky a vízová povinnost pro občany ČR do destinace "${destination}"?
        Odpověz stručně (max 2 věty).
        Na konec PŘIDEJ oficiální odkaz na stránky Ministerstva zahraničních věcí ČR (mzv.cz) s informacemi pro tuto zemi/oblast.
        Pokud odkaz neznáš přesně, vygeneruj odkaz na vyhledávání na mzv.cz.
        Formát: "[Podmínky]. Více info: [URL]"`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return { text };
    } catch (e: any) {
        console.error("Gemini Requirements Generation Error:", JSON.stringify(e, Object.getOwnPropertyNames(e)));
        return { error: `Chyba AI (požadavky): ${e.message || 'Neznámá chyba'}` };
    }
}

// --- Auth Actions (Moved to auth-actions.ts) ---

// --- Cloudinary Actions ---
import cloudinary from '@/lib/cloudinary';

export async function uploadImageAction(formData: FormData): Promise<{ url?: string; error?: string }> {
    const file = formData.get('file') as File;
    if (!file) return { error: 'Žádný soubor nebyl nahrán.' };

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise<{ url?: string; error?: string }>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'flugi_deals' },
                (error: any, result: any) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        resolve({ url: '', error: 'Chyba při nahrávání obrázku.' });
                    } else {
                        resolve({ url: result?.secure_url || '' });
                    }
                }
            ).end(buffer);
        });
    } catch (e) {
        console.error('Upload handler error:', e);
        return { error: 'Chyba při zpracování souboru.' };
    }
}

export async function generateImageWithGeminiAction(destination: string) {
    console.log(`generateImageWithGeminiAction called for: ${destination}`);

    // Runtime check
    if (typeof Buffer === 'undefined') {
        console.error("CRITICAL: Buffer is undefined in runtime environment!");
        return { error: 'Server Runtime Error: Buffer missing.' };
    }

    // 1. Try Gemini (Imagen 3)
    if (process.env.GEMINI_API_KEY) {
        try {
            console.log("Attempting Gemini Image Gen...");
            const prompt = `Hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting, photorealistic, professional photography`;

            // Try specific model gemini-2.0-flash-exp (or stable if listed) for images if supported, or back to standard generation
            // Note: generateContent for images usually requires specific vision models or imagen. 
            // Current codebase tries to use a generateContent endpoint for images which is ... unusual for standard Gemini unless using Imagen.
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: prompt }]
                        }]
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();

                // Detailed logging for debug
                // console.log("Gemini Image Response parts:", JSON.stringify(data.candidates?.[0]?.content?.parts));

                // Check multiple possible paths for image data in response
                const base64Image = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inline_data || p.inlineData)?.inline_data?.data
                    || data.candidates?.[0]?.content?.parts?.find((p: any) => p.inline_data || p.inlineData)?.inlineData?.data;

                if (base64Image) {
                    console.log("Gemini Image received, uploading...");
                    // Upload to Cloudinary
                    const buffer = Buffer.from(base64Image, 'base64');
                    return await uploadBufferToCloudinary(buffer, 'flugi_ai_gen');
                } else {
                    console.warn("Gemini Image Response was OK but contained no image data.");
                }
            } else {
                const errorText = await response.text();
                console.warn(`Gemini Image API Failed (${response.status}): ${errorText}. Falling back...`);
            }
        } catch (e: any) {
            console.error("Gemini AI Image Gen Error:", e);
            // Fallthrough to fallback
        }
    } else {
        console.warn("Skipping Gemini: No API Key");
    }

    // 2. Fallback: Flux via Pollinations (High Quality)
    try {
        console.log("Using Fallback: Pollinations Flux");
        const seed = Math.floor(Math.random() * 1000);
        const prompt = `hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting`;
        const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&n=${seed}`;

        // Fetch the image to upload it to our storage
        const res = await fetch(fluxUrl);
        if (!res.ok) throw new Error(`Pollinations Flux failed with status: ${res.status}`);

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return await uploadBufferToCloudinary(buffer, 'flugi_ai_flux');

    } catch (e: any) {
        console.error("Fallback AI Error (Flux):", e);
        return { error: `Chyba při generování (AI i Fallback selhal): ${e.message}` };
    }
}

// Helper to upload buffer to Cloudinary to avoid code duplication
async function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<{ url?: string; error?: string }> {
    return new Promise<{ url?: string; error?: string }>((resolve) => {
        cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: folder },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    resolve({ error: 'Chyba při ukládání obrázku.' });
                } else {
                    resolve({ url: result?.secure_url });
                }
            }
        ).end(buffer);
    });
}

// --- Deal Actions (Moved to deal-actions.ts) ---

// End of AI Actions
