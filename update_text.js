import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Course.tsx', 'utf-8');

const oldText = 'const displayDesc = viewingDay === 1 ? "Сегодня мы попробуем простой способ немного снизить телесное возбуждение. Это займёт всего пару минут." :';
const newText = 'const displayDesc = viewingDay === 1 ? <React.Fragment>Сегодня мы знакомимся с базовым упражнением и попробуем простой способ немного снизить телесное возбуждение.<br/>Это займёт всего три минуты.</React.Fragment> :';

content = content.replace(oldText, newText);

fs.writeFileSync('src/screens/Course.tsx', content);
