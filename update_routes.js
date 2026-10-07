const fs = require('fs');
let typesPath = 'lib/types.ts';
let typesText = fs.readFileSync(typesPath, 'utf8');

if (!typesText.includes("'registro'")) {
  typesText = typesText.replace(
    "export type AppRoute = 'home' | 'portal_paciente' | 'portal_voluntario' | 'auditoria_social' | 'muro_comunidad' | 'panel_administracion';",
    "export type AppRoute = 'home' | 'portal_paciente' | 'portal_voluntario' | 'auditoria_social' | 'muro_comunidad' | 'panel_administracion' | 'registro';"
  );
  fs.writeFileSync(typesPath, typesText, 'utf8');
}
console.log('Updated types');

let appPath = 'components/MainAppContainer.tsx';
let appText = fs.readFileSync(appPath, 'utf8');

if (!appText.includes("import { FormularioRegistroView }")) {
  appText = appText.replace(
    "import { Footer } from './Footer';",
    "import { Footer } from './Footer';\nimport { FormularioRegistroView } from './views/FormularioRegistroView';"
  );
  appText = appText.replace(
    "if (route === 'panel_administracion') {",
    "if (route === 'registro') {\n      return <FormularioRegistroView onRouteChange={setRoute} />;\n    }\n    if (route === 'panel_administracion') {"
  );
  fs.writeFileSync(appPath, appText, 'utf8');
}
console.log('Updated MainAppContainer');
