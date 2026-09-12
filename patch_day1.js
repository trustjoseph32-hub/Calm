import fs from 'node:fs';

let content = fs.readFileSync('src/screens/Day1Engine.tsx', 'utf-8');

// add useLocation to import
content = content.replace("import { useNavigate } from 'react-router-dom';", "import { useNavigate, useLocation } from 'react-router-dom';");

// update initialization
const stateRegex = /const \[step, setStep\] = useState<Step>\('intro'\);/;
const replacement = `
  const location = useLocation();
  const anxietyBefore = location.state?.anxietyBefore;
  
  const [step, setStep] = useState<Step>(anxietyBefore !== undefined ? 'stage-intro' : 'intro');
  const [practiceStage, setPracticeStage] = useState(1);
  const [preAnxiety, setPreAnxiety] = useState<number>(anxietyBefore ?? 5);
`;

content = content.replace(stateRegex, replacement);
// We also need to remove the duplicate `practiceStage` and `preAnxiety`
content = content.replace("  const [practiceStage, setPracticeStage] = useState(1);", "");
content = content.replace("  const [preAnxiety, setPreAnxiety] = useState<number>(5);", "");

fs.writeFileSync('src/screens/Day1Engine.tsx', content);
