const fs = require('fs');
const file = 'components/views/MuroComunidadView.tsx';
let text = fs.readFileSync(file, 'utf8');

const replacements = {
  'beneficiad\uFFFDas': 'beneficiadas',
  'beneficiadías': 'beneficiadas',
  'beneficiadas': 'beneficiadas', // just to ensure
  'xito ǽ"': 'éxito ✓',
  'xito': 'éxito',
  'ǽ"': '✓',
  '\'Necesitas': '¿Necesitas',
  '\'': '¿',
  'lnea': 'línea',
  'acompaamiento': 'acompañamiento',
  'oracin': 'oración',
  'est': 'está',
  'Panam': 'Panamá',
  'Panamáá': 'Panamá',
  'Panamáá¡': 'Panamá',
  'Panamá¡': 'Panamá',
  'Comms': 'Comments',
  'allowComms': 'allowComments',
  'handleToggleAllowComms': 'handleToggleAllowComments',
  'Modo Autor: Permitir comentaris': 'Modo Autor: Permitir comentarios',
  'comentaris': 'comentarios'
};

for (const [k, v] of Object.entries(replacements)) {
  text = text.split(k).join(v);
}

// Ensure the ¿ character specifically for Necesitas
text = text.replace(/\uFFFD\?Necesitas/g, '¿Necesitas');
text = text.replace(/\?\?Necesitas/g, '¿Necesitas');
text = text.replace(/Ã‚Â¿Necesitas/g, '¿Necesitas');
text = text.replace(/'Necesitas/g, '¿Necesitas');

// Fallback replacements
text = text.replace(/beneficiad.as/g, 'beneficiadas');
text = text.replace(/l.nea/g, 'línea');
text = text.replace(/acompa.amiento/g, 'acompañamiento');
text = text.replace(/oraci.n/g, 'oración');
text = text.replace(/est. activa/g, 'está activa');
text = text.replace(/en Panam./g, 'en Panamá.');

fs.writeFileSync(file, text, 'utf8');
console.log('Fixed MuroComunidadView');
