const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

panel = panel.replace(/\}\r?\n    <\/div>/, "    </div>");

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
