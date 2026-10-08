const fs = require('fs');

// 1. Fix MainAppContainer duplicate
let main = fs.readFileSync('components/MainAppContainer.tsx', 'utf8');
// remove the extra explicit one
main = main.replace(/\{currentRoute === 'registro' && <FormularioRegistroView onRouteChange=\{handleRouteChange\} \/>\}\n\s*/, '');
fs.writeFileSync('components/MainAppContainer.tsx', main, 'utf8');

// 2. Fix encoding in PortalVoluntarioView.tsx
let vol = fs.readFileSync('components/views/PortalVoluntarioView.tsx', 'utf8');
vol = vol.replace(/Ã¢â‚¬â€œ/g, '—');
vol = vol.replace(/Ã¢â‚¬Å“/g, '"');
vol = vol.replace(/Ã¢â‚¬Â/g, '"');
vol = vol.replace(/Ã¢â‚¬â„¢/g, "'");
vol = vol.replace(/Ã¢â‚¬/g, '—');
fs.writeFileSync('components/views/PortalVoluntarioView.tsx', vol, 'utf8');

console.log("Fixed duplicate and encoding.");
