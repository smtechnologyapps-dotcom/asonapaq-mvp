const fs = require('fs');

const file = 'components/views/PortalVoluntarioView.tsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/Guíardia/g, 'Guardia');
text = text.replace(/Ã‚Â·/g, '·');

fs.writeFileSync(file, text, 'utf8');
