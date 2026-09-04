const fs = require('fs');
let code = fs.readFileSync('src/screens/Home.tsx', 'utf8');

code = code.replace(
  "import { Wind, ScanEye, Calendar, Settings, Activity, BookOpen, Zap } from 'lucide-react';",
  "import { Wind, ScanEye, Calendar, Settings, Activity, BookOpen, Zap, Pill } from 'lucide-react';"
);

code = code.replace(
  "<Calendar className=\"w-8 h-8 fill-current\" strokeWidth={1.5} />",
  "<Pill className=\"w-8 h-8 fill-indigo-200/20\" strokeWidth={1.5} />"
);

fs.writeFileSync('src/screens/Home.tsx', code);
console.log("Patched!");
