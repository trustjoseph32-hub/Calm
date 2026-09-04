const fs = require('fs');
let code = fs.readFileSync('src/screens/Course.tsx', 'utf8');

const focusTitles = {
  1: { title: 'Шкала тревоги', icon: 'Activity' },
  2: { title: 'Гудение', icon: 'Mic' },
  3: { title: 'Правило 3х3', icon: 'Eye' },
  4: { title: 'Массаж ушей', icon: 'Headphones' },
  5: { title: 'Якорь мысли', icon: 'Anchor' },
  6: { title: 'Метод Розенберга', icon: 'Smile' },
  7: { title: 'Стоп-слово', icon: 'Octagon' },
  8: { title: 'Рефлекс ныряльщика', icon: 'Droplets' },
  9: { title: 'Стимуляция гортани', icon: 'Coffee' },
  10: { title: 'SOS-аптечка', icon: 'BriefcaseMedical' },
  11: { title: 'Инфо-детокс', icon: 'SmartphoneOff' },
  12: { title: 'Пауза', icon: 'Pause' },
  13: { title: 'Мягкий живот', icon: 'Circle' },
  14: { title: 'Присвоение силы', icon: 'ShieldCheck' }
};

// Replace logic
code = code.replace(/\{\s*day:\s*(\d+),/g, (match, dayStr) => {
  const day = parseInt(dayStr);
  return '{ \n    day: ' + day + ',\n    focusTitle: "' + focusTitles[day].title + '",\n    focusIcon: "' + focusTitles[day].icon + '",';
});

// Need to import icons from lucide-react. Let's find the current import and add them.
const lucideImportsMatch = code.match(/import \{ ([^}]+) \} from 'lucide-react';/);
if (lucideImportsMatch) {
  const existingImports = lucideImportsMatch[1].split(',').map(s => s.trim());
  const neededImports = ['Activity', 'Mic', 'Eye', 'Headphones', 'Anchor', 'Smile', 'Octagon', 'Droplets', 'Coffee', 'BriefcaseMedical', 'SmartphoneOff', 'Pause', 'Circle', 'ShieldCheck', 'Search'];
  
  const allImports = Array.from(new Set([...existingImports, ...neededImports]));
  code = code.replace(lucideImportsMatch[0], 'import { ' + allImports.join(', ') + ' } from "lucide-react";');
}

fs.writeFileSync('src/screens/Course.tsx', code);
