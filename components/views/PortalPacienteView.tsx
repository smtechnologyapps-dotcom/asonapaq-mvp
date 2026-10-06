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

  onPurgePatientData: (cedula: string) => void;

}



export const PortalPacienteView: React.FC<PortalPacienteViewProps> = ({

  onAddPatientRecord,

  onPurgePatientData

}) => {

  // Form state

  const [tipoRequerimiento, setTipoRequerimiento] = useState('insumos_oncológicos');

  const [nombre, setNombre] = useState('');

  const [cedula, setCédula] = useState('');

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

    if (!nombre || !cedula || !hospital || !detalle) return;



    setIsSubmitting(true);



    const generatedId = Math.floor(Math.random() * 8000 + 1000);

    const expedienteStr = `EXP-2025-${generatedId}`;



    const newRecord: PatientRecord = {

      id: generatedId,

      nombre,

      cedula,

      diagnostico:

        tipoRequerimiento === 'insumos_oncológicos'

          ? 'Quimioterapia Ambulatoria (Insumos)'

          : tipoRequerimiento === 'suplementacion_nutricional'

          ? 'Soporte Nutricional Oncológico'

          : tipoRequerimiento === 'alojamiento_temporal'

          ? 'Alojamiento Foráneo ION'

          : 'Contención Emocional Activa',

      hospital,

      apoyo:

        tipoRequerimiento === 'insumos_oncológicos'

          ? 'Insumos Oncológicos'

          : tipoRequerimiento === 'suplementacion_nutricional'

          ? 'Suplementación Nutricional'

          : tipoRequerimiento === 'alojamiento_temporal'

          ? 'Alojamiento Temporal'

          : 'Apoyo Psicológico',

      region: hospital.includes('Chiriquíí')

        ? 'Chiriquíí'

        : hospital.includes('Solano')

        ? 'Panamáá Oeste'

        : 'Panamáá Centro',

      estado: 'En Tratamiento ION',

      fechaRegistro: new Date().toISOString().split('T')[0],

      observaciones: detalle

    };



    // Trigger external n8n webhook placeholder

    await triggerN8NWebhook('EVT_REGISTRAR_SOLICITUD_PACIENTE', 'Registrar Solicitud en ASONAPAQ', {

      expediente_id: expedienteStr,

      tipo_requerimiento: tipoRequerimiento,

      nombre_paciente: nombre,

      cedula_paciente: cedula,

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

    setCédula('');

    setHospital('');

    setDetalle('');

    setFileName('');

  };



  const handleConfirmHabeasdía = async () => {

    await triggerN8NWebhook(

      'EVT_HABEAS_DATA_ELIMINACION',

      'Confirmar Eliminación Definitiva (Ley 81 de Panamáá)',

      {

        action: 'HABEAS_DATA_PURGE',

        solicitante_cedula: cedula || '8-765-4321',

        legal_basis: 'Ley 81 de 2019 día República de Panamáá sobre Protección de Datos Personales',

        requested_at: new Date().toISOString()

      }

    );



    if (cedula) {

      onPurgePatientData(cedula);

    }



    setShowHabeasModal(false);

    setHabeasSuccess(true);

    setTimeout(() => setHabeasSuccess(false), 5000);

  };



  const handleDownloadía = async () => {

    await triggerN8NWebhook(

      'EVT_DESCARGA_GUIA_NUTRICIONAL',

      'Descargar Guía Clínica Nutricional (PDF)',

      {

        resource: 'GUIA_NUTRICION_Quimioterapia_ASONAPAQ',

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

            <AsonapaqLogo size="sm" />

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



      {/* 1. Sección de Emergencia Médía Oncológica - ION */}

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

                Atención Médía Inmedía

              </span>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5" id="emergencia-heading">

                Central Telefónica Ã¢â‚¬â€ ION

              </h2>

              <p className="text-xs text-slate-700 mt-1 leading-snug">

                Instituto Oncológico Nacional Dr. Juan Demóstenes Arosemena. Orientación ante fiebre post-Quimioterapia, neutropenia o complicaciones agudías.

              </p>

            </div>

          </div>



          {/* Horarios */}

          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl flex items-center gap-2.5 border border-rose-200/60">

            <Clock className="w-4 h-4 text-rose-600 flex-shrink-0" />

            <p className="text-xs text-slate-800 font-medium">

              Urgencias: 24 horas continuas, los 365 días del año.

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

          {/* Tarjeta Nutrición */}

          <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-3">

            <div className="flex items-start gap-3.5">

              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center flex-shrink-0 border border-teal-100">

                <Utensils className="w-6 h-6 text-teal-700" />

              </div>

              <div className="space-y-1 min-w-0">

                <span className="inline-block bg-teal-100 text-teal-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold">

                  Guía Clínica Nutricional

                </span>

                <h3 className="text-base font-bold text-slate-900 leading-tight">

                  Nutrición en Quimioterapia

                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">

                  Consejos prácticos para mitigar náuseas, combatir la pérdía del apetito y recetas reconfortantes diseñadías por especialistas oncológicos de Panamáá.

                </p>

              </div>

            </div>



            <button

              type="button"

              onClick={handleDownloadía}

              className="w-full h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-full flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-xs sm:text-sm"

            >

              <Download className="w-4 h-4 text-emerald-700" />

              <span>Descargar Guía (PDF)</span>

            </button>

          </div>



          {/* Tarjeta Banco de Insumos */}

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

                  Banco de Insumos Oncológicos

                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">

                  Disponibilidad solidía de agujas Huber, catéteres Port-a-Cath, cremás dermoprotectoras para radioterapia y kits de aseo estéril.

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

            <AsonapaqLogo size="sm" />

            <span className="text-[11px] font-bold uppercase tracking-wider">

              Acompañamiento Activo Oficial

            </span>

          </div>

          <h2 className="text-xl font-bold text-slate-900">

            Solicitud de Apoyo Integral

          </h2>

          <p className="text-xs text-slate-600">

            Completa este formulario oficial para canalizar tu requerimiento con nuestro comité de apoyo social en Panamáá.

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

                { id: 'insumos_oncológicos', label: 'Insumos Oncológicos (Agujas Huber / Port-a-Cath)', icon: Syringe },

                { id: 'apoyo_psicologico', label: 'Apoyo Psicológico y Tanatología', icon: Brain },

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

              placeholder="Ej. María Antonia Castillo"

              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"

            />

          </div>



          {/* Cédula */}

          <div className="space-y-1">

            <label className="block text-xs font-bold text-slate-800" htmlFor="cedula-input">

              Cédula de identidad personal o pasaporte <span className="text-rose-600">*</span>

            </label>

            <input

              id="cedula-input"

              type="text"

              required

              value={cedula}

              onChange={(e) => setCédula(e.target.value)}

              placeholder="Ej. 8-765-4321 o PE-123-456"

              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-inner"

            />

          </div>



          {/* Hospital */}

          <div className="space-y-1">

            <label className="block text-xs font-bold text-slate-800" htmlFor="hospital-select">

              Hospital o Centro Oncológico de atención <span className="text-rose-600">*</span>

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

              <option value="Instituto Oncológico Nacional (ION)">

                Instituto Oncológico Nacional (ION - Ancón)

              </option>

              <option value="Complejo Hospitalario Dr. Arnulfo Arias Madrid (CSS)">

                Complejo Hospitalario Dr. Arnulfo Arias Madrid (CSS)

              </option>

              <option value="Ciudad día Salud / Pediatría">

                Ciudad día Salud / Hospital de Especialidades Pediátricas

              </option>

              <option value="Hospital Regional Dr. Rafael Hernández (Chiriquíí)">

                Hospital Regional Dr. Rafael Hernández (David, Chiriquíí)

              </option>

              <option value="Hospital Nicolás A. Solano (La Chorrera)">

                Hospital Nicolás A. Solano (Panamáá Oeste)

              </option>

              <option value="Otro Centro de Salud / Hospital Regional">

                Otro Centro de Salud u Hospital Regional

              </option>

            </select>

          </div>



          {/* Detalle */}

          <div className="space-y-1">

            <label className="block text-xs font-bold text-slate-800" htmlFor="detalle-textarea">

              Detalle día solicitud médía y situación actual <span className="text-rose-600">*</span>

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

              Adjuntar receta o indicación médía (Foto o PDF) <span className="text-rose-600">*</span>

            </label>

            <div className="p-4 bg-slate-50 border-2 border-díashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:bg-slate-100/70 transition-colors cursor-pointer relative">

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

                  {fileName ? fileName : 'Subir documento o fotografía de receta'}

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

                Tu expediente solidario ha sido recibido. El webhook de n8n ha notificado al equipo de Trabajo Social de ASONAPAQ para coordinar la entrega en Panamáá.

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

              Privacidad amparada bajo la Ley 81 de Protección de Datos de Panamáá

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



          {/* Hábeas día */}

          <button

            type="button"

            onClick={() => setShowHabeasModal(true)}

            className="w-full h-12 bg-white hover:bg-rose-50 text-rose-800 font-semibold rounded-full flex items-center justify-between px-4 shadow-xs border border-rose-200/80 active:scale-[0.98] transition-transform text-xs"

          >

            <div className="flex items-center gap-2.5 text-left">

              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />

              <span className="truncate">Solicitar eliminación de más datos (Hábeas día)</span>

            </div>

            <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0" />

          </button>

        </div>



        <p className="text-[11px] text-slate-500 text-center leading-relaxed px-2">

          En cumplimiento con la <strong>Ley 81 de 2019 de la República de Panamááá</strong>, ASONAPAQ resguarda bajo confidencialidad médía todos los historiales y solicitudes oncológicas.

        </p>



        {habeasSuccess && (

          <div className="p-3 bg-rose-100 text-rose-900 rounded-2xl text-xs text-center font-medium">

            Ã¢Å“â€œ Su requerimiento de Hábeas día ha sido tramitado formalmente ante la Asesoría Legal de ASONAPAQ.

          </div>

        )}

      </section>



      {/* Modal Hábeas día (Ley 81 de Panamáá) */}

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

                      Derecho de Hábeas día

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

                  <strong>Ley 81 de 2019 sobre Protección de Datos Personales de Panamáá</strong>, a revocar su consentimiento y solicitar la cancelación definitiva de su registro, historial clínico y datos personales de nuestros archivos.

                </p>

                <div className="bg-slate-100 p-3 rounded-2xl text-[11px] text-slate-700">

                  Ã¢Å¡Â Ã¯Â¸Â Al proceder, se cerrarán de forma permanente sus solicitudes activas de insumos y beneficios asistenciales de ASONAPAQ.

                </div>

              </div>



              <div className="flex flex-col gap-2 pt-1">

                <button

                  type="button"

                  onClick={handleConfirmHabeasdía}

                  className="w-full h-11 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-full text-xs transition-colors shadow-sm"

                >

                  Confirmar eliminación definitiva (Purga n8n)

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



      {/* Modal Guía Nutricional */}

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

                  Guía Descargada con Ãƒâ€°xito

                </h3>

                <p className="text-xs text-slate-600">

                  El manual &ldquo;Nutrición en Quimioterapia - ASONAPAQ&rdquo; ha sido enviadía tu dispositivo con recomendaciones para mitigar náuseas y recetas de Panamáá.

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











