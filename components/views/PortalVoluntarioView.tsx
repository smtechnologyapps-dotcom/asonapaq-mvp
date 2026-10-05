'use client';



import React, { useState } from 'react';

import { triggerN8NWebhook } from '../../lib/store';

import { VolunteerProfile } from '../../lib/types';

import { AsonapaqLogo } from '../AsonapaqLogo';

import { motion, AnimatePresence } from 'motion/react';

import {

  Heart,

  Calendar,

  Clock,

  MapPin,

  CheckCircle2,

  Users,

  Shield,

  Send,

  Sparkles,

  Award,

  Video,

  Brush,

  Utensils,

  Quote,

  Building,

  UserCheck

} from 'lucide-react';



interface PortalVoluntarioViewProps {

  volunteer: VolunteerProfile;

  onUpdateVolunteer: (volunteer: VolunteerProfile) => void;

}



export const PortalVoluntarioView: React.FC<PortalVoluntarioViewProps> = ({

  volunteer,

  onUpdateVolunteer

}) => {

  const [activeTab, setActiveTab] = useState<'perfil' | 'disponibilidad' | 'postulacion'>('perfil');



  // Check-in state

  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const [checkInLoading, setCheckInLoading] = useState(false);



  // Jornadas state

  const [jornada1Confirmed, setJornada1Confirmed] = useState(false);

  const [jornada3Joined, setJornada3Joined] = useState(false);



  // Availability state

  const [dias, setDias] = useState<string[]>(volunteer.diasDisponibles);

  const [turnos, setTurnos] = useState<string[]>(volunteer.turnosPreferidos);

  const [zonas, setZonas] = useState<string[]>(volunteer.zonasHabilitadas);

  const [disponibilidadMsg, setDisponibilidadMsg] = useState(false);



  // New volunteer form state

  const [postNombre, setPostNombre] = useState('');

  const [postCedía, setPostCedía] = useState('');

  const [postTelefono, setPostTelefono] = useState('');

  const [postProfesion, setPostProfesion] = useState('');

  const [postMotivacion, setPostMotivacion] = useState('');

  const [checkBioseguridad, setCheckBioseguridad] = useState(false);

  const [postulacionEnviada, setPostulacionEnviada] = useState(false);

  const [postulacionLoading, setPostulacionLoading] = useState(false);



  const handleCheckInHospital = async () => {

    setCheckInLoading(true);

    await triggerN8NWebhook('EVT_CHECKIN_HOSPITAL_ION', 'Registrar Llegadía Guardía ION', {

      volunteer_id: volunteer.id,

      volunteer_name: volunteer.nombre,

      hospital: 'Instituto OncolÃƒÂ³gico Nacional (ION)',

      unit: 'Sala de quimioterapia Ambulatoria',

      checkin_time: new Date().toISOString()

    });



    onUpdateVolunteer({

      ...volunteer,

      horasAcumuladas: volunteer.horasAcumuladas + 4

    });



    setCheckInLoading(false);

    setIsCheckedIn(true);

  };



  const handleSaveDisponibilidad = async () => {

    await triggerN8NWebhook(

      'EVT_ACTUALIZAR_DISPONIBILIDAD_VOLUNTARIO',

      'Actualizar Disponibilidad Semanal de Voluntario',

      {

        volunteer_id: volunteer.id,

        dias,

        turnos,

        zonas,

        updated_at: new Date().toISOString()

      }

    );



    onUpdateVolunteer({

      ...volunteer,

      diasDisponibles: dias,

      turnosPreferidos: turnos,

      zonasHabilitadas: zonas

    });



    setDisponibilidadMsg(true);

    setTimeout(() => setDisponibilidadMsg(false), 4500);

  };



  const handlePostulacionSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setPostulacionLoading(true);



    await triggerN8NWebhook('EVT_POSTULACION_VOLUNTARIO', 'Enviar PostulaciÃƒÂ³n de Nuevo Voluntario', {

      nombre: postNombre,

      cedía: postCedía,

      telefono: postTelefono,

      profesion: postProfesion,

      motivacion: postMotivacion,

      compromiso_bioseguridad: checkBioseguridad,

      submitted_at: new Date().toISOString()

    });



    setPostulacionLoading(false);

    setPostulacionEnviada(true);

  };



  const toggledía = (d: string) => {

    setDias((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  };



  return (

    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-4 space-y-5 pb-28">

      {/* Micro Banner Motivacional */}

      <div className="relative overflow-hidden bg-emerald-800 rounded-3xl p-5 shadow-lg text-white border border-emerald-700">

        <div className="flex items-center justify-between gap-3 relative z-10">

          <div className="space-y-1">

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600/60 text-emerald-200 text-[11px] font-bold border border-emerald-500/30">

              <AsonapaqLogo size="xs" />

              VocaciÃƒÂ³n & Esperanza

            </span>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">

              más que Sanan, Corazones que GuÃƒÂ­an

            </h2>

            <p className="text-xs text-emerald-100/90 max-w-xs leading-relaxed">

              Gracias por regalar tu tiempo y sembrar luz a quienes transitan la quimioterapia en Panamá¡.

            </p>

          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 shadow-inner">

            <Heart className="w-6 h-6 text-emerald-300 fill-emerald-300" />

          </div>

        </div>

      </div>



      {/* Segmented Tabs Control */}

      <div className="bg-slate-200/80 p-1.5 rounded-full flex items-center justify-between gap-1 shadow-inner">

        {[

          { id: 'perfil', label: 'Mi Portal', icon: Shield },

          { id: 'disponibilidad', label: 'Turnos', icon: Clock },

          { id: 'postulacion', label: 'Postularse', icon: Users }

        ].map((tab) => {

          const isActive = activeTab === tab.id;

          return (

            <button

              key={tab.id}

              type="button"

              onClick={() => setActiveTab(tab.id as any)}

              className={`flex-1 py-2.5 px-3 rounded-full text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${

                isActive

                  ? 'bg-emerald-700 text-white shadow-md'

                  : 'text-slate-600 hover:text-slate-900 bg-transparent'

              }`}

            >

              <tab.icon className="w-3.5 h-3.5" />

              <span>{tab.label}</span>

            </button>

          );

        })}

      </div>



      {/* TAB 1: MI PORTAL Y JORNADAS */}

      {activeTab === 'perfil' && (

        <motion.div

          key="tab-perfil"

          initial={{ opacity: 0, y: 8 }}

          animate={{ opacity: 1, y: 0 }}

          className="space-y-5"

        >

          {/* Volunteer Profile Card */}

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4 relative overflow-hidden">

            <div className="flex items-start gap-4">

              <div className="relative flex-shrink-0">

                <img

                  src="httpúblic/AB6AXuA8gAGpttLDn7AX8K6hr_ULcJoyDfaLAN6em00TQIOQ__E3xbp1MZeTWBUqjwW-gxPLJJouZnXap1tlVq9yun95Z9m1pPCWfcj9OBA-uiZK_ZTy7DzBr6W-6sHjoKke1xlLw3K2p9x8OODpxFnOf6LQHWa1Nr-id3cWennc79pOjW94o4P6fV3TidMCr2iKx4k03RRqjr5FP-tLVDfshDar6vEQiM31In8-xzbr4rPVLwJSjSlSLx_rPg"

                  alt="Carmen Elena Morales - Voluntaria Oficial ASONAPAQ"

                  className="w-20 h-20 rounded-2xl object-cover shadow-md border-2 border-emerald-600/30"

                />

                <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm">

                  <CheckCircle2 className="w-4 h-4" />

                </span>

              </div>



              <div className="min-w-0 flex-1 space-y-1">

                <div className="flex items-center gap-2">

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 inline-flex items-center gap-1.5">

                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />

                    Disponible

                  </span>

                </div>

                <h3 className="text-base font-bold text-slate-900 truncate">

                  {volunteer.nombre}

                </h3>

                <p className="text-xs text-slate-500 line-clamp-1">

                  AcompaÃƒÂ±amiento Hospitalario & Insumás

                </p>

                <div className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-bold">

                  <AsonapaqLogo size="xs" />

                  <span>{volunteer.credencial}</span>

                </div>

              </div>

            </div>



            {/* Bento Humanitarian Metrics */}

            <div className="grid grid-cols-2 gap-3 pt-1">

              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1 border border-slate-100">

                <div className="flex items-center justify-between text-emerald-700">

                  <Clock className="w-4 h-4" />

                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">

                    +6h este más

                  </span>

                </div>

                <p className="text-3xl font-bold text-slate-900 leading-none pt-1">

                  {volunteer.horasAcumuladas}

                  <span className="text-sm font-normal text-slate-500 ml-0.5">h</span>

                </p>

                <p className="text-[11px] text-slate-500">Horas voluntarias</p>

              </div>



              <div className="bg-slate-50 rounded-2xl p-3.5 space-y-1 border border-slate-100">

                <div className="flex items-center justify-between text-teal-700">

                  <Users className="w-4 h-4" />

                  <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">

                    Panamá¡ Centro

                  </span>

                </div>

                <p className="text-3xl font-bold text-slate-900 leading-none pt-1">

                  {volunteer.pacientesAcompanados}

                </p>

                <p className="text-[11px] text-slate-500">Pacientes acompaÃƒÂ±ados</p>

              </div>

            </div>



            {/* Quick Check-In at ION Hospital */}

            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm">

                  <Building className="w-5 h-5" />

                </div>

                <div>

                  <p className="text-xs font-bold text-slate-900">PrÃƒÂ³xima AsignaciÃƒÂ³n</p>

                  <p className="text-[11px] text-slate-600">

                    {volunteer.proximaGuardía.fecha} Ã‚Â· {volunteer.proximaGuardía.lugar} ({volunteer.proximaGuardía.hora})

                  </p>

                </div>

              </div>



              <button

                type="button"

                disabled={checkInLoading || isCheckedIn}

                onClick={handleCheckInHospital}

                className={`px-3.5 py-2 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-transform flex-shrink-0 ${

                  isCheckedIn

                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'

                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'

                }`}

              >

                {checkInLoading ? (

                  <span>Registrando...</span>

                ) : isCheckedIn ? (

                  <span>Llegada Lista Ã¢Å“â€œ</span>

                ) : (

                  <span>Registrar Llegada</span>

                )}

              </button>

            </div>

          </div>



          {/* PrÃƒÂ³ximás Jornadas */}

          <div className="space-y-3">

            <div className="flex items-center justify-between px-1">

              <div>

                <h3 className="text-base font-bold text-slate-900">PrÃƒÂ³ximás Jornadas</h3>

                <p className="text-xs text-slate-500">

                  Actividades grupales convocadas por ASONAPAQ

                </p>

              </div>

              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">

                3 este más

              </span>

            </div>



            <div className="space-y-3">

              {/* Jornada 1: Taller de Turbantes */}

              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">

                <div className="flex items-center justify-between">

                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">

                    <Brush className="w-3 h-3" />

                    Taller Solidario

                  </span>

                  <span className="text-[11px] text-slate-500 flex items-center gap-1">

                    <Calendar className="w-3 h-3" />

                    SÃƒÂ¡bado 18 Mayo Ã‚Â· 9:30 AM

                  </span>

                </div>

                <div className="flex gap-3">

                  <img

                    src="httpúblic/AB6AXuA3q2e8FlzPynYp0sngcbZFHuOl7k__FVnYxDjyYhZ6gPhC9VVzlqSxQSVBmsFb6xUACD1TjZFjjM0MGoBm9s4YLhXtIsGbFYs3tHIve1xiKhJcMlHfuWaZhCwzPHUE1yNze2Jfib0rL8RD-D3q2mWJBpGOy9BrVpcgfyo-XiGz07o1qFN2aGLGRtXpjSdYM6rQUxLSPH7uxxbyzhUtJ6R4JSDpTt4pVJuXF1HzfPqMOftOWrtZok_OhQ"

                    alt="Taller de confecciÃƒÂ³n de turbantes ASONAPAQ"

                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-200"

                  />

                  <div className="min-w-0 flex-1">

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">

                      Taller de Tejido & ConfecciÃƒÂ³n de Turbantes

                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">

                      ElaboraciÃƒÂ³n de accesorios cÃƒÂ³más para aliviar la alopecia temporal por quimioterapia con dedicatorias de amor.

                    </p>

                  </div>

                </div>

                <div className="flex items-center justify-between pt-1">

                  <div className="flex items-center gap-1 text-slate-500 text-xs">

                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />

                    <span>Sede Administrativa ASONAPAQ</span>

                  </div>

                  <button

                    type="button"

                    onClick={() => setJornada1Confirmed(!jornada1Confirmed)}

                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${

                      jornada1Confirmed

                        ? 'bg-emerald-700 text-white'

                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'

                    }`}

                  >

                    {jornada1Confirmed ? 'Asistencia Confirmada Ã¢Å“â€œ' : 'Confirmar Asistencia'}

                  </button>

                </div>

              </div>



              {/* Jornada 2: Entrega Suplementos ION */}

              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">

                <div className="flex items-center justify-between">

                  <span className="inline-flex items-center gap-1 text-[11px] text-teal-800 font-bold bg-teal-100 px-2.5 py-0.5 rounded-full">

                    <Utensils className="w-3 h-3" />

                    Soporte Nutricional

                  </span>

                  <span className="text-[11px] text-slate-500 flex items-center gap-1">

                    <Calendar className="w-3 h-3" />

                    Martes 21 Mayo Ã‚Â· 8:00 AM

                  </span>

                </div>

                <div className="flex gap-3">

                  <img

                    src="httpúblic/AB6AXuAJ6GG8ecY6Zw16PyCncfeLFjoaQgA1KhdLwWyTXTjR26xpf-nSzlMFKg_PLAzg0lFNJmcnubi5on4j8-HDlJRuKwVnQoFwzUrldV-QblffbIvs2i_vddqLwJWOZaPDMs5PJLNpLYHTvZWczJwZlHmZDz8gpUf052dhwaPWXg6-lBua_U1WpWJP55AAikrwkPH_OqYJpK0VYKJcIkhfNret67pvoEyugL2B2fI6RQ9LC6gS8FxvI7whyw"

                    alt="Entrega de suplementos oncológicos en ION"

                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-200"

                  />

                  <div className="min-w-0 flex-1">

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">

                      Entrega Mensual de Suplementos OncolÃƒÂ³gicos

                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">

                      DistribuciÃƒÂ³n en sala de infusiÃƒÂ³n ION a pacientes forÃƒÂ¡neos de las provincias centrales y comarcas.

                    </p>

                  </div>

                </div>

                <div className="flex items-center justify-between pt-1">

                  <div className="flex items-center gap-1 text-slate-500 text-xs">

                    <MapPin className="w-3.5 h-3.5 text-teal-700" />

                    <span>Instituto OncolÃƒÂ³gico Nacional (ION)</span>

                  </div>

                  <span className="bg-emerald-700 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">

                    Inscrito Ã¢Å“â€œ

                  </span>

                </div>

              </div>



              {/* Jornada 3: CÃƒÂ­rculo de OraciÃƒÂ³n */}

              <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">

                <div className="flex items-center justify-between">

                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-800 font-bold bg-slate-200 px-2.5 py-0.5 rounded-full">

                    <Heart className="w-3 h-3 text-emerald-700" />

                    Apoyo Espiritual

                  </span>

                  <span className="text-[11px] text-slate-500 flex items-center gap-1">

                    <Calendar className="w-3 h-3" />

                    Jueves 23 Mayo Ã‚Â· 4:00 PM

                  </span>

                </div>

                <div className="flex gap-3">

                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-100">

                    <Sparkles className="w-8 h-8" />

                  </div>

                  <div className="min-w-0 flex-1">

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">

                      CÃƒÂ­rculo de OraciÃƒÂ³n, Fe & Esperanza

                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">

                      Encuentro ecumÃƒÂ©nico de fortaleza, lectura reflexiva y abrazo fraterno para familiares y cuidadores.

                    </p>

                  </div>

                </div>

                <div className="flex items-center justify-between pt-1">

                  <div className="flex items-center gap-1 text-slate-500 text-xs">

                    <Video className="w-3.5 h-3.5 text-slate-600" />

                    <span>Capilla ION & VÃƒÂ­a Zoom</span>

                  </div>

                  <button

                    type="button"

                    onClick={() => setJornada3Joined(!jornada3Joined)}

                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${

                      jornada3Joined

                        ? 'bg-emerald-700 text-white'

                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'

                    }`}

                  >

                    {jornada3Joined ? 'Enlace Agendado Ã¢Å“â€œ' : 'Unirme'}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      )}



      {/* TAB 2: TURNOS Y DISPONIBILIDAD */}

      {activeTab === 'disponibilidad' && (

        <motion.div

          key="tab-disponibilidad"

          initial={{ opacity: 0, y: 8 }}

          animate={{ opacity: 1, y: 0 }}

          className="space-y-4"

        >

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">

            <div>

              <span className="text-emerald-700 text-[11px] font-bold uppercase tracking-wider">

                PlanificaciÃƒÂ³n Semanal de Guardias

              </span>

              <h3 className="text-base font-bold text-slate-900 mt-0.5">

                Tu Disponibilidad de Tiempo

              </h3>

              <p className="text-xs text-slate-600 mt-1">

                Marca los dÃƒÂ­as y horarios en que puedes ofrecer acompañando tu tiempo.

              </p>

            </div>



            {/* Selector de DÃƒÂ­as Semanales */}

            <div className="space-y-2">

              <label className="text-xs font-bold text-slate-800 block">

                DÃƒÂ­as Disponibles:

              </label>

              <div className="grid grid-cols-6 gap-2">

                {[

                  { id: 'lunes', short: 'L', label: 'Lun' },

                  { id: 'martes', short: 'M', label: 'Mar' },

                  { id: 'miercoles', short: 'M', label: 'MiÃƒÂ©' },

                  { id: 'jueves', short: 'J', label: 'Jue' },

                  { id: 'viernes', short: 'V', label: 'Vie' },

                  { id: 'sabado', short: 'S', label: 'SÃƒÂ¡b' }

                ].map((d) => {

                  const checked = dias.includes(d.id);

                  return (

                    <button

                      key={d.id}

                      type="button"

                      onClick={() => toggledía(d.id)}

                      className={`flex flex-col items-center p-2.5 rounded-2xl transition-all ${

                        checked

                          ? 'bg-emerald-700 text-white shadow-sm'

                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'

                      }`}

                    >

                      <span className="text-sm font-bold">{d.short}</span>

                      <span className="text-[10px]">{d.label}</span>

                    </button>

                  );

                })}

              </div>

            </div>



            {/* Turnos Horarios */}

            <div className="space-y-2 pt-2">

              <label className="text-xs font-bold text-slate-800 block">

                Franjas Horarias Preferidas:

              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

                <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100">

                  <input

                    type="checkbox"

                    checked={turnos.includes('matutino')}

                    onChange={(e) => {

                      if (e.target.checked) setTurnos([...turnos, 'matutino']);

                      else setTurnos(turnos.filter((t) => t !== 'matutino'));

                    }}

                    className="w-4 h-4 rounded text-emerald-700 accent-emerald-700"

                  />

                  <div>

                    <p className="text-xs font-bold text-slate-900">Turno Matutino</p>

                    <p className="text-[11px] text-slate-500">8:00 AM Ã¢â‚¬â€œ 12:00 PM</p>

                  </div>

                </label>



                <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100">

                  <input

                    type="checkbox"

                    checked={turnos.includes('vespertino')}

                    onChange={(e) => {

                      if (e.target.checked) setTurnos([...turnos, 'vespertino']);

                      else setTurnos(turnos.filter((t) => t !== 'vespertino'));

                    }}

                    className="w-4 h-4 rounded text-emerald-700 accent-emerald-700"

                  />

                  <div>

                    <p className="text-xs font-bold text-slate-900">Turno Vespertino</p>

                    <p className="text-[11px] text-slate-500">1:00 PM Ã¢â‚¬â€œ 5:00 PM</p>

                  </div>

                </label>

              </div>

            </div>



            {/* Zonas de Voluntariado */}

            <div className="space-y-2 pt-2">

              <label className="text-xs font-bold text-slate-800 block">

                Zonas de AcompaÃƒÂ±amiento Habilitadas:

              </label>

              <div className="space-y-2">

                {[

                  {

                    id: 'ion',

                    title: 'Instituto OncolÃƒÂ³gico Nacional (ION - AncÃƒÂ³n)',

                    desc: 'Salas de Espera, HospitalizaciÃƒÂ³n y quimioterapia Ambulatoria.'

                  },

                  {

                    id: 'visitas_domiciliarias',

                    title: 'Visitas Domiciliarias - Panamá¡ Centro',

                    desc: 'AcompaÃƒÂ±amiento a pacientes en reposo y apoyo a cuidadores familiares.'

                  },

                  {

                    id: 'sede_admin',

                    title: 'Sede Administrativa ASONAPAQ',

                    desc: 'Apoyo logÃƒÂ­stico, clasificaciÃƒÂ³n de insumos y kits.'

                  }

                ].map((z) => (

                  <label

                    key={z.id}

                    className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100"

                  >

                    <input

                      type="checkbox"

                      checked={zonas.includes(z.id)}

                      onChange={(e) => {

                        if (e.target.checked) setZonas([...zonas, z.id]);

                        else setZonas(zonas.filter((x) => x !== z.id));

                      }}

                      className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 mt-0.5"

                    />

                    <div className="text-left">

                      <span className="text-xs font-bold text-slate-900 block">{z.title}</span>

                      <p className="text-[11px] text-slate-500 mt-0.5">{z.desc}</p>

                    </div>

                  </label>

                ))}

              </div>

            </div>



            {/* Guardar botÃƒÂ³n */}

            <div className="pt-2">

              <button

                type="button"

                onClick={handleSaveDisponibilidad}

                className="w-full h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md active:scale-98 transition-transform flex items-center justify-center gap-2 text-xs sm:text-sm"

              >

                <span>Actualizar Mi Disponibilidad</span>

              </button>

            </div>



            {disponibilidadMsg && (

              <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl text-xs text-center font-medium">

                Ã¢Å“â€œ Tus preferencias semanales han sido actualizadas con la coordinaciÃƒÂ³n de ASONAPAQ.

              </div>

            )}

          </div>

        </motion.div>

      )}



      {/* TAB 3: POSTULACIÃƒâ€œN DE NUEVOS VOLUNTARIOS */}

      {activeTab === 'postulacion' && (

        <motion.div

          key="tab-postulacion"

          initial={{ opacity: 0, y: 8 }}

          animate={{ opacity: 1, y: 0 }}

          className="space-y-4"

        >

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">

            <div className="space-y-1">

              <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold">

                <Heart className="w-3.5 h-3.5 fill-emerald-700" />

                ÃƒÅ¡nete a Nuestra Familia

              </span>

              <h3 className="text-base font-bold text-slate-900">

                InscripciÃƒÂ³n de Nuevos Voluntarios

              </h3>

              <p className="text-xs text-slate-600">

                No necesitas experiencia mÃƒÂ©día previa: tu escucha compasiva, una sonrisa y tu presencia transforman vidas durante la terapia oncológica.

              </p>

            </div>



            {!postulacionEnviada ? (

              <form onSubmit={handlePostulacionSubmit} className="space-y-3.5">

                <div className="space-y-1">

                  <label className="text-xs font-bold text-slate-800 block">

                    Nombre y Apellido <span className="text-rose-600">*</span>

                  </label>

                  <input

                    type="text"

                    required

                    value={postNombre}

                    onChange={(e) => setPostNombre(e.target.value)}

                    placeholder="Ej. Ana Victoria Batista"

                    className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"

                  />

                </div>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div className="space-y-1">

                    <label className="text-xs font-bold text-slate-800 block">

                      CÃƒÂ©día / Documento <span className="text-rose-600">*</span>

                    </label>

                    <input

                      type="text"

                      required

                      value={postCedía}

                      onChange={(e) => setPostCedía(e.target.value)}

                      placeholder="8-000-0000"

                      className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"

                    />

                  </div>

                  <div className="space-y-1">

                    <label className="text-xs font-bold text-slate-800 block">

                      WhatsApp / MÃƒÂ³vil <span className="text-rose-600">*</span>

                    </label>

                    <input

                      type="tel"

                      required

                      value={postTelefono}

                      onChange={(e) => setPostTelefono(e.target.value)}

                      placeholder="+507 6000-0000"

                      className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"

                    />

                  </div>

                </div>



                <div className="space-y-1">

                  <label className="text-xs font-bold text-slate-800 block">

                    ProfesiÃƒÂ³n, Oficio o Habilidad

                  </label>

                  <input

                    type="text"

                    value={postProfesion}

                    onChange={(e) => setPostProfesion(e.target.value)}

                    placeholder="Ej. Docente, PsicÃƒÂ³loga, Conductor, Estudiante, Manualidades..."

                    className="w-full h-11 px-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"

                  />

                </div>



                <div className="space-y-1">

                  <label className="text-xs font-bold text-slate-800 block">

                    Ã‚Â¿QuÃƒÂ© te inspira a acompaÃƒÂ±ar a pacientes con cÃƒÂ¡ncer? <span className="text-rose-600">*</span>

                  </label>

                  <textarea

                    required

                    rows={2}

                    value={postMotivacion}

                    onChange={(e) => setPostMotivacion(e.target.value)}

                    placeholder="CuÃƒÂ©ntanos brevemente tu sentir o experiencia personal de vida..."

                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-emerald-600 focus:outline-none"

                  />

                </div>



                {/* Biosecurity checkbox */}

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">

                  <label className="flex items-start gap-2.5 cursor-pointer">

                    <input

                      type="checkbox"

                      required

                      checked={checkBioseguridad}

                      onChange={(e) => setCheckBioseguridad(e.target.checked)}

                      className="w-4 h-4 rounded text-emerald-700 accent-emerald-700 mt-0.5 cursor-pointer"

                    />

                    <div className="text-slate-800 text-left">

                      <span className="text-xs font-bold block">

                        Compromiso de Taller de InducciÃƒÂ³n & Bioseguridad

                      </span>

                      <p className="text-[11px] text-slate-500 mt-0.5">

                        Acepto participar en la capacitaciÃƒÂ³n gratuita de 2 horas sobre protocolos hospitalarios y bioseguridad en el ION.

                      </p>

                    </div>

                  </label>

                </div>



                <button

                  type="submit"

                  disabled={postulacionLoading}

                  className="w-full h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md active:scale-98 transition-transform flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-70"

                >

                  <Send className="w-4 h-4" />

                  <span>

                    {postulacionLoading ? 'Transmitiendía n8n...' : 'Enviar Mi PostulaciÃƒÂ³n a ASONAPAQ'}

                  </span>

                </button>

              </form>

            ) : (

              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 space-y-2 text-center">

                <CheckCircle2 className="w-8 h-8 text-teal-700 mx-auto" />

                <h4 className="text-sm font-bold">Ã‚Â¡Bienvenido al Equipo de Esperanza!</h4>

                <p className="text-xs text-slate-600 leading-relaxed">

                  Hemás recibido tus datos con mucha gratitud. Nuestro equipo de coordinaciÃƒÂ³n de voluntariado de ASONAPAQ te contactarÃƒÂ¡ vÃƒÂ­a WhatsApp en más de 48 horas.

                </p>

              </div>

            )}

          </div>

        </motion.div>

      )}



      {/* Testimonio Calidez Humana */}

      <div className="bg-slate-100/80 p-5 rounded-3xl space-y-2 border border-slate-200/60">

        <div className="flex items-center gap-2 text-emerald-800">

          <Quote className="w-4 h-4 text-emerald-700" />

          <span className="text-xs font-bold uppercase tracking-wider">Voz día Solidaridad</span>

        </div>

        <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">

          &ldquo;Sostener la mano de una persona mientras recibe su quimio y decirle &lsquo;no estÃƒÂ¡s solo&rsquo;, es el acto mÃƒÂ¡s sagrado y sanador que he experimentado en mi vida.&rdquo;

        </p>

        <div className="flex items-center justify-between text-slate-500 text-xs pt-1">

          <span className="font-semibold text-slate-900">Ã¢â‚¬â€ Carmen Elena Morales</span>

          <span>Voluntaria desde 2021</span>

        </div>

      </div>

    </div>

  );

};











