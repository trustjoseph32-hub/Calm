const fs = require('fs');

function replaceInFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.split('syncBackgroundNoise').join('syncAmbientSound');
  fs.writeFileSync(file, content);
}

replaceInFile('src/screens/SynchronizedSetup.tsx');
replaceInFile('src/screens/SynchronizedEngine.tsx');

console.log("Replaced syncBackgroundNoise with syncAmbientSound");
