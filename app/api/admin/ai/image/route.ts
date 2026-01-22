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

        // 1. Try Gemini (via HTTP REST to use specific endpoint if needed, or via SDK if supported)
        // SDK 'gemini-3-flash-preview' might support visuals, but let's try the direct REST call 
        // that was in actions.ts, but updated for the new model.
        try {
            console.log("Attempting Gemini Image Gen (API Route)...");
            const prompt = `Hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting, photorealistic, professional photography`;

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

                // Try to find image data in response
                const base64Image = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inline_data || p.inlineData)?.inline_data?.data
                    || data.candidates?.[0]?.content?.parts?.find((p: any) => p.inline_data || p.inlineData)?.inlineData?.data;

                if (base64Image) {
                    const buffer = Buffer.from(base64Image, 'base64');
                    const upload = await uploadBufferToCloudinary(buffer, 'flugi_ai_gen'); // Using same helper logic
                    if (upload.url) return NextResponse.json({ url: upload.url });
                    if (upload.error) throw new Error(upload.error);
                }
            } else {
                console.warn("Gemini Image API failed status:", response.status);
            }
        } catch (e) {
            console.error("Gemini Image Attempt failed:", e);
        }

        // 2. Fallback: Pollinations Flux
        try {
            console.log("Using Fallback: Pollinations Flux (API Route)");
            const seed = Math.floor(Math.random() * 1000);
            const prompt = `hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting`;
            const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&n=${seed}`;

            const res = await fetch(fluxUrl);
            if (!res.ok) throw new Error(`Pollinations Flux failed with status: ${res.status}`);

            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const upload = await uploadBufferToCloudinary(buffer, 'flugi_ai_flux');

            if (upload.url) return NextResponse.json({ url: upload.url });
            return NextResponse.json({ error: upload.error || "Upload failed" }, { status: 500 });

        } catch (e: any) {
            console.error("Fallback Image Gen Error:", e);
            return NextResponse.json({ error: `Image Gen Failed: ${e.message}` }, { status: 500 });
        }

    } catch (error: any) {
        console.error("AI Image Gen Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
