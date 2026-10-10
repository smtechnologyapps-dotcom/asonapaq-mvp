'use client';

import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ModalCambioClaveProps {
  isOpen: boolean;
  onSuccess: () => void;
  cedula?: string;
  isMandatory?: boolean; // Si es obligatorio por primer ingreso no puede cerrarse
  onClose?: () => void;
}

export const ModalCambioClave: React.FC<ModalCambioClaveProps> = ({
  isOpen,
  onSuccess,
  cedula,
  isMandatory = false,
  onClose
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPass = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (cleanPass.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (cleanPass !== cleanConfirm) {
      setErrorMsg('Las contraseñas no coinciden. Por favor verifique.');
      return;
    }

    if (cleanPass === 'Asonapaq2025*') {
      setErrorMsg('La nueva contraseña debe ser diferente a la contraseña genérica predeterminada.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Actualizar contraseña directamente en Supabase Auth y marcar metadato
      const { data, error } = await supabase.auth.updateUser({
        password: cleanPass,
        data: {
          clave_cambiada: true,
          clave_cambiada_at: new Date().toISOString()
        }
      });

      if (error) {
        throw error;
      }

      // 2. Registrar en huella digital (audit_logs)
      try {
        await supabase.from('audit_logs').insert({
          action: isMandatory ? 'ACTIVACION_CLAVE_PRIMER_INGRESO' : 'CAMBIO_CLAVE_USUARIO',
          entity_type: 'autenticacion',
          entity_id: data?.user?.id || 'auth-user',
          actor_email: data?.user?.email || (cedula ? `${cedula}@asonapaq.local` : 'usuario@asonapaq.local'),
          actor_role: data?.user?.user_metadata?.rol || 'paciente',
          details: {
            motivo: isMandatory ? 'Primer ingreso y personalización de contraseña' : 'Cambio voluntario de credenciales',
            cedula: cedula || data?.user?.user_metadata?.cedula || 'N/A',
            timestamp: new Date().toISOString()
          }
        });
      } catch (logErr) {
        console.warn('Registro de auditoría secundario no crítico:', logErr);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error al actualizar contraseña:', err);
      setErrorMsg(err.message || 'Error al cambiar la contraseña. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white max-w-md w-full rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative"
      >
        {/* Cabecera */}
        <div className="bg-slate-900 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
          <div className="mx-auto bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-3 text-emerald-400">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white">
            {isMandatory ? 'Crea tu Contraseña Personal' : 'Actualizar Contraseña'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {isMandatory
              ? 'Por seguridad y cumplimiento de la Ley 81 de Protección de Datos de Panamá, personaliza tu clave de acceso.'
              : 'Ingresa tu nueva clave de acceso seguro.'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3.5 rounded-xl border border-rose-200 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Nueva Contraseña */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Nueva Contraseña *
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 pr-11 focus:outline-emerald-500 focus:bg-white transition-all"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPassword ? 'Ocultar contraseña' : 'Ver lo que estoy escribiendo'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Confirmar Nueva Contraseña *
            </label>
            <div className="relative">
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                minLength={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 pr-11 focus:outline-emerald-500 focus:bg-white transition-all"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showConfirmPassword ? 'Ocultar contraseña' : 'Ver lo que estoy escribiendo'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {password && confirmPassword && password === confirmPassword && (
              <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Las contraseñas coinciden
              </p>
            )}
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              {isLoading ? 'Guardando Contraseña...' : 'Guardar y Entrar'}
            </button>

            {!isMandatory && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all text-xs"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
