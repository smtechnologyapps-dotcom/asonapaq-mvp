'use client';

import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Heart, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ModalCambioClave } from './ModalCambioClave';

interface MockLoginProps {
  targetRole: 'paciente' | 'voluntario' | 'admin';
  onSuccess: () => void;
  onRouteChange?: (route: any) => void;
}

export const MockLogin: React.FC<MockLoginProps> = ({ targetRole, onSuccess, onRouteChange }) => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Control del modal de cambio de clave
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userCedulaToChange, setUserCedulaToChange] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanCedula = cedula.trim();
    const cleanPassword = password.trim();

    // 1. Validación estricta: ambos campos son obligatorios
    if (!cleanCedula || cleanCedula.length < 3) {
      setErrorMsg('Debe ingresar su cédula o usuario obligatoriamente.');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      setErrorMsg('Debe ingresar su contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      // 2. Limpiar cualquier sesión previa huérfana en el navegador
      await supabase.auth.signOut();

      // 3. Autenticar usando el formato sintético estandarizado
      const syntheticEmail = cleanCedula.includes('@') 
        ? cleanCedula.toLowerCase() 
        : `${cleanCedula.toLowerCase()}@asonapaq.local`;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: syntheticEmail,
        password: cleanPassword
      });

      if (error || !data.user) {
        throw error || new Error('Credenciales incorrectas');
      }

      // 4. Verificación de permisos según el panel de acceso
      const userRole = data.user.user_metadata?.rol;
      if (targetRole === 'admin' && userRole !== 'admin') {
        await supabase.auth.signOut();
        setErrorMsg('Acceso denegado: Esta cuenta no posee privilegios administrativos.');
        return;
      }

      // 5. Verificar si ingresó con la contraseña genérica o tiene pendiente cambiar clave
      const meta = data.user.user_metadata || {};
      const enteredGenericPassword = cleanPassword === 'Asonapaq2025*';
      const hasNeverChangedPassword = !meta.clave_cambiada;

      if (enteredGenericPassword || hasNeverChangedPassword) {
        // Obligar al usuario a establecer su contraseña definitiva
        setUserCedulaToChange(cleanCedula);
        setShowPasswordModal(true);
        return;
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error de autenticación:', error);
      setErrorMsg('Cédula o contraseña incorrecta. Por favor verifique sus datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChangeSuccess = () => {
    setShowPasswordModal(false);
    onSuccess();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      {/* Modal Obligatorio de Cambio de Contraseña */}
      <ModalCambioClave
        isOpen={showPasswordModal}
        cedula={userCedulaToChange}
        isMandatory={true}
        onSuccess={handlePasswordChangeSuccess}
      />

      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="mx-auto bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {targetRole === 'paciente' ? <Heart className="w-8 h-8 text-emerald-400" /> : <User className="w-8 h-8 text-emerald-400" />}
          </div>
          <h2 className="text-2xl font-black text-white">
            {targetRole === 'admin' ? 'Acceso Administrativo' : `Portal del ${targetRole === 'paciente' ? 'Paciente' : 'Voluntario'}`}
          </h2>
          <p className="text-slate-400 text-sm mt-2">Ingrese sus credenciales completas para identificarse</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 text-rose-600 text-xs font-bold p-4 rounded-xl text-center border border-rose-200 animate-in fade-in">
              {errorMsg}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Cédula o Usuario *</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                value={cedula} 
                onChange={(e) => setCedula(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-slate-800 focus:outline-emerald-500" 
                placeholder="Ej. omnex o 8-362-114" 
                autoComplete="username"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase">Contraseña o Clave *</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" /> <span>Ocultar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" /> <span>Ver clave</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-11 py-3 text-sm font-bold text-slate-800 focus:outline-emerald-500" 
                placeholder="••••••••" 
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all disabled:opacity-50 active:scale-95"
          >
            <ShieldCheck className="w-5 h-5" /> 
            {isLoading ? 'Verificando Identidad...' : 'Ingresar de Forma Segura'}
          </button>
          
          {onRouteChange && targetRole !== 'admin' && (
            <div className="text-center mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-2">¿No tienes cuenta todavía?</p>
              <button 
                type="button" 
                onClick={() => onRouteChange('registro')}
                className="text-emerald-600 font-bold hover:underline transition-all"
              >
                Regístrate aquí
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
