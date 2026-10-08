const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

panel = panel.replace(/import \{ X, User, Heart \} from 'lucide-react';\n'use client';\n/, "'use client';\nimport { X, User, Heart } from 'lucide-react';\n");

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
