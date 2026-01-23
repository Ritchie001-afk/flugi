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

        // 1. Try Google Imagen (User requested "gemini-2.5-flash-image", likely meaning the latest Imagen capability)
        // We will try to target the Imagen 3 endpoint which provides high quality images.
        try {
            console.log("Attempting Google Imagen 3 (User requested model)...");
            const prompt = `Hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting, photorealistic, professional photography, national geographic style`;

            // Using the REST API for Imagen 3
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${process.env.GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        instances: [{ prompt: prompt }],
                        parameters: {
                            sampleCount: 1,
                            aspectRatio: "16:9"
                        }
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                // Imagen 3 response structure can vary, checking common paths
                const base64Image = data.predictions?.[0]?.bytesBase64Encoded || data.predictions?.[0]?.bytes;

                if (base64Image) {
                    const buffer = Buffer.from(base64Image, 'base64');
                    const upload = await uploadBufferToCloudinary(buffer, 'flugi_ai_imagen');
                    if (upload.url) return NextResponse.json({ url: upload.url });
                    if (upload.error) throw new Error(upload.error);
                }
            } else {
                console.warn("Google Imagen API failed status:", response.status);
            }
        } catch (e) {
            console.error("Google Imagen Attempt failed:", e);
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
