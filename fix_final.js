const fs = require('fs');

let panel = fs.readFileSync('components/views/PanelAdministracionView.tsx', 'utf8');

// I will clear everything between \        </div>\n      ) : (\ and the end of the file, replacing it with the new tabs.

const fixRegex = /<div className="max-w-md">[\s\S]*/;

const fixedEnd = \
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
                      <span className={\\\px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider \\\\}>
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
    </div>
  );
};
\;

panel = panel.replace(fixRegex, fixedEnd);

fs.writeFileSync('components/views/PanelAdministracionView.tsx', panel, 'utf8');
