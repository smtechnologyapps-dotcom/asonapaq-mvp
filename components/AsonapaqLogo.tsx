'use client';
import React from 'react';

export const AsonapaqLogo: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl', showText?: boolean, className?: string }> = ({ size = 'md', showText = false, className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} relative flex items-center justify-center rounded-full bg-white shadow-md border-2 border-emerald-600/20 overflow-hidden`}>
        <img 
          src="/logo-asonapaq.jpg" 
          alt="Logo Oficial ASONAPAQ" 
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <span className="mt-2 font-bold text-emerald-800 tracking-tight text-center leading-tight">
          ASONAPAQ
        </span>
      )}
    </div>
  );
};
