import cloudinary from '@/lib/cloudinary';

/**
 * We call the actual live Edge API endpoint from Vercel to generate the image using Satori.
 * This completely avoids Node.js buffer translation corruption issues that Facebook scraper encounters.
 */
export async function generateAndUploadOgImage(deal: any): Promise<string | null> {
    try {
        console.log(`[OG Gen] Starting Edge Relay OG Image generation for: ${deal.title}`);

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.flugi.cz';

        let image = deal.image || (deal.images && deal.images[0]);
        if (image && image.startsWith('/')) {
            image = `${baseUrl}${image}`;
        }
        if (image && image.startsWith('data:image')) {
            console.log(`[OG Gen] Found base64 image, stripping to avoid 414 URI Too Long.`);
            image = null; // Don't send massive strings in GET requests
        }
        if (!image) {
            image = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2400&auto=format&fit=crop';
        }

        const title = deal.title || 'Akční Letenka';
        const priceStr = deal.price ? deal.price.toString() : '';
        const destination = deal.destination || 'Neznámá destinace';

        let date = 'Termín na vyžádání';
        if (deal.startDate && deal.endDate) {
            const start = new Date(deal.startDate);
            const end = new Date(deal.endDate);
            const fmt = (d: Date) => `${d.getDate()}.${d.getMonth() + 1}.`;
            date = `${fmt(start)} – ${fmt(end)} ${end.getFullYear()}`;
        } else if (deal.availableDates) {
            date = deal.availableDates.split('\n')[0].substring(0, 30);
        }

        const airline = deal.airline || 'Letecky';
        const origin = deal.origin || 'Vídeň / Praha';

        const urlParams = new URLSearchParams();
        urlParams.set('title', title);
        urlParams.set('price', priceStr);
        urlParams.set('destination', destination);
        urlParams.set('image', image);
        urlParams.set('date', date);
        urlParams.set('airline', airline);
        urlParams.set('origin', origin);

        const satoriUrl = `${baseUrl}/api/og.png?${urlParams.toString()}`;
        console.log(`[OG Gen] Fetching Satori Image from: ${satoriUrl}`);

        const response = await fetch(satoriUrl);

        if (!response.ok) {
            console.error("[OG Gen] Edge route failed", response.status);
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        console.log(`[OG Gen] Image fetched from Edge successfully. Buffer size: ${buffer.length}. Uploading to Cloudinary...`);

        const result: any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'flugi_og_cache', resource_type: 'image' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        console.log(`[OG Gen] Upload successful: ${result.secure_url}`);
        return result.secure_url;
    } catch (e: any) {
        console.error(`[OG Gen] Failed:`, e);
        return null;
    }
}
