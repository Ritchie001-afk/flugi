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

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
        }

        try {
            console.log("Attempting Gemini 3 Pro Image Preview...");
            const prompt = `Hyper-realistic travel photography of ${destination}, stunning view, 4k, sunny weather, tourism, cinematic lighting, photorealistic, professional photography, national geographic style`;

            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`,
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
                // extraction
                const part = data.candidates?.[0]?.content?.parts?.[0];
                if (part && part.inlineData) {
                    const base64Image = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || 'image/jpeg';
                    return NextResponse.json({ url: `data:${mimeType};base64,${base64Image}` });
                }
                // If no inlineData, maybe it returned text? or different structure?
                console.log("Gemini Response Data:", JSON.stringify(data, null, 2));
                throw new Error("No image data in response");
            } else {
                const errorText = await response.text();
                console.error("Gemini API Error:", errorText);
                return NextResponse.json({ error: `Gemini API Error: ${response.status} - ${errorText}` }, { status: 500 });
            }

        } catch (e: any) {
            console.error("Gemini Image Gen Error:", e);
            return NextResponse.json({ error: `Image Gen Failed: ${e.message}` }, { status: 500 });
        }
    } catch (error: any) {
        console.error("AI Image Gen Route Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
