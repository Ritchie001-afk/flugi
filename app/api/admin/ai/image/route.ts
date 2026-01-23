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

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
        }

        // 1. Try Gemini 2.5 Flash Image (Nano Banana) as requested
        try {
            console.log("Attempting Gemini 2.5 Flash Image (Nano Banana)...");
            const prompt = `Hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting, photorealistic, professional photography, national geographic style`;

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
                // Check candidates for inline_data (image)
                const part = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inline_data || p.inlineData);

                if (part) {
                    const base64Image = part.inline_data?.data || part.inlineData?.data;
                    if (base64Image) {
                        const buffer = Buffer.from(base64Image, 'base64');
                        const upload = await uploadBufferToCloudinary(buffer, 'flugi_ai_gemini_flash');
                        if (upload.url) return NextResponse.json({ url: upload.url });
                        if (upload.error) throw new Error(upload.error);
                    }
                }
            } else {
                console.warn("Gemini 2.5 Flash Image API failed status:", response.status);
            }
        } catch (e) {
            console.error("Gemini 2.5 Flash Image Attempt failed:", e);
        }

        // 2. Fallback: Pollinations Flux
        try {
            console.log("Using Fallback: Pollinations Flux (API Route)");
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
