const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

panel = panel.replace(/      \)\}\n\}\n    <\/div>\n  \);\n\};\n/, "      )}\n    </div>\n  );\n};\n");

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
