const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        filelist = walkSync(path.join(dir, file), filelist);
      }
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        filelist.push(path.join(dir, file));
      }
    }
  });
  return filelist;
};

const files = walkSync('./components', []).concat(walkSync('./app', [])).concat(walkSync('./lib', []));

const replacements = {
  // From InicioPublicaView / general
  'Panamáá¡': 'Panamá',
  'Panamáá': 'Panamá',
  'Panam': 'Panamá',
  'Panam\\uFFFD': 'Panamá',
  'Ã,Â·': '·',
  'ÃƒÂ³': 'ó',
  'ÃƒÂ±': 'ñ',
  'ÃƒÂ­': 'í',
  'ÃƒÂ¡': 'á',
  'ÃƒÂ©': 'é',
  'Ã¢â‚¬Â¢': '•',
  'ǽ\'': '•',
  'ǽ"?o': '✓', // Fallback for checkmark
  
  // Specific mangled words in Auditoria
  'Ejecucin Solida': 'Ejecución Solidaria',
  'Ejecucin': 'Ejecución',
  'apsitos': 'apósitos',
  'hipercalricos': 'hipercalóricos',
  'Auditora': 'Auditoría',
  'segÃƒÂºn': 'según',
  'Cooperacin': 'Cooperación',
  'Oncolgico': 'Oncológico',
  'pública de Panamá¡': 'República de Panamá',
  'segn': 'según',
  
  // specific mangled words in Muro / Portal
  'Contencin': 'Contención',
  'Crculos': 'Círculos',
  'Nutricin': 'Nutrición',
  'oncolgica': 'oncológica',
  'oncolgico': 'oncológico',
  'mdica': 'médica',
  'Mdicos': 'Médicos',
  'Insums': 'Insumos',
  'calida': 'calidad a',
  'ningn': 'ningún',
  'acompaamiento': 'acompañamiento',
  'Juntcnica': 'Junta Técnica',
  'Misin': 'Misión',
  'Visin': 'Visión',
  'alegra': 'alegría',
  'das': 'días',
  'energa': 'energía',
  
  // General fallback for  if missed
  '': '' // Careful! I'll comment this out and do manual regex below
};

for (const file of files) {
  let text = fs.readFileSync(file, 'utf-8');
  // First fix known sequences
  for (const [k, v] of Object.entries(replacements)) {
    text = text.split(k).join(v);
  }
  
  // Some regex fallbacks for broken words
  text = text.replace(/p\s*blica de Panam/g, 'República de Panamá');
  text = text.replace(/Insums Mdicos/g, 'Insumos Médicos');
  text = text.replace(/Contencin/g, 'Contención');
  text = text.replace(/Crculos/g, 'Círculos');
  text = text.replace(/Nutricin/g, 'Nutrición');
  text = text.replace(/hipercalricos/g, 'hipercalóricos');
  text = text.replace(/oncolgica/g, 'oncológica');
  text = text.replace(/ningn/g, 'ningún');
  text = text.replace(/acompaamiento/g, 'acompañamiento');
  text = text.replace(/Juntcnica/g, 'Junta Técnica');
  text = text.replace(/Misin/g, 'Misión');
  text = text.replace(/Visin/g, 'Visión');
  text = text.replace(/Panam/g, 'Panamá');
  text = text.replace(/apsitos/g, 'apósitos');
  text = text.replace(/Auditora/g, 'Auditoría');
  text = text.replace(/Cooperacin/g, 'Cooperación');
  text = text.replace(/Oncolgico/g, 'Oncológico');
  text = text.replace(/segn/g, 'según');
  text = text.replace(/Ejecucin Solida/g, 'Ejecución Solidaria');
  text = text.replace(/Ejecucin/g, 'Ejecución');
  text = text.replace(/mdica/g, 'médica');
  text = text.replace(/Mdicos/g, 'Médicos');
  text = text.replace(/alegra/g, 'alegría');
  text = text.replace(/energa/g, 'energía');
  text = text.replace(/das/g, 'días');
  text = text.replace(/calida/g, 'calidad a');
  text = text.replace(/Insums/g, 'Insumos');
  text = text.replace(/ǽ"\?o/g, '✓');
  text = text.replace(/ǽ'/g, '•');
  text = text.replace(/Ã¢â‚¬Â¢/g, '•');

  fs.writeFileSync(file, text, 'utf8');
}
console.log('Fixed encoding everywhere!');
