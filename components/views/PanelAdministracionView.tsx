'use client';



import React, { useState, useMemo } from 'react';

import { PatientRecord, AppRoute } from '../../lib/types';

import { AsonapaqLogo } from '../AsonapaqLogo';

import { motion, AnimatePresence } from 'motion/react';

import {

  ShieldAlert,

  Search,

  RotateCcw,

  Activity,

  Users,

  Clock,

  ChevronRight,

  Lock,

  X,

  FileCheck2,

  Stethoscope,

  PieChart,

  MapPin,

  Building,

  FileSpreadsheet

} from 'lucide-react';



interface PanelAdministracionViewProps {

  patients: PatientRecord[];

  onRouteChange: (route: AppRoute) => void;

  onOpenGoogleSheets: () => void;

}



const voluntariosMock = [

  {

    id: 101,

    nombre: 'Carmen Elena Morales',

    cedía: '8-340-991',

    diagnostico: 'AcompaÃƒÂ±amiento quimioterapia',

    hospital: 'Instituto OncolÃƒÂ³gico Nacional (ION)',

    apoyo: 'Insumás OncolÃƒÂ³gicos',

    region: 'Panamá¡ Centro',

    estado: 'Activo' as const,

    fechaRegistro: '2021-03-15',

    observaciones: '48 hrs acumuladas este más Ã‚Â· ID #VN-089'

  },

  {

    id: 102,

    nombre: 'Dr. Roberto Chen Wong',

    cedía: '8-450-120',

    diagnostico: 'AsesorÃƒÂ­a TanatolÃƒÂ³gica Voluntaria',

    hospital: 'Hospital NicolÃƒÂ¡s A. Solano',

    apoyo: 'Apoyo PsicolÃƒÂ³gico',

    region: 'Panamá¡ Oeste',

    estado: 'Activo' as const,

    fechaRegistro: '2022-06-10',

    observaciones: '72 hrs acumuladas Ã‚Â· Coordinador de CÃƒÂ­rculos'

  },

  {

    id: 103,

    nombre: 'Mireya Guardado',

    cedía: '4-118-209',

    diagnostico: 'LogÃƒÂ­stica de Albergue David',

    hospital: 'Hospital Regional Dr. Rafael HernÃƒÂ¡ndez',

    apoyo: 'Alojamiento Temporal',

    region: 'ChiriquÃƒÂ­',

    estado: 'En Espera' as const,

    fechaRegistro: '2023-01-20',

    observaciones: '30 hrs acumuladas Ã‚Â· Guardía vespertina'

  }

];



