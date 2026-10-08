const fs = require('fs');
let main = fs.readFileSync('components/MainAppContainer.tsx', 'utf8');

// I will just add {currentRoute === 'registro' && <FormularioRegistroView onRouteChange={handleRouteChange} />} to the AnimatePresence block.

main = main.replace(
    /\{currentRoute === 'auditoria_social' && <AuditoriaSocialView onRouteChange=\{handleRouteChange\} \/>\}/,
    "{currentRoute === 'auditoria_social' && <AuditoriaSocialView onRouteChange={handleRouteChange} />}\n            {currentRoute === 'registro' && <FormularioRegistroView onRouteChange={handleRouteChange} />}"
);

fs.writeFileSync('components/MainAppContainer.tsx', main, 'utf8');
