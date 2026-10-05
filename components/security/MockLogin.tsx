import React, { useState } from 'react';
import { Shield, Lock, User, ChevronRight } from 'lucide-react';

interface MockLoginProps {
  targetRole: 'paciente' | 'voluntario' | 'admin';
  onSuccess: () => void;
}

export const MockLogin: React.FC<MockLoginProps> = ({ targetRole, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const roleTitles = {
    paciente: 'Portal de Pacientes',
    voluntario: 'Portal de Voluntarios',
    admin: 'Panel de Administración'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 1200);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
          
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-white/20">
            {targetRole === 'paciente' ? <User className="w-8 h-8 text-white" /> :
             targetRole === 'voluntario' ? <Shield className="w-8 h-8 text-white" /> :
             <Lock className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Acceso Restringido</h2>
          <p className="text-sm text-slate-300 font-medium">{roleTitles[targetRole]}</p>
        </div>
        
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">
              {targetRole === 'paciente' ? 'Cédula o Correo' : 'Correo Electrónico'}
            </label>
            <input 
              type="text" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder={targetRole === 'paciente' ? 'Ej. 8-000-0000' : 'usuario@asonapaq.org'}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl px-4 py-3.5 text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                <>
                  <span>Ingresar al Portal</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
          
          <div className="text-center pt-2">
            <p className="text-[10px] text-slate-400 leading-relaxed px-4">
              Sus credenciales están protegidas y encriptadas conforme a la Ley 81 de Protección de Datos Personales.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};



