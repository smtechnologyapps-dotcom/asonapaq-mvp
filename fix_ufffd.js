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

for (const file of files) {
  let text = fs.readFileSync(file, 'utf-8');
  
  // Replace the exact \uFFFD instances
  text = text.replace(/Ejecuci\uFFFDn Solid\uFFFDa/g, 'Ejecución Solidaria');
  text = text.replace(/ap\uFFFDsitos/g, 'apósitos');
  text = text.replace(/hipercal\uFFFDricos/g, 'hipercalóricos');
  text = text.replace(/Auditor\uFFFDa/g, 'Auditoría');
  text = text.replace(/seg\uFFFDn/g, 'según');
  text = text.replace(/Cooperaci\uFFFDn/g, 'Cooperación');
  text = text.replace(/Oncol\uFFFDgico/g, 'Oncológico');
  text = text.replace(/Panam\uFFFD/g, 'Panamá');
  
  // Other words from earlier
  text = text.replace(/Insum\uFFFDs/g, 'Insumos');
  text = text.replace(/M\uFFFDdicos/g, 'Médicos');
  text = text.replace(/Contenci\uFFFDn/g, 'Contención');
  text = text.replace(/C\uFFFDrculos/g, 'Círculos');
  text = text.replace(/Nutrici\uFFFDn/g, 'Nutrición');
  text = text.replace(/oncol\uFFFDgica/g, 'oncológica');
  text = text.replace(/ning\uFFFDn/g, 'ningún');
  text = text.replace(/acompa\uFFFDamiento/g, 'acompañamiento');
  text = text.replace(/Junt\uFFFDcnica/g, 'Junta Técnica');
  text = text.replace(/Misi\uFFFDn/g, 'Misión');
  text = text.replace(/Visi\uFFFDn/g, 'Visión');
  text = text.replace(/alegr\uFFFDa/g, 'alegría');
  text = text.replace(/energ\uFFFDa/g, 'energía');
  text = text.replace(/d\uFFFDas/g, 'días');
  
  text = text.replace(/p\uFFFDblica de Panam/g, 'República de Panamá');
  text = text.replace(/p\uFFFDblica de Panamá/g, 'República de Panamá');
  text = text.replace(/Un espública de Panamá/g, 'En la República de Panamá');
  text = text.replace(/Un esRepública de Panamá/g, 'En la República de Panamá');

  // Bullet points
  text = text.replace(/ǽ\uFFFD'\uFFFD/g, '•');
  text = text.replace(/ǽ'/g, '•');
  text = text.replace(/Ã¢â‚¬Â¢/g, '•');
  
  // Checkmark
  text = text.replace(/ǽ\uFFFD"\uFFFD\?o/g, '✓');

  // Double check
  text = text.replace(/Panamáá/g, 'Panamá');
  text = text.replace(/Panamáá¡/g, 'Panamá');
  text = text.replace(/Panamá¡/g, 'Panamá');

  fs.writeFileSync(file, text, 'utf8');
}
console.log('Fixed uFFFD instances!');
