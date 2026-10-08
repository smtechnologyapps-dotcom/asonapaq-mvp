const fs = require('fs');
let main = fs.readFileSync('components/MainAppContainer.tsx', 'utf8');

// I will just add {currentRoute === 'registro' && <FormularioRegistroView onRouteChange={handleRouteChange} />} BEFORE the renderProtectedRoute block

main = main.replace(
    /\{currentRoute === 'auditoria_social' && <AuditoriaSocialView onRouteChange=\{handleRouteChange\} \/>\}/,
    "{currentRoute === 'auditoria_social' && <AuditoriaSocialView onRouteChange={handleRouteChange} />}\n            {currentRoute === 'registro' && <FormularioRegistroView onRouteChange={handleRouteChange} />}"
);

// wait! if renderProtectedRoute is called for 'registro', it returns null. So we MUST remove 'registro' from the array!
main = main.replace(
    /\{\['portal_pacientes', 'portal_voluntarios', 'panel_administracion', 'registro'\]\.includes\(currentRoute\) && renderProtectedRoute\(currentRoute\)\}/,
    "{['portal_pacientes', 'portal_voluntarios', 'panel_administracion'].includes(currentRoute) && renderProtectedRoute(currentRoute)}"
);

fs.writeFileSync('components/MainAppContainer.tsx', main, 'utf8');
