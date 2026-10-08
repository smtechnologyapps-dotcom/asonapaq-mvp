'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AppRoute, PatientRecord } from '../../lib/types';
import { triggerN8NWebhook } from '../../lib/store';
import { AsonapaqLogo } from '../AsonapaqLogo';
import {
  ClipboardList,
  Filter,
  FileSpreadsheet,
  PieChart as PieChartIcon,
  BarChart3,
  Map,
  Users,
  Activity,
  HeartHandshake,
  X
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PanelAdministracionViewProps {
  onRouteChange?: (route: AppRoute) => void;
  patients?: PatientRecord[];
}

const COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#f43f5e', '#8b5cf6'];
const GRADIENTS = [
  { id: 'grad1', from: '#10b981', to: '#047857' },
  { id: 'grad2', from: '#38bdf8', to: '#0369a1' },
  { id: 'grad3', from: '#fbbf24', to: '#b45309' },
  { id: 'grad4', from: '#fb7185', to: '#be123c' },
];

export const PanelAdministracionView: React.FC<PanelAdministracionViewProps> = ({
  onRouteChange,
  patients = []
}) => {
  const [activeTab, setActiveTab] = useState<'graficos' | 'datos' | 'solicitudes'>('graficos');
      const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [directorios, setDirectorios] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null); // For the modal

  // Interactive filters for charts
  const [chartFilterRegion, setChartFilterRegion] = useState('Todas');
  const [chartFilterEstado, setChartFilterEstado] = useState('Todos');
  const [chartFilterApoyo, setChartFilterApoyo] = useState('Todos');

  useEffect(() => {
        const fetchSolicitudes = async () => {
      const { data } = await supabase
        .from('solicitudes_apoyo')
        .select('*, perfiles(nombre_completo, cedula, celular)');
      if (data) setSolicitudes(data);
    };
    
        const fetchDirectorios = async () => {
      // Fetch everything joined
      const { data } = await supabase.from('perfiles').select('*, datos_medicos_pacientes(*), datos_voluntarios(*)').order('created_at', { ascending: false });
      if (data) setDirectorios(data);
    };
    
    fetchSolicitudes();
    fetchDirectorios();
  }, []);

  const actualizarEstadoSolicitud = async (id: string, nuevoEstado: string) => {
    try {
      const { error } = await supabase.from('solicitudes_apoyo').update({ estado: nuevoEstado }).eq('id', id);
      if (!error) {
        setSolicitudes(solicitudes.map(s => s.id === id ? { ...s, estado: nuevoEstado } : s));
      }
    } catch(e) { console.error(e); }
  };


  // Chart Data Processing
  const chartData = useMemo(() => {
    let filtered = patients || [];
    if (chartFilterRegion !== 'Todas') filtered = filtered.filter(p => p.region === chartFilterRegion);
    if (chartFilterEstado !== 'Todos') filtered = filtered.filter(p => p.estado === chartFilterEstado);
    if (chartFilterApoyo !== 'Todos') filtered = filtered.filter(p => p.apoyo === chartFilterApoyo);

    const apoyosCount: Record<string, number> = {};
    const regionCount: Record<string, number> = {};
    const estadoCount: Record<string, number> = {};

    filtered.forEach(p => {
      apoyosCount[p.apoyo] = (apoyosCount[p.apoyo] || 0) + 1;
      regionCount[p.region] = (regionCount[p.region] || 0) + 1;
      estadoCount[p.estado] = (estadoCount[p.estado] || 0) + 1;
    });

    const apoyos = Object.keys(apoyosCount).map(k => ({ name: k, count: apoyosCount[k] }));
    const regiones = Object.keys(regionCount).map(k => ({ name: k, count: regionCount[k] }));
    const estados = Object.keys(estadoCount).map(k => ({ name: k, count: estadoCount[k] }));

    return { apoyos, regiones, estados, totalFiltered: filtered.length };
  }, [patients, chartFilterRegion, chartFilterEstado, chartFilterApoyo]);

  const handleExportarDatos = async () => {
    await triggerN8NWebhook('EVT_EXPORTAR_MAESTRO', 'Exportar Data a Google Sheets', {
      timestamp: new Date().toISOString(),
      requested_by: 'Administrador'
    });
    alert('Exportación iniciada correctamente.');
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl border border-slate-700/50">
          <p className="text-xs font-bold text-slate-200 mb-1">{label || payload[0].name}</p>
          <p className="text-sm font-black text-emerald-400">
            {payload[0].value} pacientes
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 min-w-0">
          <AsonapaqLogo size="md" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">Gestión Estratégica</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">Inteligencia de Datos y Reportes</p>
          </div>
        </div>
        <button
          onClick={handleExportarDatos}
          className="h-11 px-5 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar Excel</span>
        </button>
      </div>

      {/* Quick KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 rounded-3xl shadow-md text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] sm:text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1">Pacientes Activos</p>
            <h3 className="text-2xl sm:text-3xl font-black">{chartData.totalFiltered}</h3>
          </div>
          <Users className="absolute -bottom-4 -right-2 w-16 h-16 text-emerald-400/30 rotate-12" />
        </div>
        <div className="bg-gradient-to-br from-sky-500 to-sky-700 p-4 rounded-3xl shadow-md text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] sm:text-xs font-bold text-sky-100 uppercase tracking-wider mb-1">Apoyos Entregados</p>
            <h3 className="text-2xl sm:text-3xl font-black">{chartData.apoyos.reduce((a, b) => a + b.count, 0)}</h3>
          </div>
          <HeartHandshake className="absolute -bottom-4 -right-2 w-16 h-16 text-sky-400/30 rotate-12" />
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-4 rounded-3xl shadow-md text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] sm:text-xs font-bold text-amber-100 uppercase tracking-wider mb-1">Regiones Cubiertas</p>
            <h3 className="text-2xl sm:text-3xl font-black">{chartData.regiones.length}</h3>
          </div>
          <Map className="absolute -bottom-4 -right-2 w-16 h-16 text-amber-400/30 rotate-12" />
        </div>
        <div className="bg-gradient-to-br from-rose-500 to-rose-700 p-4 rounded-3xl shadow-md text-white relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] sm:text-xs font-bold text-rose-100 uppercase tracking-wider mb-1">En Tratamiento</p>
            <h3 className="text-2xl sm:text-3xl font-black">{chartData.estados.find(e => e.name === 'En Tratamiento ION')?.count || 0}</h3>
          </div>
          <Activity className="absolute -bottom-4 -right-2 w-16 h-16 text-rose-400/30 rotate-12" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-200/50 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('graficos')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'graficos' ? 'bg-white shadow-sm text-emerald-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Métricas e Inteligencia
        </button>
        <button
          onClick={() => setActiveTab('datos')}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'datos' ? 'bg-white shadow-sm text-emerald-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          Registros Tabulares
        </button>
      </div>

      {activeTab === 'graficos' ? (
        <div className="space-y-6">
          {/* Interactive Filters Ribbon */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Filtros Dinámicos Cruzados:</span>
            </div>
            
            <select
              value={chartFilterRegion}
              onChange={(e) => setChartFilterRegion(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer shadow-inner"
            >
              <option value="Todas">🌍 Todas las Regiones</option>
              <option value="Panamá Centro">📍 Panamá Centro</option>
              <option value="Panamá Oeste">📍 Panamá Oeste</option>
              <option value="Chiriquí">📍 Chiriquí</option>
            </select>

            <select
              value={chartFilterApoyo}
              onChange={(e) => setChartFilterApoyo(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer shadow-inner"
            >
              <option value="Todos">🤝 Todos los Apoyos</option>
              <option value="Insumos Oncológicos">💊 Insumos Oncológicos</option>
              <option value="Suplementación Nutricional">🥤 Suplementación Nutricional</option>
              <option value="Alojamiento Temporal">🏠 Alojamiento Temporal</option>
              <option value="Apoyo Psicológico">🧠 Apoyo Psicológico</option>
            </select>

            <select
              value={chartFilterEstado}
              onChange={(e) => setChartFilterEstado(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer shadow-inner"
            >
              <option value="Todos">📊 Todos los Estados</option>
              <option value="En Espera">⏳ En Espera</option>
              <option value="En Tratamiento ION">🏥 En Tratamiento ION</option>
            </select>
            
            {(chartFilterRegion !== 'Todas' || chartFilterApoyo !== 'Todos' || chartFilterEstado !== 'Todos') && (
              <button 
                onClick={() => { setChartFilterRegion('Todas'); setChartFilterApoyo('Todos'); setChartFilterEstado('Todos'); }}
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 text-[10px] font-bold transition-all uppercase tracking-wider"
              >
                <X className="w-3 h-3" />
                Limpiar Filtros
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Tipo de Apoyo (Pie) */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex flex-col mb-6">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-emerald-600" />
                  Distribución de Ayuda Social
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Haz clic en una sección para filtrar la región</p>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      {GRADIENTS.map((g, i) => (
                        <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={g.from} />
                          <stop offset="100%" stopColor={g.to} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={chartData.apoyos}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="count"
                      stroke="none"
                      onClick={(data) => setChartFilterApoyo(chartFilterApoyo === data.name ? 'Todos' : (data.name || 'Todos'))}
                      className="cursor-pointer focus:outline-none"
                    >
                      {chartData.apoyos.map((entry, index) => (
                        <Cell 
                           key={`cell-${index}`} 
                           fill={`url(#${GRADIENTS[index % GRADIENTS.length].id})`}
                           style={{
                             filter: `drop-shadow(0px 4px 6px ${GRADIENTS[index % GRADIENTS.length].to}40)`,
                             opacity: chartFilterApoyo === 'Todos' || chartFilterApoyo === entry.name ? 1 : 0.3,
                             transition: 'all 0.3s ease'
                           }}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={40} 
                      iconType="circle" 
                      wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingTop: '10px' }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Cobertura Regional (Bar) */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex flex-col mb-6">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Map className="w-5 h-5 text-sky-600" />
                  Impacto por Región
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">Haz clic en una barra para aplicar un filtro cruzado</p>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.regiones} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.5 }} content={<CustomTooltip />} />
                    <Bar 
                      dataKey="count" 
                      fill="url(#barGrad)" 
                      radius={[8, 8, 0, 0]} 
                      barSize={40}
                      onClick={(data) => setChartFilterRegion(chartFilterRegion === data.name ? 'Todas' : (data.name || 'Todas'))}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      {chartData.regiones.map((entry, index) => (
                        <Cell 
                           key={`cell-${index}`} 
                           fill="url(#barGrad)"
                           style={{
                             opacity: chartFilterRegion === 'Todas' || chartFilterRegion === entry.name ? 1 : 0.3,
                             transition: 'all 0.3s ease'
                           }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'datos' ? (
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
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.rol === 'paciente' ? 'bg-emerald-100 text-emerald-800' : 
                        u.rol === 'voluntario' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-800'
                      }`}>
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
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.estado === 'Aprobado' ? 'bg-emerald-100 text-emerald-800' : 
                        s.estado === 'Rechazado' ? 'bg-rose-100 text-rose-800' : 
                        s.estado === 'Completado' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
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
    </div>
  );
};
