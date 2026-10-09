'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AsonapaqLogo } from '../AsonapaqLogo';
import { motion, AnimatePresence } from 'motion/react';
import { PackagePlus, Clock, FileText, CheckCircle2, AlertTriangle, Send, X, LogOut, HeartHandshake, Syringe, Utensils, Home } from 'lucide-react';

export const PortalPacienteView = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [tipoApoyo, setTipoApoyo] = useState('Medicamentos e Insumos');
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('perfiles')
        .select('*, datos_medicos_pacientes(*)')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);

      const { data: reqs } = await supabase
        .from('solicitudes_apoyo')
        .select('*')
        .eq('paciente_id', user.id)
        .order('creado_en', { ascending: false });

      setSolicitudes(reqs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('solicitudes_apoyo').insert({
        paciente_id: userProfile.id,
        tipo_apoyo: tipoApoyo,
        descripcion: descripcion,
        estado: 'En Revisión'
      });
      
      if (error) throw error;
      
      alert('Solicitud enviada con éxito');
      setShowForm(false);
      setDescripcion('');
      fetchData();
    } catch (e) {
      alert('Error enviando la solicitud');
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-bold">Cargando tu perfil médico...</div>;
  if (!userProfile) return <div className="p-8 text-center text-rose-500 font-bold">Error: No se encontró tu perfil.</div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 space-y-6">

      {showWelcome && (
        <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl mb-6 shadow-sm flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-emerald-500 text-white p-3 rounded-full shadow-md">
               <HeartHandshake size={24} />
            </div>
            <div>
              <h4 className="text-emerald-900 font-black text-lg md:text-xl">¡Bienvenido/a a tu portal, {userProfile.nombre_completo.split(' ')[0]}!</h4>
              <p className="text-emerald-700 text-sm font-medium">Estamos aquí para apoyarte. Desde este panel puedes gestionar tus solicitudes y revisar tu expediente.</p>
            </div>
          </div>
          <button onClick={() => setShowWelcome(false)} className="text-emerald-400 hover:text-emerald-600 transition-colors z-10 p-2">
            <X size={20} />
          </button>
        </motion.div>
      )}

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <AsonapaqLogo className="w-48 h-48" />
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-2xl md:text-3xl font-black mb-1">{userProfile.nombre_completo}</h1>
          <p className="text-emerald-400 font-bold text-sm mb-4">Cédula: {userProfile.cedula}</p>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 inline-block border border-white/10">
            <p className="text-xs text-slate-300 uppercase font-bold">Diagnóstico Principal</p>
            <p className="text-lg font-bold">{userProfile.datos_medicos_pacientes?.[0]?.diagnostico_principal || 'No registrado'}</p>
            <p className="text-sm text-slate-400 mt-1">Hospital: {userProfile.datos_medicos_pacientes?.[0]?.centro_atencion || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800">Mis Solicitudes</h2>
        <button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20"
        >
          <PackagePlus className="w-4 h-4" /> Nueva Solicitud
        </button>
      </div>

      {solicitudes.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-sm">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-slate-800 font-bold mb-2">No tienes solicitudes activas</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">Puedes solicitar insumos médicos, pasajes, alojamiento, o apoyo nutricional utilizando el botón de arriba.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {solicitudes.map((sol) => (
            <div key={sol.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800">{sol.tipo_apoyo}</span>
                  <span className="text-xs text-slate-400">• {new Date(sol.creado_en).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 text-sm">{sol.descripcion}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                sol.estado === 'Aprobado' ? 'bg-emerald-100 text-emerald-700' : 
                sol.estado === 'Rechazado' ? 'bg-rose-100 text-rose-700' : 
                'bg-amber-100 text-amber-700'
              }`}>
                {sol.estado}
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="font-black text-slate-800 text-lg">Nueva Solicitud de Apoyo</h3>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">¿Qué tipo de apoyo necesitas?</label>
                  <select 
                    value={tipoApoyo} onChange={(e) => setTipoApoyo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500 font-medium"
                  >
                    <option value="Medicamentos e Insumos">Medicamentos e Insumos</option>
                    <option value="Apoyo Nutricional">Apoyo Nutricional</option>
                    <option value="Pasajes / Transporte">Pasajes / Transporte</option>
                    <option value="Alojamiento (Posada)">Alojamiento (Posada)</option>
                    <option value="Soporte Psicológico">Soporte Psicológico</option>
                    <option value="Peluquería / Estética">Peluquería / Estética</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Detalla tu situación / requerimiento</label>
                  <textarea 
                    required rows={4}
                    value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Ej. Requiero apoyo con pampers talla M y ensure..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500 resize-none"
                  ></textarea>
                </div>
                <div className="pt-2">
                  <button 
                    type="submit" disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Enviando...' : 'Enviar Solicitud al Comité'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
