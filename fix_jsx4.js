const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

// The error is at line 535: }
panel = panel.replace(/      \)\}\n\}\n    <\/div>/g, "      )}\n    </div>");

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
