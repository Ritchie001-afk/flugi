
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from 'dotenv';
dotenv.config();

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log("Testing with Key:", key ? key.substring(0, 5) + "..." : "MISSING");

    if (!key) {
        console.error("No API Key found in .env");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        console.log("Sending prompt...");
        const result = await model.generateContent("Napiš jednu větu o Praze.");
        const response = await result.response;
        const text = response.text();

        console.log("Success! Response:");
        console.log(text);
    } catch (e) {
        console.error("Gemini Error:", e);
    }
}

testGemini();
