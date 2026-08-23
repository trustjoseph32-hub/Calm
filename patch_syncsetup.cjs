const fs = require('fs');
let code = fs.readFileSync('src/screens/SynchronizedSetup.tsx', 'utf8');
code = code.replace(
  /<div className="flex justify-between items-center">\s*<span className="text-neutral-800">Вдох \(секунды\)<\/span>\s*<select \s*value=\{settings\.syncInhaleDuration\}\s*onChange=\{\(e\) => updateSettings\(\{ syncInhaleDuration: Number\(e\.target\.value\) \}\)\}\s*className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-400"\s*>\s*\{\[1\.5, 2, 2\.5, 3, 3\.5, 4, 4\.5, 5\]\.map\(n => <option key=\{n\} value=\{n\}>\{n\} с<\/option>\)\}\s*<\/select>\s*<\/div>\s*<div className="flex justify-between items-center">\s*<span className="text-neutral-800">Выдох \(секунды\)<\/span>\s*<select \s*value=\{settings\.syncExhaleDuration\}\s*onChange=\{\(e\) => updateSettings\(\{ syncExhaleDuration: Number\(e\.target\.value\) \}\)\}\s*className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-400"\s*>\s*\{\[1\.5, 2, 2\.5, 3, 3\.5, 4, 4\.5, 5, 5\.5, 6\]\.map\(n => <option key=\{n\} value=\{n\}>\{n\} с<\/option>\)\}\s*<\/select>\s*<\/div>/,
  `<div className="flex justify-between items-center">
            <span className="text-neutral-800">Вдох и выдох (секунды)</span>
            <select 
              value={settings.syncInhaleDuration}
              onChange={(e) => {
                const val = Number(e.target.value);
                updateSettings({ syncInhaleDuration: val, syncExhaleDuration: val });
              }}
              className="bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1 text-sm outline-none focus:border-neutral-400"
            >
              {[1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(n => <option key={n} value={n}>{n} с</option>)}
            </select>
          </div>`
);
fs.writeFileSync('src/screens/SynchronizedSetup.tsx', code);
