const fs = require('fs');
let formPath = 'components/views/FormularioRegistroView.tsx';
let formText = fs.readFileSync(formPath, 'utf8');

formText = formText.replace(/'home'/g, "'inicio_publica'");

fs.writeFileSync(formPath, formText, 'utf8');
console.log('Fixed route name in FormularioRegistroView');
