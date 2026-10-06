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
  'Cédía': 'Cédula',
  'Cedia': 'Cedula',
  'C\uFFFDd\uFFFDa': 'Cédula',
  'Insumás': 'Insumos',
  'Insums': 'Insumos',
  'Insum\uFFFDs': 'Insumos',
  'Ã‚Â·': '·',
  'Ã,Â·': '·',
  'todas': 'todas',
  'Tod\uFFFDas': 'Todas',
  'tod\uFFFDas': 'todas',
  'Acumulad\uFFFDas': 'Acumuladas',
  'Acompanados': 'Acompañados',
  'ǽ\uFFFD\'\uFFFD\?\?': '•',
  'ǽ\uFFFD\'\uFFFD': '•',
  'ǽ\'\?\?': '•',
  'ǽ\'': '•'
};

let filesChanged = 0;

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  let original = text;
  
  for (const [k, v] of Object.entries(replacements)) {
    text = text.split(k).join(v);
  }

  // Regex specifically for Cédía when it's hard to match
  text = text.replace(/Céd.a/g, 'Cédula');
  text = text.replace(/C.d.a/g, 'Cédula');
  
  // Specific regex for Insumás
  text = text.replace(/Insum.s /g, 'Insumos ');
  
  // Replace Ã‚Â· or similar with ·
  text = text.replace(/Ã‚Â·/g, '·');
  
  // Tod.as -> Todas
  text = text.replace(/Tod.as/g, 'Todas');
  
  // Acumulad.as -> Acumuladas
  text = text.replace(/Acumulad.as/g, 'Acumuladas');

  if (text !== original) {
    fs.writeFileSync(file, text, 'utf8');
    filesChanged++;
  }
}
console.log('Fixed ' + filesChanged + ' files');
