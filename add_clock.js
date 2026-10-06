const fs = require('fs');
const file = 'components/Header.tsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  "import { AsonapaqLogo } from './AsonapaqLogo';",
  "import { AsonapaqLogo } from './AsonapaqLogo';\nimport { LiveClock } from './LiveClock';"
);

text = text.replace(
  '<a\n            href="tel:512-7000"',
  '<div className="hidden lg:block mr-2"><LiveClock /></div>\n          <a\n            href="tel:512-7000"'
);

fs.writeFileSync(file, text, 'utf8');
console.log('Added LiveClock to Header');
