import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const prompt = `
        You are an expert travel assistant. Your job is to extract search filters from a user's natural language query.
        
        User Query: "${query}"
        
        Extract the following fields into a strict JSON object:
        - destination: string (specific city or country, or null if vague like "sea")
        - tags: string[] (keywords like "sea", "mountains", "wellness", "kids", "all inclusive", "luxury", "cheap")
        - minPrice: number | null
        - maxPrice: number | null
        - minRating: number | null (default null, if user mentions "good hotel" imply 8+, "luxury" imply 9+)
        - dateRange: { start: string, end: string } | null (Calculate dates relative to today: ${new Date().toISOString().split('T')[0]}. If user says "next week", calculate it.)
        - passengers: number | null (default null, infer from "with 2 kids" -> 3 or 4)
        
        Output ONLY the JSON object. No markdown, no apologies.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // Clean up markdown code blocks if present
        const cleanJson = responseText.replace(/```json|```/g, "").trim();

        const filters = JSON.parse(cleanJson);

        return NextResponse.json({ filters });

    } catch (error: any) {
        console.error("AI Search Error:", error);
        return NextResponse.json({ error: "Failed to parse query" }, { status: 500 });
    }
}
