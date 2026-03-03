const fs = require('fs');
const html = fs.readFileSync('out2.html', 'utf-8');
const metas = html.match(/<meta[^>]*property="og:[^>]*>/g);
if (metas) {
    console.log(metas.join('\n'));
} else {
    console.log('No og meta found');
}
