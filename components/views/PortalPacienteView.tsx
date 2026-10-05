'use client';



import React, { useState } from 'react';

import { triggerN8NWebhook } from '../../lib/store';

import { PatientRecord } from '../../lib/types';

import { GoogleSheetsService } from '../../lib/sheets-service';

import { getAccessToken } from '../../lib/google-auth';

import { AsonapaqLogo } from '../AsonapaqLogo';

import { motion, AnimatePresence } from 'motion/react';

import {

  PhoneCall,

  Clock,

  Download,

  PackagePlus,

  Send,

  UploadCloud,

  FileText,

  AlertTriangle,

  Scale,

  CheckCircle2,

  ChevronRight,

  Shield,

  Utensils,

  HeartHandshake,

  Home,

  Brain,

  Syringe,

  X

} from 'lucide-react';



interface PortalPacienteViewProps {

  onAddPatientRecord: (patient: PatientRecord) => void;

  onPurgePatientdía: (cedía: string) => void;

}



export const PortalPacienteView: React.FC<PortalPacienteViewProps> = ({

  onAddPatientRecord,

  onPurgePatientdía

}) => {

  // Form state

  const [tipoRequerimiento, setTipoRequerimiento] = useState('insumos_oncológicos');

  const [nombre, setNombre] = useState('');

  const [cedía, setCedía] = useState('');

  const [hospital, setHospital] = useState('');

  const [detalle, setDetalle] = useState('');

  const [fileName, setFileName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  const [submittedExpedienteId, setSubmittedExpedienteId] = useState('');



  // Modals state

  const [showHabeasModal, setShowHabeasModal] = useState(false);

  const [showNutritionModal, setShowNutritionModal] = useState(false);

  const [habeasSuccess, setHabeasSuccess] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!nombre || !cedía || !hospital || !detalle) return;



    setIsSubmitting(true);



    const generatedId = Math.floor(Math.random() * 8000 + 1000);

    const expedienteStr = `EXP-2025-${generatedId}`;



    const newRecord: PatientRecord = {

      id: generatedId,

      nombre,

      cedía,

      diagnostico:

        tipoRequerimiento === 'insumos_oncológicos'

          ? 'quimioterapia Ambulatoria (Insumás)'

          : tipoRequerimiento === 'suplementacion_nutricional'

          ? 'Soporte Nutricional OncolÃƒÂ³gico'

          : tipoRequerimiento === 'alojamiento_temporal'

          ? 'Alojamiento ForÃƒÂ¡neo ION'

          : 'ContenciÃƒÂ³n Emocional Activa',

      hospital,

      apoyo:

        tipoRequerimiento === 'insumos_oncológicos'

          ? 'Insumás OncolÃƒÂ³gicos'

          : tipoRequerimiento === 'suplementacion_nutricional'

          ? 'SuplementaciÃƒÂ³n Nutricional'

          : tipoRequerimiento === 'alojamiento_temporal'

          ? 'Alojamiento Temporal'

          : 'Apoyo PsicolÃƒÂ³gico',

      region: hospital.includes('ChiriquÃƒÂ­')

        ? 'ChiriquÃƒÂ­'

        : hospital.includes('Solano')

        ? 'Panamá¡ Oeste'

        : 'Panamá¡ Centro',

      estado: 'En Tratamiento ION',

      fechaRegistro: new Date().toISOString().split('T')[0],

      observaciones: detalle

    };



    // Trigger external n8n webhook placeholder

    await triggerN8NWebhook('EVT_REGISTRAR_SOLICITUD_PACIENTE', 'Registrar Solicitud en ASONAPAQ', {

      expediente_id: expedienteStr,

      tipo_requerimiento: tipoRequerimiento,

      nombre_paciente: nombre,

      cedula_paciente: cedía,

      hospital_paciente: hospital,

      detalle_solicitud: detalle,

      receta_adjunta: fileName || 'receta_medica_respaldo.pdf',

      submitted_at: new Date().toISOString()

    });



    onAddPatientRecord(newRecord);



    // Also persist into Google Sheets Master Spreadsheet if Google Workspace is connected

    try {

      const gToken = await getAccessToken();

      if (gToken) {

        const master = await GoogleSheetsService.getOrCreateMasterSpreadsheet(gToken);

        if (master?.spreadsheetId) {

          await GoogleSheetsService.appendPatient(master.spreadsheetId, newRecord, gToken);

        }

      }

    } catch (gErr) {

      console.warn('Google Sheets sync skipped (offline or not connected):', gErr);

    }



    setIsSubmitting(false);

    setSubmittedExpedienteId(expedienteStr);

    setShowSuccess(true);



    // Reset fields

    setNombre('');

    setCedía('');

    setHospital('');

    setDetalle('');

    setFileName('');

  };



  const handleConfirmHabeasdía = async () => {

    await triggerN8NWebhook(

      'EVT_HABEAS_DATA_ELIMINACION',

      'Confirmar EliminaciÃƒÂ³n Definitiva (Ley 81 de Panamá¡)',

      {

        action: 'HABEAS_DATA_PURGE',

        solicitante_cedía: cedía || '8-765-4321',

        legal_basis: 'Ley 81 de 2019 día República de Panamá¡ sobre ProtecciÃƒÂ³n de Datos Personales',

        requested_at: new Date().toISOString()

      }

    );



    if (cedía) {

      onPurgePatientdía(cedía);

    }



    setShowHabeasModal(false);

    setHabeasSuccess(true);

    setTimeout(() => setHabeasSuccess(false), 5000);

  };



  const handleDownloadía = async () => {

    await triggerN8NWebhook(

      'EVT_DESCARGA_GUIA_NUTRICIONAL',

      'Descargar GuÃƒÂ­a ClÃƒÂ­nica Nutricional (PDF)',

      {

        resource: 'GUIA_NUTRICION_quimioterapia_ASONAPAQ',

        format: 'PDF',

        timestamp: new Date().toISOString()

      }

    );

    setShowNutritionModal(true);

  };



  return (

    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-4 space-y-6 pb-28">

      {/* Tarjeta de Bienvenida y Esperanza */}

      <div className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">

        <div className="relative z-10 space-y-2">

          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200/60">

            <AsonapaqLogo size="xs" />

            <span className="text-xs font-bold tracking-wide">

              ASONAPAQ Contigo

            </span>

          </div>



          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">

            Portal del Paciente

          </h1>



          <p className="text-sm text-slate-600 leading-relaxed">

            Un espacio seguro y compasivo para Gestionamá¡.

          </p>

        </div>



        {/* Ambient brand seal watermark */}

        <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">

          <AsonapaqLogo size="xl" />

        </div>

      </div>



      {/* 1. SecciÃƒÂ³n de Emergencia MÃƒÂ©día OncolÃƒÂ³gica - ION */}

      <section

        aria-labelledby="emergencia-heading"

        className="bg-rose-50 border border-rose-200 text-rose-950 p-5 rounded-3xl shadow-sm relative overflow-hidden"

      >

        <div className="flex flex-col gap-3.5">

          <div className="flex items-start gap-3">

            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 text-rose-600 shadow-sm border border-rose-200">

              <PhoneCall className="w-6 h-6 animate-pulse" />

            </div>

            <div className="min-w-0">

              <span className="text-[11px] text-rose-700 font-bold uppercase tracking-wider block">

                AtenciÃƒÂ³n MÃƒÂ©día Inmedía

              </span>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5" id="emergencia-heading">

                Central TelefÃƒÂ³nica Ã¢â‚¬â€ ION

              </h2>

              <p className="text-xs text-slate-700 mt-1 leading-snug">

                Instituto OncolÃƒÂ³gico Nacional Dr. Juan DemÃƒÂ³stenes Arosemena. OrientaciÃƒÂ³n ante fiebre post-quimioterapia, neutropenia o complicaciones agudas.

              </p>

            </div>

          </div>



          {/* Horarios */}

          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl flex items-center gap-2.5 border border-rose-200/60">

            <Clock className="w-4 h-4 text-rose-600 flex-shrink-0" />

            <p className="text-xs text-slate-800 font-medium">

              Urgencias: 24 horas continuas, los 365 dÃƒÂ­as del aÃƒÂ±o.

            </p>

          </div>



          {/* Direct call button */}

          <a

            href="tel:512-7000"

            className="w-full h-12 min-h-[48px] bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all text-sm"

          >

            <PhoneCall className="w-4 h-4 text-rose-200" />

            <span>Llamar al 512-7000</span>

          </a>

        </div>

      </section>



      {/* 2. Recursos de Apoyo Inmediato */}

      <section className="space-y-3">

        <div className="flex items-center justify-between px-1">

          <div>

            <h2 className="text-lg font-bold text-slate-900">Recursos de Apoyo Inmediato</h2>

            <p className="text-xs text-slate-500">Materiales y suministros preparados para tu bienestar</p>

          </div>

        </div>



        <div className="grid grid-cols-1 gap-3.5">

          {/* Tarjeta NutriciÃƒÂ³n */}

          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-3">

            <div className="flex items-start gap-3.5">

              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center flex-shrink-0 border border-teal-100">

                <Utensils className="w-6 h-6 text-teal-700" />

              </div>

              <div className="space-y-1 min-w-0">

                <span className="inline-block bg-teal-100 text-teal-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">

                  GuÃƒÂ­a ClÃƒÂ­nica Nutricional

                </span>

                <h3 className="text-base font-bold text-slate-900 leading-tight">

                  NutriciÃƒÂ³n en quimioterapia

                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">

                  Consejos prÃƒÂ¡cticos para mitigar nÃƒÂ¡useas, combatir la pÃƒÂ©rdía del apetito y recetas reconfortantes diseÃƒÂ±adas por especialistas oncológicos de Panamá¡.

                </p>

              </div>

            </div>



            <button

              type="button"

              onClick={handleDownloadía}

              className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs sm:text-sm"

            >

              <Download className="w-4 h-4 text-emerald-700" />

              <span>Descargar GuÃƒÂ­a (PDF)</span>

            </button>

          </div>



          {/* Tarjeta Banco de Insumás */}

          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-3">

            <div className="flex items-start gap-3.5">

              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0 border border-emerald-100">

                <Syringe className="w-6 h-6 text-emerald-700" />

              </div>

              <div className="space-y-1 min-w-0">

                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">

                  Suministros ASONAPAQ

                </span>

                <h3 className="text-base font-bold text-slate-900 leading-tight">

                  Banco de Insumás OncolÃƒÂ³gicos

                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">

                  Disponibilidad solidía de agujas Huber, catéteres Port-a-Cath, cremás dermoprotectoras para radioterapia y kits de aseo estÃƒÂ©ril.

                </p>

              </div>

            </div>



            <a

              href="#formulario-solicitud"

              className="w-full h-11 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-full flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] text-xs sm:text-sm"

            >

              <PackagePlus className="w-4 h-4" />

              <span>Solicitar Insumo Directo</span>

            </a>

          </div>

        </div>

      </section>



      {/* 3. Formulario Interactivo de Solicitud de Apoyo Integral */}

      <section

        id="formulario-solicitud"

        className="bg-white p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4"

      >

        <div className="space-y-1">

          <div className="inline-flex items-center gap-1.5 text-emerald-700">

            <AsonapaqLogo size="xs" />

            <span className="text-[11px] font-bold uppercase tracking-wider">

              AcompaÃƒÂ±amiento Activo Oficial

            </span>

          </div>

          <h2 className="text-xl font-bold text-slate-900">

            Solicitud de Apoyo Integral

          </h2>

          <p className="text-xs text-slate-600">

            Completa este formulario oficial para canalizar tu requerimiento con nuestro comitÃƒÂ© de apoyo social en Panamá¡.

          </p>

        </div>



        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Selector de Requerimiento */}

          <div className="space-y-2">

            <label className="block text-xs font-bold text-slate-800">

              Selecciona el tipo de requerimiento <span className="text-rose-600">*</span>

            </label>

            <div className="space-y-2">

              {[

                { id: 'insumos_oncológicos', label: 'Insumás OncolÃƒÂ³gicos (Agujas Huber / Port-a-Cath)', icon: Syringe },

                { id: 'apoyo_psicologico', label: 'Apoyo PsicolÃƒÂ³gico y TanatologÃƒÂ­a', icon: Brain },

                { id: 'suplementacion_nutrición Nutricional Especializada', icon: Utensils },

                { id: 'alojamiento_temporal', label: 'Alojamiento Temporal para Paciente del Interior', icon: Home }

              ].map((opt) => (

                <label

                  key={opt.id}

                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors border ${

                    tipoRequerimiento === opt.id

                      ? 'bg-emerald-50/70 border-emerald-600 text-slate-900'

                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700'

                  }`}

                >

                  <input

                    type="radio"

                    name="requerimiento"

                    value={opt.id}

                    checked={tipoRequerimiento === opt.id}

                    onChange={(e) => setTipoRequerimiento(e.target.value)}

                    className="w-4 h-4 text-emerald-700 accent-emerald-700 cursor-pointer"

                  />

                  <opt.icon className="w-4 h-4 text-emerald-700 flex-shrink-0" />

                  <span className="text-xs font-medium">{opt.label}</span>

                </label>

              ))}

            </div>

          </div>



          {/* Nombre */}

          <div className="space-y-1">

            <label className="block text-xs font-bold text-slate-800" htmlFor="nombre-input">

              Nombre completo del paciente <span className="text-rose-600">*</span>

            </label>

            <input

              id="nombre-input"

              type="text"

              required

              value={nombre}

              onChange={(e) => setNombre(e.target.value)}

              placeholder="Ej. MarÃƒÂ­a Antonia Castillo"

              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"

            />

          </div>



          {/* CÃƒÂ©día */}

          <div className="space-y-1">

            <label className="block text-xs font-bold text-slate-800" htmlFor="cedía-input">

              CÃƒÂ©día de identidad personal o pasaporte <span className="text-rose-600">*</span>

            </label>

            <input

              id="cedía-input"

              type="text"

              required

              value={cedía}

              onChange={(e) => setCedía(e.target.value)}

              placeholder="Ej. 8-765-4321 o PE-123-456"

              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"

            />

          </div>



          {/* Hospital */}

          <div className="space-y-1">

            <label className="block text-xs font-bold text-slate-800" htmlFor="hospital-select">

              Hospital o Centro OncolÃƒÂ³gico de atenciÃƒÂ³n <span className="text-rose-600">*</span>

            </label>

            <select

              id="hospital-select"

              required

              value={hospital}

              onChange={(e) => setHospital(e.target.value)}

              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"

            >

              <option value="" disabled>

                Selecciona tu centro médico

              </option>

              <option value="Instituto OncolÃƒÂ³gico Nacional (ION)">

                Instituto OncolÃƒÂ³gico Nacional (ION - AncÃƒÂ³n)

              </option>

              <option value="Complejo Hospitalario Dr. Arnulfo Arias Madrid (CSS)">

                Complejo Hospitalario Dr. Arnulfo Arias Madrid (CSS)

              </option>

              <option value="Ciudad día Salud / PediatrÃƒÂ­a">

                Ciudad día Salud / Hospital de Especialidades PediÃƒÂ¡tricas

              </option>

              <option value="Hospital Regional Dr. Rafael HernÃƒÂ¡ndez (ChiriquÃƒÂ­)">

                Hospital Regional Dr. Rafael HernÃƒÂ¡ndez (David, ChiriquÃƒÂ­)

              </option>

              <option value="Hospital NicolÃƒÂ¡s A. Solano (La Chorrera)">

                Hospital NicolÃƒÂ¡s A. Solano (Panamá¡ Oeste)

              </option>

              <option value="Otro Centro de Salud / Hospital Regional">

                Otro Centro de Salud u Hospital Regional

              </option>

            </select>

          </div>



          {/* Detalle */}

          <div className="space-y-1">

            <label className="block text-xs font-bold text-slate-800" htmlFor="detalle-textarea">

              Detalle día solicitud mÃƒÂ©día y situaciÃƒÂ³n actual <span className="text-rose-600">*</span>

            </label>

            <textarea

              id="detalle-textarea"

              required

              rows={3}

              value={detalle}

              onChange={(e) => setDetalle(e.target.value)}

              placeholder="Especifica el calibre de aguja Huber, tipo de suplemento prescrito o fechas tentativas de tratamiento..."

              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"

            />

          </div>



          {/* Adjuntar Receta */}

          <div className="space-y-1.5">

            <label className="block text-xs font-bold text-slate-800">

              Adjuntar receta o indicaciÃƒÂ³n mÃƒÂ©día (Foto o PDF) <span className="text-rose-600">*</span>

            </label>

            <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:bg-slate-100/70 transition-colors cursor-pointer relative">

              <input

                type="file"

                accept=".pdf,image/*"

                onChange={(e) => {

                  if (e.target.files && e.target.files[0]) {

                    setFileName(e.target.files[0].name);

                  }

                }}

                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"

              />

              <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-emerald-700">

                <UploadCloud className="w-5 h-5" />

              </div>

              <div>

                <p className="text-xs font-bold text-slate-800">

                  {fileName ? fileName : 'Subir documento o fotografÃƒÂ­a de receta'}

                </p>

                <p className="text-[10px] text-slate-500">

                  Formás JPG, PNG o PDF (Hasta 10 MB)

                </p>

              </div>

              <span className="px-3 py-1 bg-white rounded-full text-[11px] font-semibold text-emerald-700 border border-emerald-200 shadow-2xs">

                {fileName ? 'Cambiar archivo' : 'Explorar dispositivo'}

              </span>

            </div>

          </div>



          {/* Submit Button */}

          <button

            type="submit"

            disabled={isSubmitting}

            className="w-full h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all text-sm disabled:opacity-70"

          >

            {isSubmitting ? (

              <span className="flex items-center gap-2">

                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                <span>Transmitiendía n8n...</span>

              </span>

            ) : (

              <span className="flex items-center gap-2">

                <Send className="w-4 h-4" />

                <span>Registrar Solicitud en ASONAPAQ</span>

              </span>

            )}

          </button>

        </form>



        {/* Success message banner */}

        <AnimatePresence>

          {showSuccess && (

            <motion.div

              initial={{ opacity: 0, y: 10 }}

              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0 }}

              className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl space-y-1.5"

            >

              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs sm:text-sm">

                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />

                <span>Solicitud Registrada con Ãƒâ€°xito ({submittedExpedienteId})</span>

              </div>

              <p className="text-xs text-slate-700 leading-relaxed pl-7">

                Tu expediente solidario ha sido recibido. El webhook de n8n ha notificado al equipo de Trabajo Social de ASONAPAQ para coordinar la entrega en Panamá¡.

              </p>

            </motion.div>

          )}

        </AnimatePresence>

      </section>



      {/* 4. Gestionamá¡) */}

      <section className="bg-slate-100/80 p-5 rounded-3xl space-y-3.5 border border-slate-200/60">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-2xl bg-white text-slate-800 flex items-center justify-center flex-shrink-0 shadow-xs border border-slate-200">

            <Scale className="w-5 h-5 text-emerald-700" />

          </div>

          <div>

            <h2 className="text-sm font-bold text-slate-900">Gestión de Datos y Derechos</h2>

            <p className="text-[11px] text-slate-500">

              Privacidad amparada bajo la Ley 81 de ProtecciÃƒÂ³n de Datos de Panamá¡

            </p>

          </div>

        </div>



        <div className="space-y-2 pt-1">

          {/* Editar datos */}

          <button

            type="button"

            onClick={() => {

              const el = document.getElementById('formulario-solicitud');

              el?.scrollIntoView({ behavior: 'smooth' });

              document.getElementById('nombre-input')?.focus();

            }}

            className="w-full h-12 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-full flex items-center justify-between px-4 shadow-xs border border-slate-200/80 active:scale-[0.98] transition-transform text-xs"

          >

            <div className="flex items-center gap-2.5">

              <FileText className="w-4 h-4 text-emerald-700" />

              <span>Editar más datos personales</span>

            </div>

            <ChevronRight className="w-4 h-4 text-slate-400" />

          </button>



          {/* HÃƒÂ¡beas día */}

          <button

            type="button"

            onClick={() => setShowHabeasModal(true)}

            className="w-full h-12 bg-white hover:bg-rose-50 text-rose-800 font-semibold rounded-full flex items-center justify-between px-4 shadow-xs border border-rose-200/80 active:scale-[0.98] transition-transform text-xs"

          >

            <div className="flex items-center gap-2.5 text-left">

              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />

              <span className="truncate">Solicitar eliminaciÃƒÂ³n de más datos (HÃƒÂ¡beas día)</span>

            </div>

            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />

          </button>

        </div>



        <p className="text-[11px] text-slate-500 text-center leading-relaxed px-2">

          En cumplimiento con la <strong>Ley 81 de 2019 de la República de Panamá</strong>, ASONAPAQ resguarda bajo confidencialidad mÃƒÂ©día todos los historiales y solicitudes oncológicas.

        </p>



        {habeasSuccess && (

          <div className="p-3 bg-rose-100 text-rose-900 rounded-2xl text-xs text-center font-medium">

            Ã¢Å“â€œ Su requerimiento de HÃƒÂ¡beas día ha sido tramitado formalmente ante la AsesorÃƒÂ­a Legal de ASONAPAQ.

          </div>

        )}

      </section>



      {/* Modal HÃƒÂ¡beas día (Ley 81 de Panamá¡) */}

      <AnimatePresence>

        {showHabeasModal && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">

            <motion.div

              initial={{ scale: 0.9, opacity: 0 }}

              animate={{ scale: 1, opacity: 1 }}

              exit={{ scale: 0.9, opacity: 0 }}

              className="bg-white w-full max-w-2xl p-6 rounded-3xl shadow-2xl border border-slate-100 space-y-4"

            >

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-2.5">

                  <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">

                    <Scale className="w-5 h-5" />

                  </div>

                  <div>

                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">

                      Aviso Legal Formal

                    </span>

                    <h3 className="text-base font-bold text-slate-900">

                      Derecho de HÃƒÂ¡beas día

                    </h3>

                  </div>

                </div>

                <button

                  type="button"

                  onClick={() => setShowHabeasModal(false)}

                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"

                >

                  <X className="w-4 h-4" />

                </button>

              </div>



              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">

                <p>

                  Usted tiene el derecho legal, bajo la{' '}

                  <strong>Ley 81 de 2019 sobre ProtecciÃƒÂ³n de Datos Personales de Panamá¡</strong>, a revocar su consentimiento y solicitar la cancelación definitiva de su registro, historial clínico y datos personales de nuestros archivos.

                </p>

                <div className="bg-slate-100 p-3 rounded-2xl text-[11px] text-slate-700">

                  Ã¢Å¡Â Ã¯Â¸Â Al proceder, se cerrarÃƒÂ¡n de forma permanente sus solicitudes activas de insumos y beneficios asistenciales de ASONAPAQ.

                </div>

              </div>



              <div className="flex flex-col gap-2 pt-1">

                <button

                  type="button"

                  onClick={handleConfirmHabeasdía}

                  className="w-full h-11 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-full text-xs transition-colors shadow-sm"

                >

                  Confirmar eliminaciÃƒÂ³n definitiva (Purga n8n)

                </button>

                <button

                  type="button"

                  onClick={() => setShowHabeasModal(false)}

                  className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-full text-xs transition-colors"

                >

                  Cancelar y mantener mi expediente

                </button>

              </div>

            </motion.div>

          </div>

        )}

      </AnimatePresence>



      {/* Modal GuÃƒÂ­a Nutricional */}

      <AnimatePresence>

        {showNutritionModal && (

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">

            <motion.div

              initial={{ scale: 0.9, opacity: 0 }}

              animate={{ scale: 1, opacity: 1 }}

              exit={{ scale: 0.9, opacity: 0 }}

              className="bg-white w-full max-w-2xl p-6 rounded-3xl shadow-2xl border border-slate-100 space-y-4 text-center"

            >

              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">

                <Download className="w-8 h-8 text-emerald-700" />

              </div>

              <div className="space-y-1">

                <h3 className="text-base font-bold text-slate-900">

                  GuÃƒÂ­a Descargada con Ãƒâ€°xito

                </h3>

                <p className="text-xs text-slate-600">

                  El manual &ldquo;NutriciÃƒÂ³n en quimioterapia - ASONAPAQ&rdquo; ha sido enviadía tu dispositivo con recomendaciones para mitigar nÃƒÂ¡useas y recetas de Panamá¡.

                </p>

              </div>

              <button

                type="button"

                onClick={() => setShowNutritionModal(false)}

                className="w-full h-11 bg-emerald-700 text-white font-semibold rounded-full text-xs shadow-md"

              >

                Entendido

              </button>

            </motion.div>

          </div>

        )}

      </AnimatePresence>

    </div>

  );

};











