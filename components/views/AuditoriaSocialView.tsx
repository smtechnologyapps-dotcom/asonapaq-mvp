'use client';

import React, { useState } from 'react';
import { AppRoute } from '../../lib/types';
import { triggerN8NWebhook } from '../../lib/store';
import { AsonapaqLogo } from '../AsonapaqLogo';
import {
  FileSpreadsheet,
  Download,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Scale,
  Award,
  ArrowLeft
} from 'lucide-react';

interface AuditoriaSocialViewProps {
  onRouteChange?: (route: AppRoute) => void;
}

export const AuditoriaSocialView: React.FC<AuditoriaSocialViewProps> = ({
  onRouteChange
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportInforme = async () => {
    await triggerN8NWebhook(
      'EVT_AUDITORIA_DESCARGAR_BALANCE',
      'Descargar Informe de Auditoría Social 2025',
      {
        fiscal_year: '2024-2025',
        certified_by: 'Comisión de Transparencia ASONAPAQ',
        downloaded_at: new Date().toISOString()
      }
    );
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 5000);
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-4 space-y-5 pb-28">
      {/* Header Auditoría */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onRouteChange?.('panel_administracion')}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Regresar al Panel
          </button>
          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
            Certificación Oficial
          </span>
        </div>

        <div className="flex items-center gap-3">
          <AsonapaqLogo size="md" />
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Auditoría Social & Transparencia
            </h1>
            <p className="text-xs text-slate-500">
              Rendición de cuentas comunitaria amparada bajo personería jurídica
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Desde 1989, ASONAPAQ garantiza que cada balboa y cada donación en especie llegue de manera directa a los pacientes en quimioterapia y a sus familias en el Instituto Oncológico Nacional (ION).
        </p>
      </div>

      {/* Cifras Auditadas 2025 */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h2 className="text-sm font-bold text-slate-900">Ejecución Solidaria 2024-2025</h2>
          </div>
          <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            100% Auditado
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-2xl font-bold text-slate-900 block">342</span>
            <span className="text-xs text-slate-600">Apoyos directos en quimio</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-2xl font-bold text-slate-900 block">1,280</span>
            <span className="text-xs text-slate-600">Kits de apósitos & agujas Huber</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-2xl font-bold text-slate-900 block">4,100</span>
            <span className="text-xs text-slate-600">Suplementos hipercalóricos</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-2xl font-bold text-slate-900 block">650</span>
            <span className="text-xs text-slate-600">Noches de albergue solidario</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleExportInforme}
            className="w-full h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm active:scale-[0.98] transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Informe de Auditoría Social (PDF)</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl text-xs text-center font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Se ha generado el informe oficial debidamente timbrado con el sello de ASONAPAQ.
          </div>
        )}
      </div>

      {/* Marco Legal & Personería */}
      <div className="bg-slate-100/80 p-5 rounded-3xl border border-slate-200/60 space-y-2.5 text-xs text-slate-700 leading-relaxed">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Scale className="w-4 h-4 text-emerald-700" />
          <span>Marco Legal y Certificaciones</span>
        </div>
        <p>
          Organización no gubernamental sin fines de lucro reconocida legalmente en la República de Panamá según Resolución Oficial de 1989.
        </p>
        <div className="p-3 bg-white rounded-2xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <p>• RUC: 1234567-1-891010 DV 44</p>
          <p>• Sede Central: Calle 42 Bella Vista, Ciudad de Panamá</p>
          <p>• Alianza de Cooperación Humanitaria con el Instituto Oncológico Nacional (ION)</p>
        </div>
      </div>
    </div>
  );
};
