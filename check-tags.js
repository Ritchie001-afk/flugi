const fs = require('fs');

async function checkTags() {
    const res = await fetch('https://www.flugi.cz/deal/hotel-waridi-beach-resort-and-spa-z-bratislava-dh2v');
    const html = await res.text();
    
    // Quick regex to find all meta property="og:..." tags
    const regex = /<meta property="([^"]+)" content="([^"]+)"[^>]*>/g;
    let match;
    console.log("--- OG Tags ---");
    while ((match = regex.exec(html)) !== null) {
        console.log(`${match[1]}: ${match[2]}`);
    }
}
checkTags();
