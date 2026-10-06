const fs = require('fs');
const path = require('path');

const files = [
  'components/views/PortalPacienteView.tsx',
  'components/views/PortalVoluntarioView.tsx',
  'components/views/MuroComunidadView.tsx'
];

const replacements = {
  'setCed\uFFFDn': 'setCedula', // Wait, what was the character?
  'setCeda': 'setCedula',
  'Cda': 'Cédula',
  'mda': 'médica',
  ' da ': ' de la ',
  'border-dashed': 'border-dashed',
  'Forms': 'Formatos',
  'Gestionam.': 'Gestionar tu expediente.',
  'Transmitienda': 'Transmitiendo a',
  'handleDownloada': 'handleDownload',
  'handleConfirmHabeasda': 'handleConfirmHabeasData',
  
  // also fix standard unicode replacement char cases
  'setCed\uFFFDa': 'setCedula',
  'C\uFFFDd\uFFFDa': 'Cédula',
  'm\uFFFDd\uFFFDa': 'médica',
  ' d\uFFFDa ': ' de la ',
  'border-d\uFFFDashed': 'border-dashed',
  'Form\uFFFDs': 'Formatos',
  'Gestionam\uFFFD.': 'Gestionar tu expediente.',
  'Transmitiend\uFFFDa': 'Transmitiendo a',
  'handleDownload\uFFFDa': 'handleDownload',
  'handleConfirmHabeasd\uFFFDa': 'handleConfirmHabeasData',
  
  // And some others found
  'Insum\uFFFDs': 'Insumos',
  'Insums': 'Insumos',
  'quimioterapia': 'Quimioterapia',
  'Chiriqu': 'Chiriquí',
  'Panam': 'Panamá',
  'Pediatra': 'Pediatría',
  'Peditricas': 'Pediátricas',
  'Hernndez': 'Hernández',
  'Nicols': 'Nicolás',
  'Ancn': 'Ancón',
  'Oncolgico': 'Oncológico',
  'Oncolgicos': 'Oncológicos',
  'Suplementacin': 'Suplementación',
  'Psicolgico': 'Psicológico',
  'Forneo': 'Foráneo',
  'Contencin': 'Contención',
  'Eliminacin': 'Eliminación',
  'Proteccin': 'Protección',
  'Gua': 'Guía',
  'Clnica': 'Clínica',
  'Atencin': 'Atención',
  'Telefnica': 'Telefónica',
  'Demstenes': 'Demóstenes',
  'Orientacin': 'Orientación',
  'agudas': 'agudas',
  'ao': 'año',
  
  // Muro / Portal Voluntario
  'fotografa': 'fotografía',
  'Transmitienda': 'Transmitiendo a',
};

for (const file of files) {
  if (fs.existsSync(file)) {
    let text = fs.readFileSync(file, 'utf8');
    for (const [k, v] of Object.entries(replacements)) {
      text = text.split(k).join(v);
    }
    fs.writeFileSync(file, text, 'utf8');
  }
}
console.log('Fixed surgical strings in Portals');
