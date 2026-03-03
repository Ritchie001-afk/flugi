const fs = require('fs');
const https = require('https');

https.get('https://www.flugi.cz/api/og?title=Z+V%C3%ADdn%C4%9B+do+Aucklandu+&price=16244&destination=Auckland&date=25.5.+%E2%80%93+8.6.+2026&airline=Turkish+airlines', (res) => {
    let data = [];
    res.on('data', (chunk) => {
        data.push(chunk);
    });
    res.on('end', () => {
        fs.writeFileSync('test_satori.png', Buffer.concat(data));
        console.log('Saved to test_satori.png, length:', Buffer.concat(data).length);
    });
});
