const fs = require('fs');
let typesPath = 'lib/types.ts';
let typesText = fs.readFileSync(typesPath, 'utf8');

if (!typesText.includes("'registro'")) {
  typesText = typesText.replace(
    "| 'junta_tecnica';",
    "| 'junta_tecnica'\n  | 'registro';"
  );
  fs.writeFileSync(typesPath, typesText, 'utf8');
}

let appPath = 'components/MainAppContainer.tsx';
let appText = fs.readFileSync(appPath, 'utf8');
if (!appText.includes("route === 'registro'")) {
  appText = appText.replace(
    "if (route === 'panel_administracion') {",
    "if (route === 'registro') {\n      return <FormularioRegistroView onRouteChange={setRoute} />;\n    }\n    if (route === 'panel_administracion') {"
  );
  fs.writeFileSync(appPath, appText, 'utf8');
}

let headerPath = 'components/Header.tsx';
let headerText = fs.readFileSync(headerPath, 'utf8');
if (!headerText.includes("'registro': 'Registro Oficial'")) {
  headerText = headerText.replace(
    "junta_tecnica: 'Junta Tcnica ION'",
    "junta_tecnica: 'Junta Técnica ION',\n    registro: 'Registro Oficial'"
  );
  
  // Add register button next to ION call
  headerText = headerText.replace(
    '<PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-bounce" />',
    '<PhoneCall className="w-3.5 h-3.5 text-rose-400" />'
  );
  
  headerText = headerText.replace(
    '<div className="flex items-center gap-1.5 sm:gap-2">',
    '<div className="flex items-center gap-1.5 sm:gap-2">\n          <button onClick={() => onRouteChange(\'registro\')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-900/50"><span>¡Únete!</span></button>'
  );
  fs.writeFileSync(headerPath, headerText, 'utf8');
}

console.log('Update Complete');
