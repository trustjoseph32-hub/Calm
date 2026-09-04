const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace(/<link rel="icon" type="image\/svg\+xml" href="\/vite\.svg" \/>/, '<link rel="icon" type="image/svg+xml" href="/favicon.svg" />');
fs.writeFileSync('index.html', code);
