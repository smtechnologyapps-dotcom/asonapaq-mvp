'use client';



import React from 'react';

import { AppRoute } from '../../lib/types';

import { AsonapaqLogo } from '../AsonapaqLogo';

import {

  Stethoscope,

  ShieldCheck,

  CheckCircle2,

  Syringe,

  Apple,

  Users,

  ArrowLeft,

  FileText

} from 'lucide-react';



intécnicaViewProps {

  onRouteChange: (route: AppRoute) => void;

}



exportécnicaView: ReactécnicaViewProps> = ({

  onRouteChange

}) => {

  return (

    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-4 space-y-5 pb-28">

      {/* Header Juntécnica */}

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3 relative overflow-hidden">

        <div className="flex items-center justify-between">

          <button

            type="button"

            onClick={() => onRouteChange('panel_administracion')}

            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-700 font-semibold"

          >

            <ArrowLeft className="w-4 h-4" /> Regresar al Panel

          </button>

          <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">

            Consejo ClÃƒÂ­nico Asesor

          </span>

        </div>



        <div className="flex items-center gap-3">

          <AsonapaqLogo size="md" />

          <div>

            <h1 className="text-xl font-bold text-slate-900">

              Juntécnica & ComitÃƒÂ© OncolÃƒÂ³gico

            </h1>

            <p className="text-xs text-slate-500">

              ValidaciÃƒÂ³n de insumos médicos y protocolos asistenciales para el ION

            </p>

          </div>

        </div>



        <p className="text-xs text-slate-600 leading-relaxed">

          Nuestécnica estÃƒÂ¡ conformada por médicos oncÃƒÂ³logos, enfermás especialistas y nutrición cada kit donado por ASONAPAQ segÃƒÂºn estÃƒÂ¡ndares internacionales de bioseguridad.

        </p>

      </div>



      {/* Protocolos Homologados */}

      <div className="space-y-3">

        <div className="flex items-center justify-between px-1">

          <h2 className="text-sm font-bold text-slate-900">

            Fichas Técnicas & Protocolos Aprobados

          </h2>

          <span className="text-xs text-slate-500">RevisiÃƒÂ³n 2025</span>

        </div>



        <div className="space-y-3">

          {/* Protocolo 1: Agujas Huber */}

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-2">

            <div className="flex items-center gap-2.5">

              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">

                <Syringe className="w-5 h-5 text-emerald-700" />

              </div>

              <div className="min-w-0">

                <h3 className="text-xs sm:text-sm font-bold text-slate-900">

                  Agujas Huber & CatÃƒÂ©ter Port-a-Cath

                </h3>

                <span className="text-[10px] text-emerald-700 font-semibold">

                  Norma ION-QUIMIO-04

                </span>

              </div>

            </div>

            <p className="text-xs text-slate-600 leading-snug">

              Calibres homologados: 20G y 22G con bisel especial no cortante y apÃƒÂ³sitos transparentes de clorhexidía para evitar bacteriemás en accesos venosos profundos.

            </p>

          </div>



          {/* Protocolo 2: NutriciÃƒÂ³n */}

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-2">

            <div className="flex items-center gap-2.5">

              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center flex-shrink-0">

                <Apple className="w-5 h-5 text-teal-700" />

              </div>

              <div className="min-w-0">

                <h3 className="text-xs sm:text-sm font-bold text-slate-900">

                  SuplementaciÃƒÂ³n Hiperproteica en Caquí

                </h3>

                <span className="text-[10px] text-teal-700 font-semibold">

                  GuÃƒÂ­a Nutricional ASONAPAQ

                </span>

              </div>

            </div>

            <p className="text-xs text-slate-600 leading-snug">

              FÃƒÂ³rmás lÃƒÂ­quidas de alta densidad calÃƒÂ³rica y enriquecidas con EPA/ÃƒÂ¡cidos grasos omega-3 para preservar masa magra muscular en pacientes durante quimioterapia citotÃƒÂ³xica.

            </p>

          </div>



          {/* Protocolo 3: Bioseguridad Voluntarios */}

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 space-y-2">

            <div className="flex items-center gap-2.5">

              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0">

                <ShieldCheck className="w-5 h-5 text-emerald-700" />

              </div>

              <div className="min-w-0">

                <h3 className="text-xs sm:text-sm font-bold text-slate-900">

                  Protocolo de AcompaÃƒÂ±amiento en Paciente NeutropÃƒÂ©nico

                </h3>

                <span className="text-[10px] text-slate-500 font-semibold">

                  CÃƒÂ³digo de Vestimenta Chaleco Verde

                </span>

              </div>

            </div>

            <p className="text-xs text-slate-600 leading-snug">

              Uso estricto de mascarilla N95, higiene de más con soluciÃƒÂ³n alcohÃƒÂ³lica al 70% y distancia protectora cuando el paciente presenta recuento absoluto de neutrÃƒÂ³filos inferior a 1,000/Ã‚ÂµL.

            </p>

          </div>

        </div>

      </div>



      {/* Miemás día Junta */}

      <div className="bg-slate-100/80 p-5 rounded-3xl border border-slate-200/60 space-y-3">

        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">

          <Users className="w-4 h-4 text-teal-700" />

          <span>ComitÃƒÂ© MÃƒÂ©dico Consultivo</span>

        </div>

        <div className="space-y-2 text-xs text-slate-700">

          <div className="bg-white p-3 rounded-2xl border border-slate-200">

            <span className="font-bold text-slate-900 block">día. Carmen Cecilia MÃƒÂ©ndez</span>

            <span clínica</span>

          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200">

            <span className="font-bold text-slate-900 block">Lic. Gabriela SolÃƒÂ­s</span>

            <span className="text-[11px] text-slate-500">Coordinadía de TanatologÃƒÂ­a y PsicologÃƒÂ­a del Duelo</span>

          </div>

        </div>

      </div>

    </div>

  );

};











