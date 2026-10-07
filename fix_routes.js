const fs = require('fs');

let main = fs.readFileSync('components/MainAppContainer.tsx', 'utf8');
main = main.replace(
    /\{\['portal_pacientes', 'portal_voluntarios', 'panel_administracion'\]\.includes\(currentRoute\) && renderProtectedRoute\(currentRoute\)\}/,
    "{['portal_pacientes', 'portal_voluntarios', 'panel_administracion', 'registro'].includes(currentRoute) && renderProtectedRoute(currentRoute)}"
);
fs.writeFileSync('components/MainAppContainer.tsx', main, 'utf8');
console.log('MainAppContainer route array fixed.');
