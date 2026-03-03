const https = require('https');

const options = {
    hostname: 'www.flugi.cz',
    port: 443,
    path: '/deal/auckland-z-viden-3ah1',
    method: 'GET',
    headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
    }
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (d) => {
        data += d;
    });
    res.on('end', () => {
        const matches = data.match(/<meta[^>]*property="og:[^>]*>/g);
        console.log(matches ? matches.join('\n') : 'NO OG TAGS');
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.end();
