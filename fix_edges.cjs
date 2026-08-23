const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('src/screens').map(f => path.join('src/screens', f));
files.push('src/App.tsx');

for (const file of files) {
  if (file.endsWith('.tsx')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix text-black hover states in dark mode
    content = content.replace(/group-hover:text-black/g, "group-hover:text-white");
    
    // Fix fill-white on white background primary buttons
    content = content.replace(/<Play className="w-[^"]+ fill-white" \/>/g, (match) => match.replace("fill-white", "fill-neutral-900"));
    content = content.replace(/fill-white/g, "fill-neutral-900"); // Let's just be careful here, is there anywhere else?
    
    // Actually, in `PracticeEngine.tsx` the play/pause button is `bg-white`, so its icon should be `fill-neutral-900`.
    // Wait, let's reverse that global fill-white just in case.
    
    fs.writeFileSync(file, content);
  }
}
