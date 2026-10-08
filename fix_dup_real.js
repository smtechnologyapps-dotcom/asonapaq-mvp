const fs = require('fs');

let main = fs.readFileSync('components/MainAppContainer.tsx', 'utf8');

// Remove ALL occurrences of the duplicate line, carefully handling whitespace
const badLineRegex = /\{\s*currentRoute === 'registro' && <FormularioRegistroView onRouteChange=\{handleRouteChange\}\s*\/>\s*\}\n?/g;
main = main.replace(badLineRegex, '');

// Now explicitly insert exactly ONE after AuditoriaSocialView
const anchor = "{currentRoute === 'auditoria_social' && <AuditoriaSocialView onRouteChange={handleRouteChange} />}\n";
const insertion = "            {currentRoute === 'registro' && <FormularioRegistroView onRouteChange={handleRouteChange} />}\n";

main = main.replace(anchor, anchor + insertion);

fs.writeFileSync('components/MainAppContainer.tsx', main, 'utf8');
console.log("Deduplicated explicitly.");
