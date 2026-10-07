const fs = require('fs');

const file = 'components/MainAppContainer.tsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  "<PortalPacienteView onAddPatientRecord={handleAddPatientRecord} onPurgePatientData={handlePurgePatientData} />",
  "<PortalPacienteView />"
);

fs.writeFileSync(file, text, 'utf8');
console.log('MainAppContainer fixed');
