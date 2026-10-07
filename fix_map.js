const fs = require('fs');

let main = fs.readFileSync('components/MainAppContainer.tsx', 'utf8');
main = main.replace(
    /diagnostico: p\.datos_medicos_pacientes\?\.\[0\]\?\.diagnostico_principal \|\| 'Desconozco',/,
    "diagnostico: p.datos_medicos_pacientes?.diagnostico_principal || 'Desconozco',"
);
main = main.replace(
    /hospital: p\.datos_medicos_pacientes\?\.\[0\]\?\.centro_atencion \|\| 'ION',/,
    "hospital: p.datos_medicos_pacientes?.centro_atencion || 'ION',"
);
main = main.replace(
    /observaciones: 'Etapa: ' \+ \(p\.datos_medicos_pacientes\?\.\[0\]\?\.etapa_cancer \|\| 'N\/A'\)/,
    "observaciones: 'Etapa: ' + (p.datos_medicos_pacientes?.etapa_cancer || 'N/A')"
);
main = main.replace(
    /fechaRegistro: new Date\(p\.created_at\)\.toLocaleDateString\(\),/,
    "fechaRegistro: new Date(p.creado_en || new Date()).toLocaleDateString(),"
);
fs.writeFileSync('components/MainAppContainer.tsx', main, 'utf8');
console.log('MainAppContainer object mapping fixed.');