export const PanelAdministracionView: React.FC<PanelAdministracionViewProps> = ({

  patients,

  onRouteChange,

  onOpenGoogleSheets

}) => {

  const [selectedKPI, setSelectedKPI] = useState<'pacientes' | 'voluntarios' | 'solicitudes'>('pacientes');

  const [searchQuery, setSearchQuery] = useState('');

  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const [filtroApoyo, setFiltroApoyo] = useState('Todos');

  const [filtroRegion, setFiltroRegion] = useState('Todas');

  const [inspectingItem, setInspectingItem] = useState<PatientRecord | null>(null);



  const activeDataSet = useMemo(() => {

    if (selectedKPI === 'pacientes') {

      return patients;

    }

    if (selectedKPI === 'voluntarios') {

      return voluntariosMock;

    }

    // solicitudes pendientes

    return patients.filter((p) => p.estado === 'En Espera');

  }, [selectedKPI, patients]);



  const filteredItems = useMemo(() => {

    return activeDataSet.filter((item) => {

      const q = searchQuery.toLowerCase().trim();

      const matchSearch =

        !q ||

        item.nombre.toLowerCase().includes(q) ||

        item.cedía.toLowerCase().includes(q) ||

        item.diagnostico.toLowerCase().includes(q);



      const matchEstado = filtroEstado === 'Todos' || item.estado === filtroEstado;

      const matchApoyo = filtroApoyo === 'Todos' || item.apoyo === filtroApoyo;

      const matchRegion = filtroRegion === 'Todas' || item.region === filtroRegion;



      return matchSearch && matchEstado && matchApoyo && matchRegion;

    });

  }, [activeDataSet, searchQuery, filtroEstado, filtroApoyo, filtroRegion]);



  const resetFilters = () => {

    setSearchQuery('');

    setFiltroEstado('Todos');

    setFiltroApoyo('Todos');

    setFiltroRegion('Todas');

  };



  const hasActiveFilters =

    searchQuery !== '' || filtroEstado !== 'Todos' || filtroApoyo !== 'Todos' || filtroRegion !== 'Todas';



  return (

    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-4 space-y-5 pb-28">

      {/* Header CoordinaciÃƒÂ³n */}

      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">

        <div className="flex items-center gap-3 min-w-0">

          <AsonapaqLogo size="sm" />

          <div className="min-w-0">

            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">

              Panel de CoordinaciÃƒÂ³n Central

            </span>

            <h2 className="text-base font-bold text-slate-900 truncate">

              Gestional

            </h2>

          </div>

        </div>



        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-200 text-xs font-bold flex-shrink-0">

          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />

          <span>En Servicio</span>

        </div>

      </div>



      {/* Google Sheets Sync Quick Access Banner */}

      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-4 rounded-3xl shadow-sm border border-emerald-800 flex items-center justify-between gap-3">

        <div className="flex items-center gap-3 min-w-0">

          <div className="w-10 h-10 rounded-2xl bg-white/10 text-emerald-300 flex items-center justify-center flex-shrink-0 border border-white/20">

            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />

          </div>

          <div className="min-w-0">

            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">

              Google Workspace Cloud

            </span>

            <h4 className="text-xs sm:text-sm font-bold text-white truncate">

              SincronizaciÃƒÂ³n con Google SheetsÃ¢â€žÂ¢

            </h4>

            <p className="text-[11px] text-slate-300 leading-snug truncate">

              Exportar base de datos y leer celdas en tiempo real.

            </p>

          </div>

        </div>



        <button

          type="button"

          onClick={onOpenGoogleSheets}

          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-xs shadow-md transition-all active:scale-95 flex-shrink-0 flex items-center gap-1"

        >

          <span>Abrir Sheets</span>

          <ChevronRight className="w-3.5 h-3.5" />

        </button>

      </div>



      {/* KPI Bento Cards */}

      <div className="space-y-2">

        <div className="flex items-center justify-between px-1">

          <h3 className="text-sm font-bold text-slate-900">MÃƒÂ©tricas Principales</h3>

          <span className="text-[11px] text-slate-500">Toque una tarjeta para explorar</span>

        </div>



        <div className="grid grid-cols-1 gap-2.5">

          {/* KPI 1: Pacientes */}

          <button

            type="button"

            onClick={() => setSelectedKPI('pacientes')}

            className={`text-left p-4 rounded-3xl transition-all border relative overflow-hidden group ${

              selectedKPI === 'pacientes'

                ? 'bg-emerald-50/70 border-emerald-600 shadow-md ring-1 ring-emerald-600'

                : 'bg-white border-slate-100 hover:border-slate-300 shadow-xs'

            }`}

          >

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">

                  <Activity className="w-5 h-5 text-emerald-700" />

                </div>

                <div>

                  <span className="text-xs text-slate-600 font-medium block">

                    Pacientes Registrados

                  </span>

                  <span className="text-2xl font-bold text-slate-900">

                    {patients.length > 7 ? patients.length + 475 : 482}

                  </span>

                </div>

              </div>

              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">

                Activos

              </span>

            </div>



            <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">

              <span className="flex items-center gap-1 text-slate-600">

                <Building className="w-3.5 h-3.5 text-emerald-700" /> Cobertura nacional ION

              </span>

              <span className="text-emerald-700 font-bold flex items-center gap-0.5">

                Explorar lista <ChevronRight className="w-3.5 h-3.5" />

              </span>

            </div>

          </button>



          {/* KPI 2: Voluntarios */}

          <button

            type="button"

            onClick={() => setSelectedKPI('voluntarios')}

            className={`text-left p-4 rounded-3xl transition-all border relative overflow-hidden group ${

              selectedKPI === 'voluntarios'

                ? 'bg-teal-50/70 border-teal-600 shadow-md ring-1 ring-teal-600'

                : 'bg-white border-slate-100 hover:border-slate-300 shadow-xs'

            }`}

          >

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">

                  <Users className="w-5 h-5 text-teal-700" />

                </div>

                <div>

                  <span className="text-xs text-slate-600 font-medium block">

                    Voluntarios Activos

                  </span>

                  <span className="text-2xl font-bold text-slate-900">126</span>

                </div>

              </div>

              <span className="text-xs bg-teal-100 text-teal-800 font-bold px-2.5 py-0.5 rounded-full">

                Disponibles

              </span>

            </div>



            <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">

              <span className="flex items-center gap-1 text-slate-600">

                <Building className="w-3.5 h-3.5 text-teal-700" /> Brigadas y acompañamiento

              </span>

              <span className="text-teal-700 font-bold flex items-center gap-0.5">

                Explorar lista <ChevronRight className="w-3.5 h-3.5" />

              </span>

            </div>

          </button>



          {/* KPI 3: Solicitudes Pendientes */}

          <button

            type="button"

            onClick={() => setSelectedKPI('solicitudes')}

            className={`text-left p-4 rounded-3xl transition-all border relative overflow-hidden group ${

              selectedKPI === 'solicitudes'

                ? 'bg-rose-50/70 border-rose-600 shadow-md ring-1 ring-rose-600'

                : 'bg-white border-slate-100 hover:border-slate-300 shadow-xs'

            }`}

          >

            <div className="flex items-start justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center flex-shrink-0">

                  <Clock className="w-5 h-5 text-rose-600" />

                </div>

                <div>

                  <span className="text-xs text-slate-600 font-medium block">

                    Solicitudes Pendientes

                  </span>

                  <span className="text-2xl font-bold text-slate-900">18</span>

                </div>

              </div>

              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full">

                Por evaluar

              </span>

            </div>



            <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs text-slate-500">

              <span className="flex items-center gap-1 text-slate-600">

                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Alojamiento e insumos crÃƒÂ­ticos

              </span>

              <span className="text-rose-700 font-bold flex items-center gap-0.5">

                Explorar lista <ChevronRight className="w-3.5 h-3.5" />

              </span>

            </div>

          </button>

        </div>

      </div>



      {/* BÃƒÂºsqueda y Filtros DinÃƒÂ¡más */}

      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3.5">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Search className="w-4 h-4 text-emerald-700" />

            <span className="text-sm font-bold text-slate-900">Filtros DinÃƒÂ¡más</span>

          </div>

          {hasActiveFilters && (

            <button

              type="button"

              onClick={resetFilters}

              className="text-xs text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 transition-colors"

            >

              <RotateCcw className="w-3.5 h-3.5" /> Limpiar

            </button>

          )}

        </div>



        {/* Input bÃƒÂºsqueda */}

        <div className="relative w-full">

          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

          <input

            type="text"

            value={searchQuery}

            onChange={(e) => setSearchQuery(e.target.value)}

            placeholder="Buscar por nombre, cÃƒÂ©día o diagnÃƒÂ³stico..."

            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"

          />

        </div>



        {/* Chips Estado */}

        <div className="space-y-1">

          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">

            Estado de AtenciÃƒÂ³n

          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">

            {['Todos', 'Activo', 'En Espera', 'En Tratamiento ION', 'Alta MÃƒÂ©día'].map((est) => (

              <button

                key={est}

                type="button"

                onClick={() => setFiltroEstado(est)}

                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${

                  filtroEstado === est

                    ? 'bg-emerald-700 text-white font-bold'

                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'

                }`}

              >

                {est}

              </button>

            ))}

          </div>

        </div>



        {/* Chips Tipo de Apoyo */}

        <div className="space-y-1">

          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">

            Tipo de Apoyo

          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">

            {['Todos', 'Insumás OncolÃƒÂ³gicos', 'Apoyo PsicolÃƒÂ³gico', 'SuplementaciÃƒÂ³n Nutricional', 'Alojamiento Temporal'].map(

              (ap) => (

                <button

                  key={ap}

                  type="button"

                  onClick={() => setFiltroApoyo(ap)}

                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${

                    filtroApoyo === ap

                      ? 'bg-emerald-700 text-white font-bold'

                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'

                  }`}

                >

                  {ap}

                </button>

              )

            )}

          </div>

        </div>



        {/* Chips Provincia / RegiÃƒÂ³n */}

        <div className="space-y-1">

          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">

            Provincia / RegiÃƒÂ³n

          </span>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">

            {['Todas', 'Panamá¡ Centro', 'Panamá¡ Oeste', 'ChiriquÃƒÂ­', 'Veraguas', 'CoclÃƒÂ©', 'ColÃƒÂ³n', 'Azuero'].map(

              (reg) => (

                <button

                  key={reg}

                  type="button"

                  onClick={() => setFiltroRegion(reg)}

                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${

                    filtroRegion === reg

                      ? 'bg-emerald-700 text-white font-bold'

                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'

                  }`}

                >

                  {reg}

                </button>

              )

            )}

          </div>

        </div>

      </div>



      {/* Listado de Registros Reactivos */}

      <div className="space-y-3">

        <div className="flex items-center justify-between px-1">

          <div className="flex items-center gap-2">

            <FileCheck2 className="w-4 h-4 text-emerald-700" />

            <h3 className="text-sm font-bold text-slate-900">

              {selectedKPI === 'pacientes'

                ? 'Expedientes de Pacientes'

                : selectedKPI === 'voluntarios'

                ? 'Cuerpo de Voluntarios'

                : 'Solicitudes en Espera'}

            </h3>

          </div>

          <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-semibold">

            {filteredItems.length} encontrados

          </span>

        </div>



        <div className="space-y-2.5">

          {filteredItems.length === 0 ? (

            <div className="bg-white p-8 rounded-3xl text-center border border-slate-100 space-y-2">

              <p className="text-sm font-bold text-slate-700">Sin registros encontrados</p>

              <p className="text-xs text-slate-500">

                Ningún registro coincide con los criterios de bÃƒÂºsqueda o filtro seleccionados.

              </p>

              <button

                type="button"

                onClick={resetFilters}

                className="mt-2 text-xs font-bold text-emerald-700 underline"

              >

                Restablecer filtros

              </button>

            </div>

          ) : (

            filteredItems.map((item) => (

              <motion.div

                key={item.id}

                layout

                initial={{ opacity: 0, y: 4 }}

                animate={{ opacity: 1, y: 0 }}

                className="bg-white p-4 rounded-3xl shadow-xs border border-slate-100 space-y-2.5 hover:shadow-md transition-shadow text-left"

              >

                <div className="flex items-start justify-between gap-2">

                  <div>

                    <h4 className="text-sm font-bold text-slate-900 block">{item.nombre}</h4>

                    <span className="text-[11px] text-slate-400 font-mono">

                      CÃƒÂ©día: {item.cedía}

                    </span>

                  </div>

                  <span

                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${

                      item.estado.includes('Tratamiento')

                        ? 'bg-emerald-100 text-emerald-800'

                        : item.estado === 'Activo'

                        ? 'bg-teal-100 text-teal-800'

                        : 'bg-amber-100 text-amber-800'

                    }`}

                  >

                    {item.estado}

                  </span>

                </div>



                <div className="bg-slate-50 p-2.5 rounded-2xl flex flex-col gap-0.5 text-xs">

                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">

                    <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />

                    {item.diagnostico}

                  </span>

                  <span className="text-[11px] text-slate-500">

                    {item.hospital} Ã‚Â· {item.region}

                  </span>

                </div>



                <div className="flex items-center justify-between pt-1">

                  <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-medium">

                    {item.apoyo}

                  </span>

                  <button

                    type="button"

                    onClick={() => setInspectingItem(item)}

                    className="py-1.5 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1 transition-colors"

                  >

                    <Lock className="w-3 h-3 text-emerald-700" />

                    <span>Ver Expediente</span>

                  </button>

                </div>

              </motion.div>

            ))

          )}

        </div>

      </div>



      {/* Resumen de Impacto: DistribuciÃƒÂ³n Social del más */}

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3.5">

        <div className="flex items-center justify-between">

          <div>

            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">

              Resumen de Impacto

            </span>

            <h3 className="text-sm font-bold text-slate-900">DistribuciÃƒÂ³n Social del más</h3>

          </div>

          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">

            <PieChart className="w-4 h-4" />

          </div>

        </div>



        <div className="space-y-2.5">

          {/* Item 1 */}

          <div className="space-y-1">

            <div className="flex items-center justify-between text-xs">

              <span className="font-semibold text-slate-800 flex items-center gap-1.5">

                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />

                Kits de quimioterapia & médicaciÃƒÂ³n

              </span>

              <span className="font-bold text-slate-900">54%</span>

            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

              <div className="h-full bg-emerald-700 rounded-full" style={{ width: '54%' }} />

            </div>

          </div>



          {/* Item 2 */}

          <div className="space-y-1">

            <div className="flex items-center justify-between text-xs">

              <span className="font-semibold text-slate-800 flex items-center gap-1.5">

                <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />

                Suplementos & Batidos Proteicos

              </span>

              <span className="font-bold text-slate-900">26%</span>

            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

              <div className="h-full bg-teal-600 rounded-full" style={{ width: '26%' }} />

            </div>

          </div>



          {/* Item 3 */}

          <div className="space-y-1">

            <div className="flex items-center justify-between text-xs">

              <span className="font-semibold text-slate-800 flex items-center gap-1.5">

                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />

                Alojamiento & Transporte Provincias

              </span>

              <span className="font-bold text-slate-900">20%</span>

            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

              <div className="h-full bg-slate-600 rounded-full" style={{ width: '20%' }} />

            </div>

          </div>

        </div>



        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">

          <span className="text-slate-500 font-medium">

            342 apoyos directos en 2025

          </span>

          <button

            type="button"

            onClick={() => onRouteChange('auditoría_social')}

            className="text-emerald-700 font-bold hover:underline"

          >

            Auditoría Social Ã¢â€ â€™

          </button>

        </div>

      </div>



      {/* Guardias de AcompaÃƒÂ±amiento Office Card */}

      <div className="bg-slate-100/80 p-4 rounded-3xl border border-slate-200/60 flex items-center gap-3.5">

        <img

          src="httpúblic/AB6AXuAT9cspXP5Io08LID2QWRRad-0EawA7RZggzxsY0p6Nn_jUe7kjhiM1ylrkFEC864xcYNZtPz11JExFP7EbgjrmHL6ZhU6fYFuiIYGAst5OlPmyABVSEzHtsnb3LrFpVirFlJ6J10vfFPz4im8IBVRmfOIw5RK8tN6K4OY0zufiTR7iqLRLrB3Tx5XjuNCjS9NMl-q2klLYdbOfcocUedwVG3pd2jWCZltp9YXRfx8Xy2VbEq0yfQI5qA"

          alt="Oficina de ASONAPAQ en Panamá¡"

          className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 border border-slate-200"

        />

        <div className="min-w-0">

          <span className="text-xs font-bold text-slate-900 block truncate">

            Guardias de AcompaÃƒÂ±amiento

          </span>

          <p className="text-[11px] text-slate-600 leading-snug">

            CoordinaciÃƒÂ³n central en Ciudad de Panamá¡. Turnos activos para visitas domiciliarias e ION.

          </p>

        </div>

      </div>



      {/* Modal: Expediente Humanitario Seguro */}

      <AnimatePresence>

        {inspectingItem && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">

            <motion.div

              initial={{ scale: 0.9, opacity: 0 }}

              animate={{ scale: 1, opacity: 1 }}

              exit={{ scale: 0.9, opacity: 0 }}

              className="bg-white w-full max-w-2xl p-6 rounded-3xl shadow-2xl border border-slate-100 space-y-4 text-left"

            >

              <div className="flex items-center justify-between pb-2 border-b border-slate-100">

                <div className="flex items-center gap-2">

                  <AsonapaqLogo size="xs" />

                  <h4 className="text-sm font-bold text-slate-900">

                    Expediente Humanitario Seguro

                  </h4>

                </div>

                <button

                  type="button"

                  onClick={() => setInspectingItem(null)}

                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"

                >

                  <X className="w-4 h-4" />

                </button>

              </div>



              <div className="bg-slate-50 p-3.5 rounded-2xl space-y-1.5 text-xs">

                <div className="flex justify-between">

                  <span className="text-slate-500">Nombre Completo:</span>

                  <span className="font-bold text-slate-900">{inspectingItem.nombre}</span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">CÃƒÂ©día:</span>

                  <span className="font-mono font-semibold text-slate-800">

                    {inspectingItem.cedía}

                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">RegiÃƒÂ³n:</span>

                  <span className="font-medium text-slate-800">{inspectingItem.region}</span>

                </div>

                <div className="flex justify-between">

                  <span className="text-slate-500">DiagnÃƒÂ³stico:</span>

                  <span className="font-bold text-emerald-800">

                    {inspectingItem.diagnostico}

                  </span>

                </div>

              </div>



              <div className="space-y-1 text-xs text-slate-600">

                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">

                  Historial de Asistencia

                </span>

                <div className="p-3 bg-slate-50 rounded-2xl space-y-1">

                  <p>

                    <strong>Hospital:</strong> {inspectingItem.hospital}

                  </p>

                  <p>

                    <strong>Beneficio Vigente:</strong> {inspectingItem.apoyo}

                  </p>

                  <p>

                    <strong>Estado ClÃƒÂ­nico:</strong> {inspectingItem.estado}

                  </p>

                  {inspectingItem.observaciones && (

                    <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">

                      <em>Notas: {inspectingItem.observaciones}</em>

                    </p>

                  )}

                </div>

              </div>



              <button

                type="button"

                onClick={() => setInspectingItem(null)}

                className="w-full h-11 bg-emerald-700 text-white font-bold rounded-full text-xs shadow-md transition-colors"

              >

                Cerrar Expediente Seguro

              </button>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </div>

  );

};











