'use client';

import React from 'react';
import { AppRoute } from '../lib/types';
import { Home, UserCircle2, MessageSquareHeart, HandHeart, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentRoute: AppRoute;
  onRouteChange: (route: AppRoute) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentRoute, onRouteChange }) => {
  const navItems = [
    { id: 'inicio_publica', label: 'Inicio', icon: Home },
    { id: 'portal_pacientes', label: 'Paciente', icon: UserCircle2 },
    { id: 'muro_comunicaciones', label: 'Comunidad', icon: MessageSquareHeart },
    { id: 'portal_voluntarios', label: 'Voluntario', icon: HandHeart },
    { id: 'panel_administracion', label: 'Admin', icon: LayoutDashboard }
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 pb-safe z-40">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = currentRoute === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onRouteChange(item.id as AppRoute)}
              className="relative flex flex-col items-center justify-center w-16 h-full gap-1 active:scale-95 transition-transform"
            >
              <div className={`relative flex flex-col items-center justify-center p-1 rounded-xl transition-colors ${isActive ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-900'}`}>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 bg-emerald-50 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'stroke-2' : 'stroke-[1.5]'}`} />
                <span className={`text-[10px] mt-1 relative z-10 font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
