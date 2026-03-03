const fs = require('fs');
const https = require('https');

https.get('https://www.flugi.cz/api/og?title=Z+Bratislavy+do+Muscat+%28Om%C3%A1n%29&price=4117&destination=Mascat%2C+Om%C3%A1n&date=12.4.+%E2%80%93+24.4.+2026&airline=Pegasus', (res) => {
    console.log(res.statusCode, res.headers['content-type']);
    let data = [];
    res.on('data', (chunk) => {
        data.push(chunk);
    });
    res.on('end', () => {
        const buf = Buffer.concat(data);
        console.log('Length:', buf.length);
        if (res.statusCode !== 200) {
            console.log('Error content:', buf.toString('utf-8'));
        }
    });
});
