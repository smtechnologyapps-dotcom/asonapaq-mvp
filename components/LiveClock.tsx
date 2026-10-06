'use client';

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const LiveClock: React.FC = () => {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  return (
    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-100/90 bg-slate-900/40 px-2.5 py-1 rounded-full border border-slate-700/50">
      <Clock className="w-3.5 h-3.5 text-emerald-400" />
      <span>
        {time.toLocaleDateString('es-PA', { 
          weekday: 'long', 
          day: 'numeric', 
          month: 'long' 
        }).replace(/^\w/, (c) => c.toUpperCase())}
        {' · '}
        {time.toLocaleTimeString('es-PA', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true
        })}
      </span>
    </div>
  );
};
