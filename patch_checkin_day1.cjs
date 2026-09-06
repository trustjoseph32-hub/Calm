const fs = require('fs');
let code = fs.readFileSync('src/screens/Checkin.tsx', 'utf8');

const targetStr = `    // Actually, it's safer to just mark Day 1 completed if it's currently Day 1.
    if (courseProgress.currentDay === 1 && !courseProgress.completedDays.includes(1)) {
      markCourseDayCompleted(1);
    }`;

const replacement = `    // Actually, it's safer to just mark Day 1 completed if it's currently Day 1.
    // WAIT: Now we have a proper course structure for Day 1 where they have a session.
    // So we don't automatically mark it completed here.`;

code = code.replace(targetStr, replacement);
fs.writeFileSync('src/screens/Checkin.tsx', code);
console.log("Patched Checkin Day 1");
