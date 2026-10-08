const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

// I replaced \)\s*:\s*\([\s\S]*?Volver a[\s\S]*?<\/button>\s*<\/div>\s*\)\} with replacementStr + "}"
// The replacementStr started with "activeTab === 'datos' ? ("

panel = panel.replace(/activeTab === 'datos' \? \(/, ") : activeTab === 'datos' ? (");

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
