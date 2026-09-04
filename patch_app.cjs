const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { Course } from './screens/Course';",
  "import { Course } from './screens/Course';\nimport { Checkin } from './screens/Checkin';"
);

code = code.replace(
  '<Route path="/course" element={<Course />} />',
  '<Route path="/course" element={<Course />} />\n          <Route path="/checkin" element={<Checkin />} />'
);

fs.writeFileSync('src/App.tsx', code);
