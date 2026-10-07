const fs = require('fs');

const file = 'components/views/PanelAdministracionView.tsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(
  "import React, { useState, useMemo } from 'react';",
  "import React, { useState, useMemo, useEffect } from 'react';\nimport { supabase } from '../../lib/supabase';"
);

text = text.replace(
  "const [activeTab, setActiveTab] = useState<'graficos' | 'datos'>('graficos');",
  "const [activeTab, setActiveTab] = useState<'graficos' | 'datos' | 'solicitudes'>('graficos');\n  const [solicitudes, setSolicitudes] = useState<any[]>([]);"
);

const fetchHook = `
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const { data, error } = await supabase
          .from('solicitudes_apoyo')
          .select('*, perfiles(nombre_completo, cedula, celular)')
          .order('creado_en', { ascending: false });
        if (data) setSolicitudes(data);
      } catch(e) { console.error(e); }
    };
    fetchSolicitudes();
  }, []);

  const actualizarEstadoSolicitud = async (id: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase.from('solicitudes_apoyo').update({ estado: nuevoEstado }).eq('id', id);
      if (!error) {
        setSolicitudes(solicitudes.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
      }
    } catch(e) { console.error(e); }
  };
`;

text = text.replace(
  "const [chartFilterApoyo, setChartFilterApoyo] = useState('Todos');",
  "const [chartFilterApoyo, setChartFilterApoyo] = useState('Todos');\n" + fetchHook
);

const buttonReplace = `<button
              onClick={() => setActiveTab('datos')}
              className={\`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all \${activeTab === 'datos' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}\`}
            >
              <FileSpreadsheet className="w-5 h-5" /> Base de Datos
            </button>
            <button
              onClick={() => setActiveTab('solicitudes')}
              className={\`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all \${activeTab === 'solicitudes' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100'}\`}
            >
              <HeartHandshake className="w-5 h-5" /> Solicitudes
            </button>`;

text = text.replace(
  /<button[\s\S]*?onClick=\{\(\) => setActiveTab\('datos'\)\}[\s\S]*?Base de Datos[\s\S]*?<\/button>/,
  buttonReplace
);

const solicitudesTab = `
        {activeTab === 'solicitudes' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
            <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <HeartHandshake className="w-6 h-6 text-emerald-600" /> Gestión de Solicitudes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-100 text-slate-400 text-sm">
                    <th className="pb-3 font-bold px-4">Fecha</th>
                    <th className="pb-3 font-bold px-4">Paciente</th>
                    <th className="pb-3 font-bold px-4">Contacto</th>
                    <th className="pb-3 font-bold px-4">Tipo</th>
                    <th className="pb-3 font-bold px-4">Descripción</th>
                    <th className="pb-3 font-bold px-4">Estado</th>
                    <th className="pb-3 font-bold px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.length === 0 ? (
                     <tr><td colSpan={7} className="text-center py-8 text-slate-400">No hay solicitudes</td></tr>
                  ) : (
                    solicitudes.map((sol) => (
                      <tr key={sol.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 text-sm text-slate-500">{new Date(sol.creado_en).toLocaleDateString()}</td>
                        <td className="py-4 px-4 font-bold text-slate-700">{sol.perfiles?.nombre_completo}<br/><span className="text-xs text-slate-400 font-normal">{sol.perfiles?.cedula}</span></td>
                        <td className="py-4 px-4 text-sm text-slate-500">{sol.perfiles?.celular || 'N/A'}</td>
                        <td className="py-4 px-4 text-sm font-bold text-slate-600">{sol.tipo_apoyo}</td>
                        <td className="py-4 px-4 text-sm text-slate-500 max-w-xs truncate" title={sol.descripcion}>{sol.descripcion}</td>
                        <td className="py-4 px-4">
                          <span className={\`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap \${
                            sol.estado === 'Aprobado' ? 'bg-emerald-100 text-emerald-700' : 
                            sol.estado === 'Rechazado' ? 'bg-rose-100 text-rose-700' : 
                            sol.estado === 'Completado' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }\`}>
                            {sol.estado}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {sol.estado === 'En Revisión' && (
                              <>
                                <button onClick={() => actualizarEstadoSolicitud(sol.id, 'Aprobado')} className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded font-bold">Aprobar</button>
                                <button onClick={() => actualizarEstadoSolicitud(sol.id, 'Rechazado')} className="text-xs bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded font-bold">Rechazar</button>
                              </>
                            )}
                            {sol.estado === 'Aprobado' && (
                              <button onClick={() => actualizarEstadoSolicitud(sol.id, 'Completado')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold">Completar</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
`;

text = text.replace(
  "{activeTab === 'datos' && (",
  solicitudesTab + "\n        {activeTab === 'datos' && ("
);

fs.writeFileSync(file, text, 'utf8');
console.log('PanelAdministracionView updated successfully');
