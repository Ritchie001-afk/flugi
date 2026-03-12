const fs = require('fs');

async function test() {
    try {
        const urlParams = new URLSearchParams({
            title: 'Z BRATISLAVY NA ZANZIBAR ALL INCLUSIVE',
            price: '21990',
            destination: 'Zanzibar',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
            date: '15.3. - 23.3.2026',
            airline: 'Letecky',
            type: 'package',
            board: 'All Inclusive',
            origin: 'Bratislava'
        });

        // Let's test the live server
        const res = await fetch('https://www.flugi.cz/api/og.png?' + urlParams.toString());
        
        console.log("Status:", res.status);
        console.log("Headers:", res.headers);
        const buffer = await res.arrayBuffer();
        console.log("Buffer size:", buffer.byteLength);
        
        if (!res.ok) {
            const text = Buffer.from(buffer).toString();
            console.log("Error text:", text);
        } else {
            console.log("Success! Saved to test-og.png");
            fs.writeFileSync('test-og.png', Buffer.from(buffer));
        }
    } catch (e) {
        console.error("Fetch failed", e);
    }
}
test();
