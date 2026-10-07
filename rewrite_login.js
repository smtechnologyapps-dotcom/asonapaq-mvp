const fs = require('fs');
let loginPath = 'components/security/MockLogin.tsx';
let loginText = \'use client';

import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MockLoginProps {
  targetRole: 'paciente' | 'voluntario';
  onSuccess: () => void;
}

export const MockLogin: React.FC<MockLoginProps> = ({ targetRole, onSuccess }) => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Autenticar usando el correo sintético basado en la cédula
      const syntheticEmail = cedula.includes('@') ? cedula : \\@asonapaq.local\;
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: syntheticEmail,
        password: password
      });

      if (error) {
        throw error;
      }

      onSuccess();
    } catch (error: any) {
      console.error(error);
      setErrorMsg('Cédula o contraseña incorrecta. Por favor intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
          <div className="mx-auto bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {targetRole === 'paciente' ? <Heart className="w-8 h-8 text-emerald-400" /> : <User className="w-8 h-8 text-emerald-400" />}
          </div>
          <h2 className="text-2xl font-black text-white">Portal {targetRole === 'paciente' ? 'del Paciente' : 'del Voluntario'}</h2>
          <p className="text-slate-400 text-sm mt-2">Acceso seguro a su expediente y solicitudes</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {errorMsg && (
            <div className="bg-rose-50 text-rose-600 text-sm font-bold p-4 rounded-xl text-center">
              {errorMsg}
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Cédula o Pasaporte</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                value={cedula} 
                onChange={(e) => setCedula(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-emerald-500" 
                placeholder="Ej. 8-000-0000" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Contraseña o PIN</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                required 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:outline-emerald-500" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" /> 
            {isLoading ? 'Verificando...' : 'Ingresar de Forma Segura'}
          </button>
        </form>
      </div>
    </div>
  );
};
\;

fs.writeFileSync(loginPath, loginText, 'utf8');
console.log('Written MockLogin directly');
