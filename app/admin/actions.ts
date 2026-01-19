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
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `Napiš lákavý marketingový popis pro dovolenou v destinaci "${destination}". 
        Délka cca 2-3 krátké odstavce (do 100 slov). 
        Zaměř se na pláže, moře, relax, jídlo nebo památky (podle destinace).
        Česky. Nepoužívej markdown nadpisy, jen čistý text.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        return { text };
    } catch (e: any) {
        console.error("Gemini Error:", e);
        return { error: `Chyba AI: ${e.message || 'Neznámá chyba'}` };
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
        console.error("Gemini Error:", e);
        return { error: `Chyba AI: ${e.message || 'Neznámá chyba'}` };
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

    if (!title || !price || !destination || !url) {
        return { error: 'Chybí povinná pole (Název, Cena, Destinace, URL)' };
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
    if (!images.includes(image)) {
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
                reviewCount,
                reviewSource,
                reviewUrl,
                expiresAt: null
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

    // Simplification: We will just grab all fields safely
    const data: any = {
        title, price, destination, image, url, type, description,
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
    };

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
        revalidatePath('/admin');
        revalidatePath('/zajezdy');
        revalidatePath('/deals');
    } catch (e) {
        console.error(e);
    }
}
