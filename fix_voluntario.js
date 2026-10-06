const fs = require('fs');
const file = 'components/views/PortalVoluntarioView.tsx';
let text = fs.readFileSync(file, 'utf8');

const replacements = {
  'VOZ DÍA SOLIDARIDAD': 'VOZ DE LA SOLIDARIDAD',
  'Ã¢â‚¬Â¢ Carmen': '• Carmen',
  'Inscrito Ã¢â‚¬Â¢': 'Inscrito ✓',
  'Inscrito ǽ\\uFFFD\'\\uFFFD': 'Inscrito ✓',
  'Inscrito ǽ\'': 'Inscrito ✓',
  'Inscrito ǽ"': 'Inscrito ✓',
  'Ã¢â‚¬Â¢ 12:00 PM': '- 12:00 PM',
  'Ã¢â‚¬Â¢ 5:00 PM': '- 5:00 PM',
  'Habilitadías': 'Habilitadas',
  'vidías': 'vidas',
  'ÃƒÂšnete a Nuestra Familia': 'Únete a Nuestra Familia',
  'experiencia medía previa': 'experiencia médica previa',
  'Ã‚Â¿Qué te inspira': '¿Qué te inspira',
  'Panamáá Centro': 'Panamá Centro',
  // and check the unicode replacements from the file directly
  'ǽ\\uFFFD\'\\uFFFD': '•',
  'ǽ\'': '•'
};

for (const [k, v] of Object.entries(replacements)) {
  text = text.split(k).join(v);
}

// Regex specifically
text = text.replace(/VOZ D.A SOLIDARIDAD/g, 'VOZ DE LA SOLIDARIDAD');
text = text.replace(/Inscrito .*/g, function(match) {
  if (match.includes('Inscrito')) return 'Inscrito ✓';
  return match;
}); // wait, that regex is dangerous.
text = text.replace(/experiencia med.a previa/g, 'experiencia médica previa');
text = text.replace(/Habilitad.as/g, 'Habilitadas');
text = text.replace(/vid.as/g, 'vidas');

fs.writeFileSync(file, text, 'utf8');
console.log('Fixed PortalVoluntarioView');
