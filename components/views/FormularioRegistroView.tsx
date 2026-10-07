'use client';

import React, { useState } from 'react';
import { AppRoute } from '../../lib/types';
import { ShieldAlert, CheckCircle2, ChevronRight, ChevronLeft, User, Heart, Activity, Phone, Save } from 'lucide-react';
import { AsonapaqLogo } from '../AsonapaqLogo';
import { supabase } from '../../lib/supabase';

interface FormularioRegistroViewProps {
  onRouteChange?: (route: AppRoute) => void;
}

export const FormularioRegistroView: React.FC<FormularioRegistroViewProps> = ({ onRouteChange }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'paciente' | 'voluntario' | ''>('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nombre: '', cedula: '', email: '', password: '', celular: '',
    fechaNacimiento: '', sexo: '', estadoCivil: '', nivelAcademico: '',
    provincia: '', direccion: '', tipoSangre: '', donante: 'No',
    contactoEmergencia: '', telEmergencia: '', parentesco: '',
    // Medical (Pacientes)
    diagnostico: '', etapa: '', atencion: 'ION', tratamiento: '', medicamento: '',
    // Volunteer
    tipoApoyo: '', diasDisponibles: '', pasatiempo: '', estatusLaboral: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { nombre_completo: formData.nombre, cedula: formData.cedula, rol: userType }
        }
      });
      if (authError) throw authError;

      if (authData.user) {
        // 2. Actualizar resto del perfil
        const { error: profileError } = await supabase.from('perfiles').update({
          celular: formData.celular,
          fecha_nacimiento: formData.fechaNacimiento || null,
          sexo: formData.sexo,
          estado_civil: formData.estadoCivil,
          nivel_academico: formData.nivelAcademico,
          provincia: formData.provincia,
          direccion: formData.direccion,
          tipo_sangre: formData.tipoSangre,
          contacto_emergencia: formData.contactoEmergencia,
          tel_emergencia: formData.telEmergencia,
          parentesco_emergencia: formData.parentesco
        }).eq('id', authData.user.id);
        if (profileError) throw profileError;

        // 3. Insertar datos específicos
        if (userType === 'paciente') {
          await supabase.from('datos_medicos_pacientes').insert({
            id: authData.user.id,
            diagnostico_principal: formData.diagnostico,
            etapa_cancer: formData.etapa,
            centro_atencion: formData.atencion,
            tratamiento_actual: formData.tratamiento,
            medicamentos: formData.medicamento,
            donante_sangre: formData.donante === 'Sí'
          });
        } else if (userType === 'voluntario') {
          await supabase.from('datos_voluntarios').insert({
            id: authData.user.id,
            estatus_laboral: formData.estatusLaboral,
            area_apoyo: formData.tipoApoyo,
            pasatiempos: formData.pasatiempo
          });
        }
      }

      alert('¡Registro completado exitosamente! Hemos asegurado tu información.');
      if (onRouteChange) onRouteChange('inicio_publica');
    } catch (err: any) {
      console.error(err);
      alert('Error al registrar: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // PANTALLA 0: LEY DE PROTECCIÓN DE DATOS
  if (!acceptedTerms) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <div className="bg-white max-w-2xl w-full rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          
          <div className="mx-auto bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-10 h-10 text-emerald-600" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-4">Aviso de Privacidad y Consentimiento</h2>
          
          <div className="text-left text-sm text-slate-600 space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <p>
              De conformidad con la <strong>Ley 81 de 2019 sobre Protección de Datos Personales de la República de Panamá</strong>, 
              ASONAPAQ le informa que los datos personales y médicos sensibles recopilados en este formulario 
              serán tratados con estricta confidencialidad.
            </p>
            <p>
              <strong>Finalidad:</strong> Su información será utilizada exclusivamente para la gestión de apoyos solidarios, 
              coordinación de voluntariado, seguimiento médico en el Instituto Oncológico Nacional (ION) e informes estadísticos anonimizados.
            </p>
            <p>
              <strong>Derechos ARCO:</strong> Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al uso de sus datos en cualquier momento.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => setAcceptedTerms(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              He leído y acepto compartir mis datos
            </button>
            <button
              onClick={() => onRouteChange?.('inicio_publica')}
              className="w-full bg-white text-slate-500 hover:bg-slate-50 font-bold py-3 rounded-xl transition-all"
            >
              Cancelar y volver al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PANTALLAS DE REGISTRO
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Formulario */}
        <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black mb-1">Registro Oficial</h2>
            <p className="text-slate-400 text-sm">Paso {step} de {userType ? '3' : '2'} • {
              step === 1 ? 'Tipo de Perfil' : 
              step === 2 ? 'Información Personal' : 
              'Datos Específicos'
            }</p>
          </div>
          <AsonapaqLogo size="sm" />
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          
          {/* PASO 1: SELECCIÓN DE PERFIL */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">¿Cómo deseas unirte a nuestra familia?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setUserType('paciente')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    userType === 'paciente' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <Heart className={`w-8 h-8 mb-4 ${userType === 'paciente' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Soy Paciente</h4>
                  <p className="text-sm text-slate-500">Deseo registrarme para recibir apoyo, insumos o seguimiento en mi tratamiento.</p>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('voluntario')}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    userType === 'voluntario' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <User className={`w-8 h-8 mb-4 ${userType === 'voluntario' ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <h4 className="text-lg font-bold text-slate-900 mb-2">Quiero ser Voluntario</h4>
                  <p className="text-sm text-slate-500">Deseo donar mi tiempo y habilidades para apoyar a los pacientes.</p>
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: DATOS PERSONALES GENERALES */}
          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Nombre Completo</label>
                  <input required name="nombre" value={formData.nombre} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej. Ana Pérez" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Cédula o Pasaporte</label>
                  <input required name="cedula" value={formData.cedula} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej. 8-000-0000" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Correo Electrónico</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej. correo@ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Crear Contraseña</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Mínimo 6 caracteres" minLength={6} />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Celular</label>
                  <input required type="tel" name="celular" value={formData.celular} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej. 6000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Fecha de Nacimiento</label>
                  <input required type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Sexo</label>
                  <select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500">
                    <option value="">Seleccione...</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Provincia de Residencia</label>
                  <select name="provincia" value={formData.provincia} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500">
                    <option value="">Seleccione...</option>
                    <option value="Panamá">Panamá</option>
                    <option value="Panamá Oeste">Panamá Oeste</option>
                    <option value="Chiriquí">Chiriquí</option>
                    <option value="Colón">Colón</option>
                    <option value="Veraguas">Veraguas</option>
                    <option value="Herrera">Herrera</option>
                    <option value="Los Santos">Los Santos</option>
                    <option value="Coclé">Coclé</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-600"/> Contacto de Emergencia</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Nombre del Contacto</label>
                    <input required name="contactoEmergencia" value={formData.contactoEmergencia} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Teléfono</label>
                    <input required name="telEmergencia" value={formData.telEmergencia} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Parentesco</label>
                    <input required name="parentesco" value={formData.parentesco} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej. Hijo/a, Esposo/a" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: DATOS ESPECÍFICOS */}
          {step === 3 && userType === 'paciente' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-600"/> Historial Clínico</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Diagnóstico Principal</label>
                  <input required name="diagnostico" value={formData.diagnostico} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej. Cáncer de Mama" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Etapa</label>
                  <select name="etapa" value={formData.etapa} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500">
                    <option value="">Seleccione...</option>
                    <option value="Etapa I">Etapa I</option>
                    <option value="Etapa II">Etapa II</option>
                    <option value="Etapa III">Etapa III</option>
                    <option value="Etapa IV">Etapa IV</option>
                    <option value="Remisión">En Remisión</option>
                    <option value="Desconozco">Desconozco</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Centro de Atención Primario</label>
                  <select name="atencion" value={formData.atencion} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500">
                    <option value="ION">Instituto Oncológico Nacional (ION)</option>
                    <option value="CSS">Caja de Seguro Social (CSS)</option>
                    <option value="Privado">Hospital Privado</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Tratamiento Actual</label>
                  <select name="tratamiento" value={formData.tratamiento} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500">
                    <option value="">Seleccione...</option>
                    <option value="Quimioterapia">Quimioterapia</option>
                    <option value="Radioterapia">Radioterapia</option>
                    <option value="Cirugía">Cirugía</option>
                    <option value="Terapia Hormonal">Terapia Hormonal</option>
                    <option value="Inmunoterapia">Inmunoterapia</option>
                    <option value="Ninguno">Ninguno / Seguimiento</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Medicamentos Actuales (Opcional)</label>
                  <textarea name="medicamento" value={formData.medicamento} onChange={handleChange} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej. Tamoxifeno, Anastrazol..."></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 3 && userType === 'voluntario' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-emerald-600"/> Perfil de Voluntariado</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Estatus Laboral</label>
                  <select required name="estatusLaboral" value={formData.estatusLaboral} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500">
                    <option value="">Seleccione...</option>
                    <option value="Laborando">Laborando</option>
                    <option value="Estudiante">Estudiante Universitario</option>
                    <option value="Jubilado">Jubilado/a</option>
                    <option value="Independiente">Independiente</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Área de Apoyo de Interés</label>
                  <select required name="tipoApoyo" value={formData.tipoApoyo} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500">
                    <option value="">Seleccione...</option>
                    <option value="Acompañamiento">Acompañamiento a pacientes</option>
                    <option value="Docencia">Charlas y Docencia</option>
                    <option value="Logística">Logística y Eventos</option>
                    <option value="Donación">Obtención de Recursos</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Pasatiempos / Habilidades (Opcional)</label>
                  <textarea name="pasatiempo" value={formData.pasatiempo} onChange={handleChange} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej. Tocar guitarra, manualidades, fotografía..."></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Navegación del Formulario */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Atrás
              </button>
            ) : <div></div>}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !userType}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> {isSubmitting ? 'Guardando...' : 'Enviar Registro'}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
