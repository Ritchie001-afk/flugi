const https = require('https');

https.get('https://www.flugi.cz/deal/auckland-z-viden-3ah1', (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        const matches = data.match(/<meta[^>]*property="og:image"[^>]*>/g);
        console.log("Found matches:", matches);
    });
});
