const fs = require('fs');

try {
  const token = process.env.TOKEN || 'MISSING_TOKEN'; // Fallback if TOKEN isn't set
  let html = fs.readFileSync('index.html', 'utf8');
  html = html.replace('{{BOT_TOKEN}}', token);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('Build complete, token injected.');
} catch (error) {
  console.error('Build failed, you dumb fuck:', error);
  process.exit(1); // Exit with error to fail the build if something goes wrong
}
