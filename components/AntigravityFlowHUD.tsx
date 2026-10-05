'use client';



import React, { useState } from 'react';

import { triggerN8NWebhook } from '../lib/store';

import { WebhookLogEntry } from '../lib/types';

import { AsonapaqLogo } from './AsonapaqLogo';

import { motion, AnimatePresence } from 'motion/react';

import {

  Code2,

  GitFork,

  Webhook,

  Database,

  Copy,

  Check,

  Play,

  Download,

  X,

  ExternalLink,

  Terminal,

  Zap,

  Layers,

  ArrowRight

} from 'lucide-react';



interface AntigravityFlowHUDProps {

  isOpen: boolean;

  onClose: () => void;

  rawJsonContent: string;

}



export const AntigravityFlowHUD: React.FC<AntigravityFlowHUDProps> = ({

  isOpen,

  onClose,

  rawJsonContent

}) => {

  const [activeTab, setActiveTab] = useState<'diagrama' | 'json' | 'webhooks' | 'estado'>('diagrama');

  const [copied, setCopied] = useState(false);

  const [selectedWebhookEvent, setSelectedWebhookEvent] = useState('EVT_REGISTRAR_SOLICITUD_PACIENTE');

  const [isFiringWebhook, setIsFiringWebhook] = useState(false);

  const [lastExecutedLog, setLastExecutedLog] = useState<WebhookLogEntry | null>(null);



  const webhookOptions = [

    {

      id: 'EVT_REGISTRAR_SOLICITUD_PACIENTE',

      name: 'Registrar Solicitud Paciente (Insumás/NutriciÃƒÂ³n)',

      method: 'POST',

      samplePayload: {

        tipo_requerimiento: 'insumos_oncológicos',

        nombre_paciente: 'MarÃƒÂ­a Antonia Castillo',

        cedula_paciente: '8-765-4321',

        hospital_paciente: 'Instituto OncolÃƒÂ³gico Nacional (ION)',

        detalle_solicitud: 'Agujas Huber 20G y apÃƒÂ³sitos de clorhexidía',

        consentimiento_ley_81: true

      }

    },

    {

      id: 'EVT_HABEAS_DATA_ELIMINACION',

      name: 'HÃƒÂ¡beas día: EliminaciÃƒÂ³n Definitiva (Ley 81 Panamá¡)',

      method: 'POST',

      samplePayload: {

        event_type: 'HABEAS_DATA_PURGE_REQUEST',

        cedula_paciente: '8-765-4321',

        médicos',

        legal_basis: 'Ley 81 de 2019 día República de Panamá¡'

      }

    },

    {

      id: 'EVT_CHECKIN_HOSPITAL_ION',

      name: 'Registrar Llegada Guardía ION (Voluntario)',

      method: 'POST',

      samplePayload: {

        volunteer_id: 'VN-089',

        volunteer_name: 'Carmen Elena Morales',

        hospital_zone: 'SALA_quimioterapia_AMBULATORIA_ION',

        checkin_time: new Date().toISOString()

      }

    },

    {

      id: 'EVT_POSTULACION_VOLUNTARIO',

      name: 'PostulaciÃƒÂ³n Nuevo Voluntario (Chalecos Verdes)',

      method: 'POST',

      samplePayload: {

        nombre_completo: 'Ana Victoria Batista',

        cedía: '8-890-1234',

        telefono_whatsapp: '+507 6234-5678',

        compromiso_bioseguridad_ion: true

      }

    },

    {

      id: 'EVT_públicAR_TESTIMONIO_MURO',

      name: 'públicar Testimonio en Muro Comunitario',

      method: 'POST',

      samplePayload: {

        author: 'Elena Arias',

        content: 'Ã‚Â¡ToquÃƒÂ© la campana tras 12 ciclos de quimioterapia en el ION!',

        moderation_status: 'PENDING_REVIEW'

      }

    },

    {

      id: 'EVT_ACTUALIZAR_DISPONIBILIDAD_VOLUNTARIO',

      name: 'Actualizar Disponibilidad Semanal de Guardias',

      method: 'POST',

      samplePayload: {

        volunteer_id: 'VN-089',

        dias: ['lunes', 'martes', 'jueves', 'sabado'],

        turnos: ['matutino', 'vespertino']

      }

    }

  ];



  const handleCopyJson = () => {

    navigator.clipboard.writeText(rawJsonContent);

    setCopied(true);

    setTimeout(() => setCopied(false), 2500);

  };



  const handleDownloadJson = () => {

    const blob = new Blob([rawJsonContent], { type: 'application/json' });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');

    a.href = url;

    a.download = 'navigation_flow.json';

    a.click();

    URL.revokeObjectURL(url);

  };



  const handleFireTestWebhook = async () => {

    const selected = webhookOptions.find((w) => w.id === selectedWebhookEvent);

    if (!selected) return;



    setIsFiringWebhook(true);

    const result = await triggerN8NWebhook(

      selected.id,

      selected.name,

      selected.samplePayload

    );

    setIsFiringWebhook(false);

    setLastExecutedLog(result);

  };



  if (!isOpen) return null;



  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">

      <motion.div

        initial={{ opacity: 0, scale: 0.95, y: 15 }}

        animate={{ opacity: 1, scale: 1, y: 0 }}

        exit={{ opacity: 0, scale: 0.95, y: 15 }}

        transition={{ duration: 0.2 }}

        className="bg-[#0B1120] text-slate-100 w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl border border-slate-700/80 flex flex-col overflow-hidden"

      >

        {/* Modal Top Bar */}

        <div className="p-4 sm:p-5 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">

              <Zap className="w-5 h-5 text-emerald-400" />

            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <span className="font-bold text-sm sm:text-base text-white tracking-tight truncate">

                  Antigravity 2.0 Engine Ã‚Â· Technical Architecture HUD

                </span>

                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">

                  navigation_flow.json

                </span>

              </div>

              <p className="text-[11px] text-slate-400 truncate">

                EspecificaciÃƒÂ³n formal de flujo dinÃƒÂ¡mico, persistencia de estado y catÃƒÂ¡logo de triggers n8n para ASONAPAQ.

              </p>

            </div>

          </div>



          <button

            type="button"

            onClick={onClose}

            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors flex-shrink-0"

          >

            <X className="w-4 h-4" />

          </button>

        </div>



        {/* HUD Subnav Tabs */}

        <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0D1527] border-b border-slate-800/80 overflow-x-auto scrollbar-none">

          {[

            { id: 'diagrama', label: '1. Diagrama de Rutas', icon: GitFork },

            { id: 'json', label: '2. JSON navigation_flow', icon: Code2 },

            { id: 'webhooks', label: '3. Simulador Webhooks n8n', icon: Webhook },

            { id: 'estado', label: '4. Persistencia de Estado', icon: Database }

          ].map((tab) => {

            const isActive = activeTab === tab.id;

            return (

              <button

                key={tab.id}

                type="button"

                onClick={() => setActiveTab(tab.id as any)}

                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${

                  isActive

                    ? 'bg-emerald-600 text-white shadow-sm'

                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'

                }`}

              >

                <tab.icon className="w-3.5 h-3.5" />

                <span>{tab.label}</span>

              </button>

            );

          })}

        </div>



        {/* HUD Main Content Area */}

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto font-sans">

          {/* TAB 1: DIAGRAMA DE RUTAS */}

          {activeTab === 'diagrama' && (

            <div className="space-y-6">

              <div className="space-y-1">

                <h3 className="text-sm font-bold text-white flex items-center gap-2">

                  <Layers className="w-4 h-4 text-emerald-400" />

                  Matriz de NavegaciÃƒÂ³n y Rutas DinÃƒÂ¡más (7 Rutas de ASONAPAQ)

                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">

                  El agente de Antigravity 2.0 conecta todas las vistas a travÃƒÂ©s de transiciones animás con preservaciÃƒÂ³n de contexto en cliente.

                </p>

              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {[

                  {

                    route: 'inicio_pública',

                    path: '/',

                    name: 'Inicio Pública',

                    role: 'Público General',

                    description: 'Acogida, historia desde 1989, pilares de ayuda y selector dinÃƒÂ¡mico de roles.',

                    leadsTo: ['portal_pacientes', 'portal_voluntarios', 'muro_comunicaciones', 'auditoría_social']

                  },

                  {

                    route: 'portal_pacientes',

                    path: '/paciente',

                    name: 'Portal del Paciente',

                    role: 'Pacientes & Cuidadores',

                    description: 'Llamada ION 512-7000, solicitud de insumos, guÃƒÂ­a nutricional y HÃƒÂ¡beas día (Ley 81).',

                    leadsTo: ['inicio_pública', 'muro_comunicaciones', 'portal_voluntarios']

                  },

                  {

                    route: 'portal_voluntarios',

                    path: '/voluntario',

                    name: 'Portal del Voluntario',

                    role: 'Chalecos Verdes & Aspirantes',

                    description: 'Horas acumuladas, check-in en ION, jornadas grupales y gestión de turnos.',

                    leadsTécnica']

                  },

                  {

                    route: 'panel_administracion',

                    path: '/admin',

                    name: 'Panel de AdministraciÃƒÂ³n',

                    role: 'CoordinaciÃƒÂ³n & Trabajo Social',

                    description: '482 pacientes, 126 voluntarios, filtros por provincia panameÃƒÂ±a y expediente médico seguro.',

                    leadsTécnica', 'inicio_pública']

                  },

                  {

                    route: 'muro_comunicaciones',

                    path: '/comunidad',

                    name: 'Muro de Fe, Esperanza y Vida',

                    role: 'Comunidad ASONAPAQ',

                    description: 'Campana día victoria, entregas en ION, talleres y moderaciÃƒÂ³n pastoral.',

                    leadsTo: ['inicio_pública', 'portal_pacientes', 'portal_voluntarios']

                  },

                  {

                    route: 'auditoría_social',

                    path: '/auditoría',

                    name: 'Auditoría Social & Transparencia',

                    role: 'Público & Donantes',

                    description: '342 apoyos directos en 2025, personerÃƒÂ­a jurÃƒÂ­día de 1989 y memorias fiscales.',

                    leadsTo: ['pública']

                  },

                  {

                    routécnica',

                    patécnica',

                    name: 'Juntécnica & ComitÃƒÂ© OncolÃƒÂ³gico',

                    role: 'ComitÃƒÂ© MÃƒÂ©dico Asesor',

                    descriptécnicas de agujas Huber, suplementos en caquí y bioseguridad.',

                    leadsTo: ['panel_administracion', 'portal_pacientes']

                  }

                ].map((item) => (

                  <div

                    key={item.route}

                    className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5"

                  >

                    <div className="flex items-center justify-between">

                      <span className="font-mono text-xs font-bold text-emerald-400">

                        {item.path}

                      </span>

                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">

                        {item.role}

                      </span>

                    </div>

                    <h4 className="text-sm font-bold text-white">{item.name}</h4>

                    <p className="text-xs text-slate-400">{item.description}</p>

                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center gap-1.5 flex-wrap text-[11px]">

                      <span className="text-slate-500 font-medium">Transiciona a:</span>

                      {item.leadsTo.map((lt) => (

                        <span

                          key={lt}

                          className="bg-emerald-950/60 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-500/20"

                        >

                          {lt}

                        </span>

                      ))}

                    </div>

                  </div>

                ))}

              </div>

            </div>

          )}



          {/* TAB 2: RAW JSON NAVIGATION_FLOW */}

          {activeTab === 'json' && (

            <div className="space-y-4">

              <div className="flex items-center justify-between gap-3">

                <div>

                  <h3 className="text-sm font-bold text-white">

                    navigation_flow.json (Contenido Completo)

                  </h3>

                  <p className="text-xs text-slate-400">

                    Archivo ubicado en la raÃƒÂ­z del repositorio, listo para ser consumido por Antigravity 2.0.

                  </p>

                </div>



                <div className="flex items-center gap-2">

                  <button

                    type="button"

                    onClick={handleCopyJson}

                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"

                  >

                    {copied ? (

                      <>

                        <Check className="w-3.5 h-3.5 text-emerald-400" />

                        <span>Copiado!</span>

                      </>

                    ) : (

                      <>

                        <Copy className="w-3.5 h-3.5" />

                        <span>Copiar JSON</span>

                      </>

                    )}

                  </button>



                  <button

                    type="button"

                    onClick={handleDownloadJson}

                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors"

                  >

                    <Download className="w-3.5 h-3.5" />

                    <span>Descargar</span>

                  </button>

                </div>

              </div>



              {/* Syntax Highlighted JSON Preview Container */}

              <div className="rounded-2xl bg-[#030712] border border-slate-800 p-4 font-mono text-xs overflow-x-auto text-emerald-300 max-h-[60vh] leading-relaxed selection:bg-emerald-800 selection:text-white">

                <pre>{rawJsonContent}</pre>

              </div>

            </div>

          )}



          {/* TAB 3: SIMULADOR WEBHOOKS N8N */}

          {activeTab === 'webhooks' && (

            <div className="space-y-5">

              <div className="space-y-1">

                <h3 className="text-sm font-bold text-white flex items-center gap-2">

                  <Terminal className="w-4 h-4 text-emerald-400" />

                  Banco de Pruebas de Webhooks n8n

                </h3>

                <p className="text-xs text-slate-400">

                  Prueba en vivo la emisiÃƒÂ³n de eventos desdía interfaz hacia los endpoints webhook de n8n.

                </p>

              </div>



              {/* Event Selector */}

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">

                <label className="text-xs font-bold text-slate-300 block">

                  Selecciona el Trigger a Ejecutar:

                </label>

                <select

                  value={selectedWebhookEvent}

                  onChange={(e) => {

                    setSelectedWebhookEvent(e.target.value);

                    setLastExecutedLog(null);

                  }}

                  className="w-full h-11 px-3.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"

                >

                  {webhookOptions.map((opt) => (

                    <option key={opt.id} value={opt.id}>

                      [{opt.method}] {opt.id} Ã¢â‚¬â€ {opt.name}

                    </option>

                  ))}

                </select>



                <div className="pt-2">

                  <button

                    type="button"

                    disabled={isFiringWebhook}

                    onClick={handleFireTestWebhook}

                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-98 transition-all disabled:opacity-50"

                  >

                    <Play className="w-3.5 h-3.5 fill-current" />

                    <span>

                      {isFiringWebhook ? 'Transmitiendo HTTP POST...' : 'Disparar Webhook Simulado'}

                    </span>

                  </button>

                </div>

              </div>



              {/* Execution Result Log */}

              {lastExecutedLog && (

                <div className="p-4 rounded-2xl bg-[#030712] border border-slate-800 space-y-3 font-mono text-xs">

                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">

                    <div className="flex items-center gap-2">

                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />

                      <span className="font-bold text-emerald-400">

                        200 OK Ã¢â‚¬â€ TransmisiÃƒÂ³n Exitosa

                      </span>

                    </div>

                    <span className="text-[10px] text-slate-500">

                      Latencia: 320ms Ã‚Â· {lastExecutedLog.timestamp}

                    </span>

                  </div>



                  <div className="space-y-1">

                    <span className="text-slate-500 text-[11px] block">Endpoint Invocado:</span>

                    <p className="text-slate-300 break-all">{lastExecutedLog.url}</p>

                  </div>



                  <div className="space-y-1">

                    <span className="text-slate-500 text-[11px] block">Payload Enviado:</span>

                    <pre className="p-3 bg-slate-950 rounded-xl text-teal-300 text-[11px] overflow-x-auto">

                      {JSON.stringify(lastExecutedLog.payload, null, 2)}

                    </pre>

                  </div>



                  <div className="space-y-1">

                    <span className="text-slate-500 text-[11px] block">

                      Respuesta del Motor n8n:

                    </span>

                    <pre className="p-3 bg-slate-950 rounded-xl text-emerald-400 text-[11px] overflow-x-auto">

                      {JSON.stringify(lastExecutedLog.response, null, 2)}

                    </pre>

                  </div>

                </div>

              )}

            </div>

          )}



          {/* TAB 4: PERSISTENCIA DE ESTADO */}

          {activeTab === 'estado' && (

            <div className="space-y-5">

              <div className="space-y-1">

                <h3 className="text-sm font-bold text-white flex items-center gap-2">

                  <Database className="w-4 h-4 text-emerald-400" />

                  Monitor de Persistencia de Estado

                </h3>

                <p className="text-xs text-slate-400">

                  Estructuras de datos que se mantienen vivas entre sesiónes y rutas para ASONAPAQ.

                </p>

              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">

                  <span className="font-mono text-emerald-400 font-bold block">

                    asonapaq_v2_auth_session

                  </span>

                  <p className="text-slate-400">

                    Almacena el rol activo del usuario, credenciales temporales, zona asignada y permás de acceso.

                  </p>

                  <div className="p-2 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300">

                    {'role: "paciente" | "voluntario" | "admin"'}

                  </div>

                </div>



                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">

                  <span className="font-mono text-emerald-400 font-bold block">

                    asonapaq_v2_patients_cache

                  </span>

                  <p className="text-slate-400">

                    ColecciÃƒÂ³n cifrada localmente de expedientes oncológicos para permitir consultas y bÃƒÂºsquedas instantÃƒÂ¡neas sin lag.

                  </p>

                  <div className="p-2 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300">

                    total: 482 registros activos en ION

                  </div>

                </div>



                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">

                  <span className="font-mono text-emerald-400 font-bold block">

                    asonapaq_v2_volunteers_cache

                  </span>

                  <p className="text-slate-400">

                    Perfil de Carmen Elena Morales, horas acumuladas (+48h), turnos confirmás y jornadas asistidas.

                  </p>

                  <div className="p-2 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300">

                    {'volunteer_id: "VN-089"'}

                  </div>

                </div>



                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">

                  <span className="font-mono text-emerald-400 font-bold block">

                    asonapaq_v2_community_wall

                  </span>

                  <p className="text-slate-400">

                    Reacciones de corazÃƒÂ³n (Me Gusta), comentarios públicados en tiempo real y banderas de moderaciÃƒÂ³n pastoral.

                  </p>

                  <div className="p-2 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300">

                    públicaciones

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </motion.div>

    </div>

  );

};







