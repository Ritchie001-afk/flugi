const https = require('https');

https.get('https://www.flugi.cz/deal/auckland-z-viden-3ah1', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        const matches = data.match(/<meta[^>]*property="og:image"[^>]*>/g);
        console.log(matches ? matches.join('\n') : 'NO OG IMAGE');
    });
});
