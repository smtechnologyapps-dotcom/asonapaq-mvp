const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

panel = panel.replace(/import \{ AsonapaqLogo \} from '\.\.\/AsonapaqLogo';/, "import { AsonapaqLogo } from '../AsonapaqLogo';\nimport { User, Heart } from 'lucide-react';");

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
