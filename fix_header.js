const fs = require('fs');
let headerPath = 'components/Header.tsx';
let headerText = fs.readFileSync(headerPath, 'utf8');

// The best way is to find the object and just inject it at the end
headerText = headerText.replace(
  "auditoria_social: 'Auditoría Social',",
  "auditoria_social: 'Auditoría Social',\n    registro: 'Registro Oficial',"
);
// just in case it's auditoria_social: 'Auditora Social',
headerText = headerText.replace(
  "auditoria_social: 'Auditora Social',",
  "auditoria_social: 'Auditoría Social',\n    registro: 'Registro Oficial',"
);

fs.writeFileSync(headerPath, headerText, 'utf8');
console.log('Fixed Header Route Labels');
