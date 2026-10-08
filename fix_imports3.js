const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

// I will just add an entirely new import line for them to be safe
if (!panel.includes('import { X, User, Heart }')) {
    panel = "import { X, User, Heart } from 'lucide-react';\n" + panel;
}

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
