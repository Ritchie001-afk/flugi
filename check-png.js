const fs = require('fs');

const urlParams = 'title=Z+Bratislavy+na+Zanzibar+All+Inclusive&price=21990&destination=Zanzibar&image=https%3A%2F%2Fres.cloudinary.com%2Fdlglfneoh%2Fimage%2Fupload%2Fv1773317526%2Fflugi_ai_gemini_flash%2Fxzsx2lrum8dnymnv90s8.jpg&date=15.3.+%E2%80%93+23.3.+2026&type=package&board=All+inclusive';

async function test() {
    console.log("Fetching: https://www.flugi.cz/api/og.png?" + urlParams);
    const start = Date.now();
    const res = await fetch('https://www.flugi.cz/api/og.png?' + urlParams);
    console.log("Status:", res.status);
    console.log("Headers:", res.headers);
    console.log("Time taken:", Date.now() - start, "ms");
    
    if (!res.ok) {
        console.log("Error body:", await res.text());
        return;
    }
    
    const buffer = await res.arrayBuffer();
    console.log("Buffer length:", buffer.byteLength);
    fs.writeFileSync('test-corrupted.png', Buffer.from(buffer));
    console.log("Saved to test-corrupted.png. File size on disk:", fs.statSync('test-corrupted.png').size);
    
    // Check first few bytes for PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const buf = Buffer.from(buffer);
    const hex = buf.subarray(0, 8).toString('hex');
    console.log("Signature (hex):", hex);
    if (hex.toUpperCase() === '89504E470D0A1A0A') {
        console.log("Valid PNG Signature!");
    } else {
        console.log("INVALID PNG SIGNATURE!");
    }
}
test();
