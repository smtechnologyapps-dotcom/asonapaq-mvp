const fs = require('fs');
const file = 'components/views/PanelAdministracionView.tsx';
let text = fs.readFileSync(file, 'utf8');
text = text.replace(
  "onClick={(data) => setChartFilterApoyo(chartFilterApoyo === data.name ? 'Todos' : data.name)}",
  "onClick={(data) => setChartFilterApoyo(chartFilterApoyo === data.name ? 'Todos' : (data.name || 'Todos'))}"
);
text = text.replace(
  "onClick={(data) => setChartFilterRegion(chartFilterRegion === data.name ? 'Todas' : data.name)}",
  "onClick={(data) => setChartFilterRegion(chartFilterRegion === data.name ? 'Todas' : (data.name || 'Todas'))}"
);
fs.writeFileSync(file, text, 'utf8');
console.log('Fixed typescript error');
