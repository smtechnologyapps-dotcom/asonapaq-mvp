const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

// The import line likely looks like: import { X, User, Heart, ClipboardList... }
// Or there are multiple imports of X.
panel = panel.replace(/import \{ X, User, Heart,\s*/, 'import { ');

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
