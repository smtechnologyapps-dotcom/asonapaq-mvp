const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

// Remove it from outside
panel = panel.replace(/  const actualizarEstadoSolicitud = async \(id: string, nuevoEstado: string\) => \{\s*await supabase\.from\('solicitudes_apoyo'\)\.update\(\{ estado: nuevoEstado \}\)\.eq\('id', id\);\s*const \{ data \} = await supabase\.from\('solicitudes_apoyo'\)\.select\('\*, perfiles\(nombre_completo, cedula, celular\)'\);\s*if \(data\) setSolicitudes\(data\);\s*\};\s*/g, '');

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
