'use client';

import React, { useState } from 'react';
import { AsonapaqLogo } from './AsonapaqLogo';
import { LiveClock } from './LiveClock';
import { AppRoute } from '../lib/types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell,
  PhoneCall,
  User,
  ChevronDown,
  LogOut,
  Shield
} from 'lucide-react';

interface HeaderProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
  unreadCount?: number;
  isAuthenticatedAs?: 'paciente' | 'voluntario' | 'admin' | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onRouteChange,
  unreadCount = 2,
  isAuthenticatedAs,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  const routeLabels: Record<AppRoute, string> = {
    inicio_publica: 'Inicio Pública',
    portal_pacientes: 'Portal del Paciente',
    muro_comunicaciones: 'Muro de Comunidad',
    portal_voluntarios: 'Portal del Voluntario',
    panel_administracion: 'Panel Administración',
    auditoria_social: 'Auditoría Social',
    registro: 'Registro Oficial',
    junta_tecnica: 'Junta Técnica ION'
  };

  const getRoleLabel = () => {
    if (isAuthenticatedAs === 'admin') return 'Coordinador ASONAPAQ';
    if (isAuthenticatedAs === 'paciente') return 'Paciente Solidario';
    if (isAuthenticatedAs === 'voluntario') return 'Voluntario Activo';
    return 'Visitante';
  };

  const notifications = [
    {
      id: 1,
      title: 'Taller de Turbantes Confirmado',
      text: 'Este sábado 18 en Sede ASONAPAQ (9:30 AM).',
      time: 'Hace 30m',
      icon: 'brush'
    }
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#0F172A] text-white shadow-[0_4px_24px_rgba(15,23,42,0.28)] pt-safe">
      <div className="h-16 px-3 sm:px-6 max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <button
          onClick={() => onRouteChange('inicio_publica')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg group transition-transform active:scale-[0.98]"
        >
          <AsonapaqLogo size="sm" showText={false} />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white tracking-tight text-sm sm:text-base font-headline-sm">
                ASONAPAQ
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-300">
              <span className="truncate">Fe · Esperanza · Vida</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <span className="text-emerald-400 font-medium truncate max-w-[100px] sm:max-w-none">
                {routeLabels[currentRoute] || 'Portal'}
              </span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={() => onRouteChange('registro')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-900/50"><span>¡Únete!</span></button>
          <a
            href="tel:512-7000"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-semibold transition-all active:scale-95"
            title="Línea de Urgencia ION (512-7000)"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
            <span>ION: 512-7000</span>
          </a>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleSelector(false);
              }}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0F172A]" />
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Notificaciones Oficiales</span>
                  </div>
                  <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors text-left">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowRoleSelector(!showRoleSelector);
                setShowNotifications(false);
              }}
              className="flex items-center gap-1.5 p-1 pl-1.5 rounded-full bg-emerald-800/60 hover:bg-emerald-700/80 border border-emerald-600/40 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                <User className="w-4 h-4" />
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-300 pr-0.5" />
            </button>

            <AnimatePresence>
              {showRoleSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 text-left"
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {getRoleLabel()}
                  </div>
                  <div className="space-y-1">
                    {!isAuthenticatedAs ? (
                      <button
                        onClick={() => { onRouteChange('portal_pacientes'); setShowRoleSelector(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-emerald-50 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Iniciar Sesión</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => { if(onLogout) onLogout(); setShowRoleSelector(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Cerrar Sesión</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
