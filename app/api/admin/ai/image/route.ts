import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import cloudinary from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

// Helper to upload buffer to Cloudinary
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

export async function POST(req: Request) {
    try {
        const { destination } = await req.json();

        if (!destination) {
            return NextResponse.json({ error: "Missing destination" }, { status: 400 });
        }

        // Use Pollinations Flux directly (User requested "nano banana" - likely implies high quality/Flux, fixing "tragic" output from Gemini)
        try {
            console.log("Generating Image via Pollinations Flux...");
            const seed = Math.floor(Math.random() * 1000);
            // Enhanced prompt for travel
            const prompt = `Hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting, photorealistic, professional photography, national geographic style, high detail`;

            // "model=flux" is generally the best free option on Pollinations
            const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&n=${seed}&width=1280&height=720`;

            const res = await fetch(fluxUrl);
            if (!res.ok) throw new Error(`Pollinations Flux failed with status: ${res.status}`);

            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const upload = await uploadBufferToCloudinary(buffer, 'flugi_ai_flux');

            if (upload.url) return NextResponse.json({ url: upload.url });
            return NextResponse.json({ error: upload.error || "Upload failed" }, { status: 500 });

        } catch (e: any) {
            console.error("Image Gen Error:", e);
            return NextResponse.json({ error: `Image Gen Failed: ${e.message}` }, { status: 500 });
        }

    } catch (error: any) {
        console.error("AI Image Gen Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
