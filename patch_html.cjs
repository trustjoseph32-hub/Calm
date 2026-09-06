const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('lang="en"', 'lang="ru"');
html = html.replace(/<title>.*?<\/title>/, '<title>Calm Motion</title>');
html = html.replace(/<meta name="description" content=".*?" \/>/, '<meta name="description" content="Приложение для саморегуляции и снижения тревоги с помощью дыхания и ритмичного движения." />');
html = html.replace(/<meta property="og:title" content=".*?" \/>/, '<meta property="og:title" content="Calm Motion" />');
html = html.replace(/<meta property="og:description" content=".*?" \/>/, '<meta property="og:description" content="Приложение для саморегуляции и снижения тревоги с помощью дыхания и ритмичного движения." />');

fs.writeFileSync('index.html', html);
console.log("Patched index.html");
