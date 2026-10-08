const fs = require('fs');

let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

const replacementStr = `      ) : activeTab === 'datos' ? (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Directorio de Pacientes y Voluntarios</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Cédula</th>
                  <th className="p-4">Nombre Completo</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">Celular</th>
                  <th className="p-4">Región</th>
                  <th className="p-4">Fecha Reg.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {directorios.length > 0 ? directorios.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-slate-700">{u.cedula}</td>
                    <td className="p-4 text-sm font-medium text-slate-900">{u.nombre_completo}</td>
                    <td className="p-4 text-sm">
                      <span className={\`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider \${
                        u.rol === 'paciente' ? 'bg-emerald-100 text-emerald-800' : 
                        u.rol === 'voluntario' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-800'
                      }\`}>
                        {u.rol}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{u.celular || 'N/A'}</td>
                    <td className="p-4 text-sm text-slate-600">{u.provincia || 'N/A'}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(u.creado_en || u.created_at || new Date()).toLocaleDateString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500 font-medium">Cargando directorio o no hay registros disponibles.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Solicitudes de Apoyo</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Paciente</th>
                  <th className="p-4">Celular</th>
                  <th className="p-4">Tipo Apoyo</th>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solicitudes.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm font-bold text-slate-700">{s.perfiles?.nombre_completo || s.paciente_id}</td>
                    <td className="p-4 text-sm text-slate-600">{s.perfiles?.celular || 'N/A'}</td>
                    <td className="p-4 text-sm font-medium text-slate-900">{s.tipo_apoyo}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(s.created_at).toLocaleDateString()}</td>
                    <td className="p-4 text-sm">
                      <span className={\`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider \${
                        s.estado === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' : 
                        s.estado === 'Rechazado' ? 'bg-rose-100 text-rose-800' : 
                        s.estado === 'Completado' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }\`}>
                        {s.estado}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {s.estado === 'Pendiente' && (
                        <div className="flex items-center gap-2">
                           <button onClick={() => actualizarEstadoSolicitud(s.id, 'Aprobado')} className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-xs">Aprobar</button>
                           <button onClick={() => actualizarEstadoSolicitud(s.id, 'Rechazado')} className="px-2 py-1 bg-rose-600 text-white rounded font-bold text-xs">Rechazar</button>
                        </div>
                      )}
                      {s.estado === 'Aprobado' && (
                        <button onClick={() => actualizarEstadoSolicitud(s.id, 'Completado')} className="px-2 py-1 bg-sky-600 text-white rounded font-bold text-xs">Completado</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}`;

panel = panel.replace(/      \) : \([\s\S]*?Volver a M\S+tricas e Inteligencia[\s\S]*?<\/button>\n        <\/div>\n      \)/, replacementStr);

const stateInjection = `  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [directorios, setDirectorios] = useState<any[]>([]);`;

panel = panel.replace(/const \[solicitudes, setSolicitudes\] = useState<any\[\]>\(\[\]\);/, stateInjection);

const fetchInjection = `    const fetchSolicitudes = async () => {
      const { data } = await supabase
        .from('solicitudes_apoyo')
        .select('*, perfiles(nombre_completo, cedula, celular)');
      if (data) setSolicitudes(data);
    };
    
    const fetchDirectorios = async () => {
      const { data } = await supabase.from('perfiles').select('*').order('created_at', { ascending: false });
      if (data) setDirectorios(data);
    };
    
    fetchSolicitudes();
    fetchDirectorios();`;

panel = panel.replace(/const fetchSolicitudes = async \(\) => \{[\s\S]*?fetchSolicitudes\(\);/, fetchInjection);

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
