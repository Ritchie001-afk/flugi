const https = require('https');

const url = 'https://deo.invia.cz/deo/Importy/xml_export/katalog.xml';

console.log(`Fetching ${url}...`);

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
        // Stop after catching enough characters to see the structure
        if (data.length > 5000) {
            console.log('--- XML STRUCTURE START ---');
            console.log(data.substring(0, 5000));
            console.log('--- XML STRUCTURE END ---');
            process.exit(0);
        }
    });

    res.on('end', () => {
        console.log('Stream ended (file might be small).');
        console.log(data.substring(0, 5000));
    });

}).on('error', (err) => {
    console.error('Error fetching XML:', err.message);
});
