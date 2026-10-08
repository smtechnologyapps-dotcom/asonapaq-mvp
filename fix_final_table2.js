const fs = require('fs');
let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

const replacementStr = `activeTab === 'datos' ? (
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
                    <td className="p-4 text-sm text-slate-500 flex items-center justify-between">
                      {new Date(u.creado_en || u.created_at || new Date()).toLocaleDateString()}
                      <button onClick={() => setSelectedUser(u)} className="ml-4 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800">Ver Perfil</button>
                    </td>
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
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl">
            <div className="sticky top-0 bg-slate-900 text-white p-6 rounded-t-[2rem] flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-black">Expediente Oficial</h2>
                <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">{selectedUser.rol}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-8">
              {/* Información Personal */}
              <section>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-emerald-600" /> Información Personal
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div><p className="text-xs text-slate-400 font-bold">Cédula</p><p className="text-sm font-bold text-slate-900">{selectedUser.cedula}</p></div>
                  <div><p className="text-xs text-slate-400 font-bold">Nombre</p><p className="text-sm font-bold text-slate-900">{selectedUser.nombre_completo}</p></div>
                  <div><p className="text-xs text-slate-400 font-bold">Celular</p><p className="text-sm font-bold text-slate-900">{selectedUser.celular}</p></div>
                  <div><p className="text-xs text-slate-400 font-bold">Sexo</p><p className="text-sm font-bold text-slate-900">{selectedUser.sexo || 'N/A'}</p></div>
                  <div><p className="text-xs text-slate-400 font-bold">Estado Civil</p><p className="text-sm font-bold text-slate-900">{selectedUser.estado_civil || 'N/A'}</p></div>
                  <div><p className="text-xs text-slate-400 font-bold">Región</p><p className="text-sm font-bold text-slate-900">{selectedUser.provincia || 'N/A'}</p></div>
                  <div className="col-span-2 md:col-span-3"><p className="text-xs text-slate-400 font-bold">Contacto de Emergencia</p><p className="text-sm font-bold text-slate-900">{selectedUser.contacto_emergencia || 'N/A'} ({selectedUser.tel_emergencia || 'N/A'})</p></div>
                </div>
              </section>

              {/* Información Médica (Solo Pacientes) */}
              {selectedUser.rol === 'paciente' && selectedUser.datos_medicos_pacientes && (
                <section>
                  <h3 className="text-sm font-black text-rose-800 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-rose-100 pb-2">
                    <Heart className="w-4 h-4 text-rose-600" /> Expediente Médico
                  </h3>
                  <div className="grid grid-cols-2 gap-6 bg-rose-50 p-4 rounded-2xl">
                    <div><p className="text-xs text-rose-400 font-bold">Diagnóstico Principal</p><p className="text-sm font-black text-rose-900">{selectedUser.datos_medicos_pacientes.diagnostico_principal || 'N/A'}</p></div>
                    <div><p className="text-xs text-rose-400 font-bold">Etapa</p><p className="text-sm font-bold text-rose-900">{selectedUser.datos_medicos_pacientes.etapa_cancer || 'N/A'}</p></div>
                    <div><p className="text-xs text-rose-400 font-bold">Centro de Atención</p><p className="text-sm font-bold text-rose-900">{selectedUser.datos_medicos_pacientes.centro_atencion || 'N/A'}</p></div>
                    <div><p className="text-xs text-rose-400 font-bold">Tratamiento Actual</p><p className="text-sm font-bold text-rose-900">{selectedUser.datos_medicos_pacientes.tratamiento_actual || 'N/A'}</p></div>
                    <div className="col-span-2"><p className="text-xs text-rose-400 font-bold">Medicamentos</p><p className="text-sm font-bold text-rose-900">{selectedUser.datos_medicos_pacientes.medicamentos || 'N/A'}</p></div>
                  </div>
                </section>
              )}

              {/* Información Voluntario */}
              {selectedUser.rol === 'voluntario' && selectedUser.datos_voluntarios && (
                <section>
                  <h3 className="text-sm font-black text-sky-800 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-sky-100 pb-2">
                    <User className="w-4 h-4 text-sky-600" /> Perfil de Voluntariado
                  </h3>
                  <div className="grid grid-cols-2 gap-6 bg-sky-50 p-4 rounded-2xl">
                    <div><p className="text-xs text-sky-500 font-bold">Área de Apoyo</p><p className="text-sm font-black text-sky-900">{selectedUser.datos_voluntarios.area_apoyo || 'N/A'}</p></div>
                    <div><p className="text-xs text-sky-500 font-bold">Estatus Laboral</p><p className="text-sm font-bold text-sky-900">{selectedUser.datos_voluntarios.estatus_laboral || 'N/A'}</p></div>
                    <div className="col-span-2"><p className="text-xs text-sky-500 font-bold">Pasatiempos / Habilidades</p><p className="text-sm font-bold text-sky-900">{selectedUser.datos_voluntarios.pasatiempos || 'N/A'}</p></div>
                  </div>
                </section>
              )}
            </div>
            <div className="p-6 bg-slate-50 rounded-b-[2rem] border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedUser(null)} className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300">Cerrar Expediente</button>
            </div>
          </div>
        </div>
      )}
`;

panel = panel.replace(/\)\s*:\s*\([\s\S]*?Volver a[\s\S]*?<\/button>\s*<\/div>\s*\)\}/, replacementStr + "}");

// Now inject the state hooks
const stateInjection = `  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [directorios, setDirectorios] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);`;
panel = panel.replace(/const \[activeTab, setActiveTab\] = useState\('graficos'\);/, "const [activeTab, setActiveTab] = useState('graficos');\n" + stateInjection);

// Inject fetch logic in useEffect
const fetchInjection = `    const fetchDirectorios = async () => {
      const { data } = await supabase.from('perfiles').select('*, datos_medicos_pacientes(*), datos_voluntarios(*)').order('created_at', { ascending: false });
      if (data) setDirectorios(data);
    };
    const fetchSolicitudes = async () => {
      const { data } = await supabase.from('solicitudes_apoyo').select('*, perfiles(nombre_completo, cedula, celular)');
      if (data) setSolicitudes(data);
    };
    fetchDirectorios();
    fetchSolicitudes();`;

panel = panel.replace(/setChartData\(transformed\);\n\s*\};\n\n\s*fetchStats\(\);\n\s*\}\}, \[patients\]\);/, "setChartData(transformed);\n    };\n\n    fetchStats();\n" + fetchInjection + "\n  }, [patients]);");

// Ensure updating status works
const updateStatus = `  const actualizarEstadoSolicitud = async (id: string, nuevoEstado: string) => {
    await supabase.from('solicitudes_apoyo').update({ estado: nuevoEstado }).eq('id', id);
    const { data } = await supabase.from('solicitudes_apoyo').select('*, perfiles(nombre_completo, cedula, celular)');
    if (data) setSolicitudes(data);
  };`;

panel = panel.replace(/const COLORS = \[/, updateStatus + "\n\n  const COLORS = [");

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
console.log("SUCCESS");
