
const fs = require('fs');
// Password: n&A&,5&mRnPWu7p
// Encoding: n%26A%26%2C5%26mRnPWu7p
const password = encodeURIComponent('n&A&,5&mRnPWu7p');
const url = `postgresql://postgres:${password}@db.icnnsenwryzqdzelpedf.supabase.co:5432/postgres`;
const content = `DATABASE_URL="${url}"\n`;

fs.writeFileSync('.env', content);
fs.writeFileSync('.env.local', content);
console.log('Env files created with URL:', url.replace(password, '***'));
