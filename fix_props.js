const fs = require('fs');
const file = 'components/views/PanelAdministracionView.tsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  "import { useAsonapaqStore, triggerN8NWebhook } from '../../lib/store';",
  "import { triggerN8NWebhook } from '../../lib/store';"
);

text = text.replace(
  "interface PanelAdministracionViewProps {\n  onRouteChange?: (route: AppRoute) => void;",
  "interface PanelAdministracionViewProps {\n  onRouteChange?: (route: AppRoute) => void;\n  patients?: PatientRecord[];"
);

text = text.replace(
  "export const PanelAdministracionView: React.FC<PanelAdministracionViewProps> = ({\n  onRouteChange\n}) => {\n  const patients = useAsonapaqStore((state) => state.patients);",
  "export const PanelAdministracionView: React.FC<PanelAdministracionViewProps> = ({\n  onRouteChange,\n  patients = []\n}) => {"
);

fs.writeFileSync(file, text, 'utf8');
console.log('Fixed PanelAdministracionView props');
