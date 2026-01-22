'use server';

import { createSession, deleteSession } from '@/lib/session';
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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

export async function login(formData: FormData) {
    const password = formData.get('password') as string;
    const correctPassword = process.env.ADMIN_PASSWORD || 'flugi123'; // Fallback for dev

    if (password !== correctPassword) {
        redirect('/admin/login?error=invalid');
    }

    await createSession();
    redirect('/admin');
}

export async function logout() {
    await deleteSession();
    redirect('/admin/login');
}

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
    // 1. Try Gemini (Imagen 3)
    if (process.env.GEMINI_API_KEY) {
        try {
            const prompt = `Hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting, photorealistic, professional photography`;

            // Try specific model gemini-2.5-flash-image as requested
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
        } catch (e) {
            console.error("Gemini AI Image Gen Error:", e);
            // Fallthrough to fallback
        }
    }

    // 2. Fallback: Flux via Pollinations (High Quality)
    try {
        console.log("Using Fallback: Pollinations Flux");
        const seed = Math.floor(Math.random() * 1000);
        const prompt = `hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting`;
        const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&n=${seed}`;

        // Fetch the image to upload it to our storage
        const res = await fetch(fluxUrl);
        if (!res.ok) throw new Error('Pollinations Flux failed');

        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return await uploadBufferToCloudinary(buffer, 'flugi_ai_flux');

    } catch (e: any) {
        console.error("Fallback AI Error:", e);
        return { error: `Chyba při generování (AI i Fallback): ${e.message}` };
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

// --- Deal Actions ---

export async function createDeal(formData: FormData) {
    const title = formData.get('title') as string;
    const priceVal = parseFloat(formData.get('price') as string);
    const price = isNaN(priceVal) ? 0 : priceVal;

    const opStr = formData.get('originalPrice') as string;
    const opVal = parseFloat(opStr);
    const originalPrice = (opStr && !isNaN(opVal)) ? opVal : null;

    const tcStr = formData.get('transferCount') as string;
    const tcVal = parseInt(tcStr);
    const transferCount = (tcStr && !isNaN(tcVal)) ? tcVal : null;

    const baggageInfo = formData.get('baggageInfo') as string;
    const entryRequirements = formData.get('entryRequirements') as string;
    const airline = formData.get('airline') as string;
    const tagsStr = formData.get('tags') as string; // "Tag1, Tag2"

    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;

    const destination = formData.get('destination') as string;
    const image = formData.get('image') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;

    // Fixed: Added image validation
    if (!title || !price || !destination || !url || !image) {
        return { error: 'Chybí povinná pole (Název, Cena, Destinace, URL, Obrázek)' };
    }

    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];

    // Parse images array
    const imagesStr = formData.get('images') as string;
    let images: string[] = [];
    try {
        images = imagesStr ? JSON.parse(imagesStr) : [];
    } catch (e) {
        images = [];
    }
    // Ensure main image is in the list if not already
    if (image && !images.includes(image)) {
        images.unshift(image);
    }

    // Parse reviews
    const rStr = formData.get('rating') as string;
    const rVal = parseFloat(rStr);
    const rating = (rStr && !isNaN(rVal)) ? rVal : null;

    const rcStr = formData.get('reviewCount') as string;
    const rcVal = parseInt(rcStr);
    const reviewCount = (rcStr && !isNaN(rcVal)) ? rcVal : null;

    const reviewSource = formData.get('reviewSource') as string;
    const reviewUrl = formData.get('reviewUrl') as string;

    // Create slug from title
    const slug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-') + '-' + Math.random().toString(36).substring(7);

    try {
        await prisma.deal.create({
            data: {
                title,
                description: "Manuálně přidáno",
                price,
                originalPrice,
                transferCount,
                baggageInfo,
                entryRequirements,
                airline,
                currency: 'CZK',
                destination,
                image,
                images,
                url,
                type,
                slug,
                tags,
                rating,
                reviewSource,
                reviewUrl,
                expiresAt: null,
                startDate,
                endDate
            }
        });
        revalidatePath('/zajezdy');
        revalidatePath('/deals');
        revalidatePath('/admin');
    } catch (e: any) {
        console.error("Create Deal Error:", e);
        return { error: `Chyba při ukládání: ${e.message}` };
    }

    // Only redirect if successful (code execution reaches here only if no error thrown/returned in catch)
    redirect('/admin');
}

export async function updateDeal(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const priceVal = parseFloat(formData.get('price') as string);
    const price = isNaN(priceVal) ? 0 : priceVal;

    const opStr = formData.get('originalPrice') as string;
    const opVal = parseFloat(opStr);
    const originalPrice = (opStr && !isNaN(opVal)) ? opVal : null;

    const tcStr = formData.get('transferCount') as string;
    const tcVal = parseInt(tcStr);
    const transferCount = (tcStr && !isNaN(tcVal)) ? tcVal : null;

    const rStr = formData.get('rating') as string;
    const rVal = parseFloat(rStr);
    const rating = (rStr && !isNaN(rVal)) ? rVal : null;

    const rcStr = formData.get('reviewCount') as string;
    const rcVal = parseInt(rcStr);
    const reviewCount = (rcStr && !isNaN(rcVal)) ? rcVal : null;

    const destination = formData.get('destination') as string;
    const image = formData.get('image') as string;
    const url = formData.get('url') as string;
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;

    const startDateStr = formData.get('startDate') as string;
    const endDateStr = formData.get('endDate') as string;
    const startDate = startDateStr ? new Date(startDateStr) : null;
    const endDate = endDateStr ? new Date(endDateStr) : null;

    // Fixed: Construct data object safely to avoid null on required fields
    const data: any = {
        title,
        price,
        destination,
        url,
        type,
        description,
        originalPrice,
        transferCount,
        baggageInfo: formData.get('baggageInfo') as string,
        airline: formData.get('airline') as string,
        entryRequirements: formData.get('entryRequirements') as string,
        rating,
        reviewCount,
        reviewSource: formData.get('reviewSource') as string,
        reviewUrl: formData.get('reviewUrl') as string,
        tags: (formData.get('tags') as string)?.split(',').map(t => t.trim()).filter(Boolean) || [],
        startDate,
        endDate
    };

    // Only update image if it's provided (not null/empty)
    if (image) {
        data.image = image;
    }

    // Images parsing
    try {
        const imagesStr = formData.get('images') as string;
        data.images = imagesStr ? JSON.parse(imagesStr) : [];
        if (image && !data.images.includes(image)) data.images.unshift(image);
    } catch (e) {
        data.images = [];
    }

    try {
        await prisma.deal.update({
            where: { id },
            data
        });
        revalidatePath('/admin');
        revalidatePath('/zajezdy');
        revalidatePath('/deals');
        revalidatePath('/');
    } catch (e: any) {
        console.error("Update Error:", e);
        return { error: `Chyba při úpravě: ${e.message}` };
    }
    redirect('/admin');
}


export async function deleteDeal(id: string) {
    try {
        await prisma.deal.delete({ where: { id } });
        try {
            revalidatePath('/admin');
            revalidatePath('/zajezdy');
            revalidatePath('/deals');
        } catch (revalError) {
            console.error("Revalidation Error during deleteDeal:", revalError);
            // Continue execution as deletion was successful
        }
        return { success: true };
    } catch (e: any) {
        console.error("Delete Deal Error (Full):", JSON.stringify(e, Object.getOwnPropertyNames(e)));
        return { error: `Chyba při mazání: ${e.message || 'Neznámá chyba serveru'}` };
    }
}
