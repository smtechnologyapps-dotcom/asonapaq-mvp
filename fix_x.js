const fs = require('fs');
const file = 'components/views/PanelAdministracionView.tsx';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(
  "HeartHandshake\n} from 'lucide-react';",
  "HeartHandshake,\n  X\n} from 'lucide-react';"
);
fs.writeFileSync(file, text, 'utf8');
console.log('Added X import');
