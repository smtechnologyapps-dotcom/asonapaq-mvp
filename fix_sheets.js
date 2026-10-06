const fs = require('fs');
const file = 'lib/google-sheets.ts';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(/zonasHabilitad.as/g, 'zonasHabilitadas');
fs.writeFileSync(file, text, 'utf8');
console.log('Fixed google sheets api typings');
