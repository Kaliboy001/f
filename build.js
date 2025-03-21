const fs = require('fs');

const token = process.env.TOKEN || 'MISSING_TOKEN'; // Fallback if TOKEN isn't set
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('{{BOT_TOKEN}}', token);
fs.writeFileSync('index.html', 'utf8');
console.log('Build complete, token injected.');
