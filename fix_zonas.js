const fs = require('fs');
const files = ['lib/types.ts', 'lib/store.ts', 'components/views/PortalVoluntarioView.tsx', 'components/views/PanelAdministracionView.tsx'];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let text = fs.readFileSync(file, 'utf8');
    text = text.replace(/zonasHabilitad.as/g, 'zonasHabilitadas');
    fs.writeFileSync(file, text, 'utf8');
  }
});
console.log('Fixed zonasHabilitadas globally');
