const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

// Ensure X, User, Heart are imported
if(!panel.includes('X,')) panel = panel.replace('import {', 'import { X, User, Heart,');

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
