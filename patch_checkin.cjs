const fs = require('fs');
let code = fs.readFileSync('src/screens/Checkin.tsx', 'utf8');

code = code.replace(/useState\(5\)/g, 'useState<number | null>(null)');
code = code.replace(/<SliderField \n            icon={<ActivitySquare/g, '<SliderField \n            icon={<ActivitySquare');

// We need to modify SliderField to accept null
code = code.replace(/value: number;/g, 'value: number | null;');

// And in SliderField rendering
code = code.replace(/value={value}/g, 'value={value === null ? 5 : value}');
code = code.replace(/{value}/g, '{value === null ? "-" : value}');

// And in handleSubmit
const submitOld = `  const handleSubmit = () => {
    saveCheckin({
      date: new Date().toISOString(),
      anxiety,
      physical,
      emotional,
      thoughts,
    });`;

const submitNew = `  const handleSubmit = () => {
    saveCheckin({
      date: new Date().toISOString(),
      anxiety: anxiety ?? 5,
      physical: physical ?? 5,
      emotional: emotional ?? 5,
      thoughts: thoughts ?? 5,
    });`;

code = code.replace(submitOld, submitNew);

fs.writeFileSync('src/screens/Checkin.tsx', code);
console.log("Patched Checkin.tsx");
