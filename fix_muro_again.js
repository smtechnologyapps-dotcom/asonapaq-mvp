const fs = require('fs');
const file = 'components/views/MuroComunidadView.tsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/¿/g, "'"); // Revert all ¿ back to '

// Now specifically put ¿ on ¿Necesitas
text = text.replace(/'Necesitas/g, '¿Necesitas');
text = text.replace(/'Necesitas/g, '¿Necesitas');

fs.writeFileSync(file, text, 'utf8');
