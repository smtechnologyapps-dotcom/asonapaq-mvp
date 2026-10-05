'use client';

import React from 'react';
import { AppRoute } from '../lib/types';
import { AsonapaqLogo } from './AsonapaqLogo';

export const Footer: React.FC<{ onRouteChange: (route: AppRoute) => void }> = ({ onRouteChange }) => {
  return (
    <footer className="w-full mt-auto py-8 px-4 bg-slate-100/90 border-t border-slate-200/80 text-center text-xs text-slate-500">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2">
          <AsonapaqLogo size="xs" />
          <span className="font-bold text-slate-800 text-xs tracking-tight">ASONAPAQ — Panamá 1989</span>
        </div>
        <p className="text-[11px] text-slate-600">Desarrollado con ♥ por <strong className="text-slate-800">Soluciones Integrales y Globales SM / Omar Anthony Gutierrez</strong> — contacto@omnexpa.com — Panamá.</p>
      </div>
    </footer>
  );
};



