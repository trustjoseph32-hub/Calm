const fs = require('fs');
let code = fs.readFileSync('src/screens/Settings.tsx', 'utf8');
code = code.replace(
  /<div className="flex justify-between items-center">\s*<span className="text-neutral-800">Вдох \(секунды\)<\/span>\s*<select\s*value=\{settings\.breathingIn\}\s*onChange=\{\(e\) => updateSettings\(\{ breathingIn: Number\(e\.target\.value\) \}\)\}\s*className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-400"\s*>\s*\{\[3, 4, 5, 6\]\.map\(n => <option key=\{n\} value=\{n\}>\{n\} с<\/option>\)\}\s*<\/select>\s*<\/div>\s*<div className="flex justify-between items-center">\s*<span className="text-neutral-800">Выдох \(секунды\)<\/span>\s*<select\s*value=\{settings\.breathingOut\}\s*onChange=\{\(e\) => updateSettings\(\{ breathingOut: Number\(e\.target\.value\) \}\)\}\s*className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-400"\s*>\s*\{\[4, 5, 6, 7, 8\]\.map\(n => <option key=\{n\} value=\{n\}>\{n\} с<\/option>\)\}\s*<\/select>\s*<\/div>/,
  `<div className="flex justify-between items-center">
            <span className="text-neutral-800">Вдох и выдох (секунды)</span>
            <select 
              value={settings.breathingIn}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateSettings({ breathingIn: val, breathingOut: val });
              }}
              className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-400"
            >
              {[3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} с</option>)}
            </select>
          </div>`
);
fs.writeFileSync('src/screens/Settings.tsx', code);
