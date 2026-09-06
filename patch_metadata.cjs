const fs = require('fs');
let metadata = JSON.parse(fs.readFileSync('metadata.json', 'utf8'));
metadata.name = "Calm Motion";
metadata.description = "Приложение для самостоятельной эмоциональной саморегуляции и снижения текущего уровня тревоги.";
fs.writeFileSync('metadata.json', JSON.stringify(metadata, null, 2));
console.log("Patched metadata.json");
