'use client';



import React, { useState } from 'react';

import { AppRoute } from '../../lib/types';

import { motion } from 'motion/react';

import {

  Heart,

  Handshake,

  Gift,

  ArrowRight,

  PhoneCall,

  CalendarCheck2,

  Users2,

  Syringe,

  Smile,

  Apple,

  Home,

  Flag,

  Eye,

  Award,

  Church,

  ShieldCheck,

  FileSpreadsheet,

  Stethoscope

} from 'lucide-react';



interface InicioPublicaViewProps {

  onRouteChange: (route: AppRoute) => void;

}



export const InicioPublicaView: React.FC<InicioPublicaViewProps> = ({

  onRouteChange

}) => {

  const [selectedRole, setSelectedRole] = useState<'paciente' | 'voluntario' | 'donante'>('paciente');



  const roleConfig = {

    paciente: {

      title: 'Acceder al Portal de Pacientes',

      route: 'portal_pacientes' as AppRoute,

      icon: Heart,

      desc: 'Gestión'

    },

    voluntario: {

      title: 'Acceder como Voluntario',

      route: 'portal_voluntarios' as AppRoute,

      icon: Handshake,

      desc: 'Organiza tus turnos de acompañamiento y brigadas en el ION'

    },

    donante: {

      title: 'Colaborar en el Muro Comunitario',

      route: 'muro_comunicaciones' as AppRoute,

      icon: Gift,

      desc: 'Participa, comparte mensajes de fe y dona insumos de apoyo'

    }

  };



  return (

    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-4 space-y-6 pb-24">

      {/* Hero Section */}

      <section className="relative w-full rounded-3xl overflow-hidden bg-white shadow-[0_12px_32px_-8px_rgba(21,128,61,0.18),0_4px_12px_rgba(15,23,42,0.06)] border border-slate-100">

        <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900">

          <img

            src="httpúblic/AB6AXuBa4LLcvBszjcVDBKQYKIxyXssSjte7fEBng9Idk4eT80eo6875orN3egg7ZqtsrP65ozIy-bOowYA8o3lOmN6c4dLWGfkhm-o3KoX2nwDXfEnor6lbpvnmwkHXokU47l6rPHWlTPonyRHhLy8EgCKkJi11yqcUwEsZdt9BPVPmiaCF8VuEVNEA5z1CjO0I9pyJqUzQE0BFRdAHqhiEnW1WhsBIlJCkJgqAgjfybOjzWYdar0yvO155BQ"

            alt="Voluntaria de ASONAPAQ acompañando con empatía a paciente en quimioterapia"

            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"

          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />



          {/* Badge Fundacional */}

          <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md">

            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />

            <span className="text-xs text-slate-900 font-bold tracking-wide">

              Panamá¡ Ã‚Â· Desde 1989

            </span>

          </div>



          {/* Lema Central */}

          <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/40 backdrop-blur-sm">

              <span className="material-symás-outlined text-[15px] text-emerald-300" style={{ fontVariationSettings: "'FILL' 1" }}>

                volunteer_activism

              </span>

              <span className="text-[11px] text-emerald-200 font-bold uppercase tracking-wider">

                Fe Ã‚Â· Esperanza Ã‚Â· Vida

              </span>

            </div>

            <h1 className="text-xl sm:text-2xl font-bold leading-tight text-white drop-shadow-md">

              Ningún paciente enfrenta la quimioterapia en soledad

            </h1>

          </div>

        </div>



        {/* Quick Action Interactive Card inside Hero */}

        <div className="p-4 sm:p-6 bg-white flex flex-col gap-4">

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">

            Bienvenido al centro de apoyo día{' '}

            <strong className="text-emerald-800 font-bold">

              Asociación Nacional de Pacientes de quimioterapia

            </strong>

            . Un espública de Panamá¡.

          </p>



          {/* Accessible Role Selector */}

          <div className="space-y-1.5">

            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">

              Selecciona tu perfil de acceso

            </span>

            <div className="grid grid-cols-3 gap-2 bg-slate-100/80 p-1.5 rounded-2xl">

              {[

                { id: 'paciente', label: 'Paciente', icon: Heart },

                { id: 'voluntario', label: 'Voluntario', icon: Handshake },

                { id: 'donante', label: 'Colaborador', icon: Gift }

              ].map((r) => {

                const isActive = selectedRole === r.id;

                return (

                  <button

                    key={r.id}

                    type="button"

                    onClick={() => setSelectedRole(r.id as any)}

                    className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-200 text-center ${

                      isActive

                        ? 'bg-emerald-700 text-white shadow-md font-semibold'

                        : 'bg-transparent text-slate-700 hover:bg-slate-200/70 font-medium'

                    }`}

                  >

                    <r.icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-white' : 'text-emerald-700'}`} />

                    <span className="text-[11px] tracking-tight">{r.label}</span>

                  </button>

                );

              })}

            </div>

          </div>



          {/* Dynamic Main Portal CTA */}

          <motion.button

            key={selectedRole}

            initial={{ opacity: 0.8, scale: 0.98 }}

            animate={{ opacity: 1, scale: 1 }}

            transition={{ duration: 0.15 }}

            onClick={() => onRouteChange(roleConfig[selectedRole].route)}

            className="w-full h-14 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(21,128,61,0.28)] active:scale-[0.98] transition-all px-6 text-center font-bold text-sm sm:text-base group"

          >

            <span>{roleConfig[selectedRole].title}</span>

            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

          </motion.button>



          {/* Urgent Helpline */}

          <a

            href="tel:+50765091352"

            className="w-full h-12 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 flex items-center justify-center gap-2 transition-colors px-4 text-xs sm:text-sm font-semibold"

          >

            <PhoneCall className="w-4 h-4 text-rose-600 animate-pulse" />

            <span>OrientaciÃƒÂ³n Inmedía Ã‚Â· (507) 6509-1352</span>

          </a>

        </div>

      </section>



      {/* Impact Statistics */}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">

          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5">

            <CalendarCheck2 className="w-5 h-5 text-emerald-700" />

          </div>

          <span className="text-2xl sm:text-3xl font-bold text-slate-900">+35 AÃƒÂ±os</span>

          <span className="text-xs text-slate-500 leading-tight mt-0.5">

            Labor ininterrumpida por la vida

          </span>

        </div>



        <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">

          <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mb-1.5">

            <Users2 className="w-5 h-5 text-teal-700" />

          </div>

          <span className="text-2xl sm:text-3xl font-bold text-slate-900">+14,000</span>

          <span className="text-xs text-slate-500 leading-tight mt-0.5">

            Familias panameÃƒÂ±as acogidas

          </span>

        </div>

      </section>



      {/* Nuestros Pilares de Ayuda */}

      <section className="space-y-3">

        <div className="flex items-center justify-between px-1">

          <div>

            <span className="text-[11px] text-emerald-700 font-bold tracking-wide uppercase">

              Compromiso Integral

            </span>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900">

              Nuestros Pilares de Ayuda

            </h2>

          </div>

          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">

            <ShieldCheck className="w-4 h-4" />

          </div>

        </div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Pilar 1 */}

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-3.5 items-start">

            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">

              <Syringe className="w-5 h-5 text-emerald-700" />

            </div>

            <div className="min-w-0 flex-1">

              <h3 className="text-sm font-bold text-slate-900">Insumás MÃƒÂ©dicos</h3>

              <p className="text-xs text-slate-600 mt-0.5 leading-snug">

                Kits de protección, apÃƒÂ³sitos oncológicos, catéteres Port-a-Cath y médicaciÃƒÂ³n complementaria de apoyo asistencial.

              </p>

            </div>

          </div>



          {/* Pilar 2 */}

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-3.5 items-start">

            <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 mt-0.5">

              <Smile className="w-5 h-5 text-teal-700" />

            </div>

            <div className="min-w-0 flex-1">

              <h3 className="text-sm font-bold text-slate-900">ContenciÃƒÂ³n Emocional</h3>

              <p className="text-xs text-slate-600 mt-0.5 leading-snug">

                CÃƒÂ­rculos de escucha activa, psicoterapia grupal y acompañamiento pastoral respetuoso en momentos crÃƒÂ­ticos.

              </p>

            </div>

          </div>



          {/* Pilar 3 */}

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-3.5 items-start">

            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">

              <Apple className="w-5 h-5 text-emerald-700" />

            </div>

            <div className="min-w-0 flex-1">

              <h3 className="text-sm font-bold text-slate-900">NutriciÃƒÂ³n Especializada</h3>

              <p className="text-xs text-slate-600 mt-0.5 leading-snug">

                Suplementos hipercalÃƒÂ³ricos y asesoría dietaria para mitigar los efectos adversos durante la quimioterapia.

              </p>

            </div>

          </div>



          {/* Pilar 4 */}

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-3.5 items-start">

            <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0 mt-0.5">

              <Home className="w-5 h-5 text-teal-700" />

            </div>

            <div className="min-w-0 flex-1">

              <h3 className="text-sm font-bold text-slate-900">Albergue y Traslado</h3>

              <p className="text-xs text-slate-600 mt-0.5 leading-snug">

                Hospedaje transitorio digno y transporte solidario para pacientes procedentes del interior del paÃƒÂ­s.

              </p>

            </div>

          </div>

        </div>

      </section>



      {/* MisiÃƒÂ³n & VisiÃƒÂ³n */}

      <section className="space-y-3">

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">

          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-700" />

          <div className="flex items-center gap-2 mb-1.5 text-emerald-700">

            <Flag className="w-5 h-5" />

            <h3 className="text-sm font-bold text-slate-900">Nuestra MisiÃƒÂ³n</h3>

          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">

            Brindar acompañamiento humano, soporte integral y asistencia directa con insumos y calidía cada paciente en tratamiento de quimioterapia y a sus seres queridos en Panamá¡.

          </p>

        </div>



        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">

          <div className="absolute top-0 left-0 w-2 h-full bg-teal-700" />

          <div className="flex items-center gap-2 mb-1.5 text-teal-700">

            <Eye className="w-5 h-5" />

            <h3 className="text-sm font-bold text-slate-900">Nuestra VisiÃƒÂ³n</h3>

          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-1">

            Ser el faro de esperanza, dignidad y solidaridad oncológica comunitaria en Panamá¡ desde 1989, garantizando que ningÃƒÂºn paciente enfrente la quimioterapia en soledad.

          </p>

        </div>



        {/* Valores */}

        <div className="bg-slate-100/70 p-4 rounded-3xl">

          <div className="flex items-center gap-2 mb-2.5 text-slate-700">

            <Award className="w-4 h-4 text-emerald-700" />

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">

              Valores Que Nos GuÃƒÂ­an

            </h4>

          </div>

          <div className="flex flex-wrap gap-2">

            {[

              'Solidaridad Activa',

              'EmpatÃƒÂ­a Humana',

              'Esperanza Resiliente',

              'Transparencia e Integridad'

            ].map((val) => (

              <span

                key={val}

                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-slate-800 text-xs font-semibold shadow-xs border border-slate-200/60"

              >

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />

                {val}

              </span>

            ))}

          </div>

        </div>

      </section>



      {/* Faith & Hope Pastoral Message */}

      <section className="bg-gradient-to-br from-emerald-100/50 via-white to-teal-100/50 p-5 rounded-3xl border border-emerald-200/50 flex items-center gap-4 shadow-sm">

        <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 shadow-md">

          <Church className="w-6 h-6" />

        </div>

        <div>

          <h4 className="text-sm font-bold text-slate-900">Unidos en la Fe y la Esperanza</h4>

          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">

            &ldquo;Cada pública de Panamá¡.&rdquo;

          </p>

        </div>

      </section>



      {/* Instécnica */}

      <section className="pt-2 flex items-center justify-between gap-2 text-xs">

        <button

          onClick={() => onRouteChange('auditoría_social')}

          className="flex-1 py-3 px-3 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"

        >

          <FileSpreadsheet className="w-4 h-4 text-emerald-700" />

          <span>Auditoría Social</span>

        </button>

        <button

          onClick={() => onRouteChange('junta_tecnica')}

          className="flex-1 py-3 px-3 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"

        >

          <Stethoscope className="w-4 h-4 text-teal-700" />

          <span>Juntécnica ION</span>

        </button>

      </section>

    </div>

  );

};















