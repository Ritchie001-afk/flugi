const https = require('https');

const options = {
    hostname: 'www.flugi.cz',
    port: 443,
    path: '/deal/nairobi-z-praha-4vu5',
    method: 'GET',
    headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
    }
};

const req = https.request(options, (res) => {
    console.log('Crawler Status:', res.statusCode);
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => {
        const matches = data.match(/<meta[^>]*property="og:image[^>]*>/g);
        console.log(matches ? matches.join('\n') : 'NO OG IMAGE TAGS IN CRAWLER RESPONSE');
    });
});

req.on('error', console.error);
req.end();
