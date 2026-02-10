export { };

async function test() {
    try {
        console.log('Testing AI endpoint...');
        const res = await fetch('http://localhost:3000/api/admin/ai/text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'weather', destination: 'Tokyo' })
        });
        const data = await res.json();
        console.log('Status:', res.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Test failed:', e);
    }
}
test();
