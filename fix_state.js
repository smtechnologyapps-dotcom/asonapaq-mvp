const fs = require('fs');
let appPath = 'components/MainAppContainer.tsx';
let appText = fs.readFileSync(appPath, 'utf8');

appText = appText.replace(
  "return <FormularioRegistroView onRouteChange={setRoute} />;",
  "return <FormularioRegistroView onRouteChange={handleRouteChange} />;"
);

fs.writeFileSync(appPath, appText, 'utf8');
console.log('Fixed handleRouteChange');
