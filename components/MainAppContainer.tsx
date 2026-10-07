'use client';

import React, { useState } from 'react';
import { AppRoute, PatientRecord, VolunteerProfile, CommunityPost } from '../lib/types';
import { INITIAL_PATIENTS, INITIAL_VOLUNTEER, INITIAL_POSTS } from '../lib/store';
import { supabase } from '../lib/supabase';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { FormularioRegistroView } from './views/FormularioRegistroView';
import { InicioPublicaView } from './views/InicioPublicaView';
import { PortalPacienteView } from './views/PortalPacienteView';
import { PortalVoluntarioView } from './views/PortalVoluntarioView';
import { PanelAdministracionView } from './views/PanelAdministracionView';
import { MuroComunidadView } from './views/MuroComunidadView';
import { AuditoriaSocialView } from './views/AuditoriaSocialView';
import { MockLogin } from './security/MockLogin';
import { motion, AnimatePresence } from 'motion/react';

interface MainAppContainerProps {
  rawNavigationFlowJson: string;
}

export const MainAppContainer: React.FC<MainAppContainerProps> = ({
  rawNavigationFlowJson
}) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('inicio_publica');
  const [previousRoute, setPreviousRoute] = useState<AppRoute>('inicio_publica');
  
  const [isAuthenticatedAs, setIsAuthenticatedAs] = useState<'paciente' | 'voluntario' | 'admin' | null>(null);

  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [volunteer, setVolunteer] = useState<VolunteerProfile>(INITIAL_VOLUNTEER);
  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);


  React.useEffect(() => {
    if (isAuthenticatedAs === 'admin') {
      const fetchSupabasePatients = async () => {
        try {
          const { data, error } = await supabase
            .from('perfiles')
            .select('*, datos_medicos_pacientes(*)');
            
          if (data && !error) {
            const mapped = data
              .filter(p => p.rol === 'paciente')
              .map(p => ({
                id: p.id,
                nombre: p.nombre_completo || 'Paciente',
                cedula: p.cedula || 'N/A',
                telefono: p.celular || 'N/A',
                diagnostico: p.datos_medicos_pacientes?.[0]?.diagnostico_principal || 'Desconozco',
                hospital: p.datos_medicos_pacientes?.[0]?.centro_atencion || 'ION',
                apoyo: 'En Revisión',
                region: p.provincia || 'N/A',
                estado: 'Activo',
                fechaRegistro: new Date(p.created_at).toLocaleDateString(),
                observaciones: 'Etapa: ' + (p.datos_medicos_pacientes?.[0]?.etapa_cancer || 'N/A')
              }));
            if (mapped.length > 0) {
              setPatients(mapped);
            }
          }
        } catch (e) { console.error('Error fetching data:', e); }
      };
      fetchSupabasePatients();
    }
  }, [isAuthenticatedAs]);


  const handleAddPatientRecord = (newPatient: PatientRecord) => setPatients([newPatient, ...patients]);
  const handlePurgePatientData = (cedula: string) => setPatients(patients.filter((p) => p.cedula !== cedula));
  const handleUpdateVolunteer = (v: VolunteerProfile) => setVolunteer(v);
  const handleUpdatePosts = (p: CommunityPost[]) => setPosts(p);

  const handleRouteChange = (nextRoute: AppRoute) => {
    if (nextRoute === currentRoute) return;
    setPreviousRoute(currentRoute);
    setCurrentRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const routeOrder: AppRoute[] = [
    'inicio_publica',
    'portal_pacientes',
    'muro_comunicaciones',
    'portal_voluntarios',
    'panel_administracion',
    'auditoria_social'
  ];

  const direction = routeOrder.indexOf(currentRoute) >= routeOrder.indexOf(previousRoute) ? 1 : -1;

  const renderProtectedRoute = (route: AppRoute) => {
    if (route === 'portal_pacientes') {
      if (isAuthenticatedAs === 'paciente' || isAuthenticatedAs === 'admin') {
        return <PortalPacienteView onAddPatientRecord={handleAddPatientRecord} onPurgePatientData={handlePurgePatientData} />;
      }
      return <MockLogin targetRole="paciente" onSuccess={() => setIsAuthenticatedAs('paciente')} />;
    }
    if (route === 'portal_voluntarios') {
      if (isAuthenticatedAs === 'voluntario' || isAuthenticatedAs === 'admin') {
        return <PortalVoluntarioView volunteer={volunteer} onUpdateVolunteer={handleUpdateVolunteer} />;
      }
      return <MockLogin targetRole="voluntario" onSuccess={() => setIsAuthenticatedAs('voluntario')} />;
    }
    if (route === 'registro') {
      return <FormularioRegistroView onRouteChange={handleRouteChange} />;
    }
    if (route === 'panel_administracion') {
      if (isAuthenticatedAs === 'admin') {
        return <PanelAdministracionView patients={patients} />;
      }
      return <MockLogin targetRole="admin" onSuccess={() => setIsAuthenticatedAs('admin')} />;
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FBF9F5] text-[#1B1C1A]">
      <Header
        currentRoute={currentRoute}
        onRouteChange={handleRouteChange}
        isAuthenticatedAs={isAuthenticatedAs}
        onLogout={() => { setIsAuthenticatedAs(null); handleRouteChange('inicio_publica'); }}
      />
      <main className="flex-1 w-full pt-16 pb-20 relative overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={currentRoute} className="w-full">
            {currentRoute === 'inicio_publica' && <InicioPublicaView onRouteChange={handleRouteChange} />}
            {currentRoute === 'muro_comunicaciones' && <MuroComunidadView posts={posts} onUpdatePosts={handleUpdatePosts} />}
            {currentRoute === 'auditoria_social' && <AuditoriaSocialView onRouteChange={handleRouteChange} />}
            {['portal_pacientes', 'portal_voluntarios', 'panel_administracion'].includes(currentRoute) && renderProtectedRoute(currentRoute)}
          </motion.div>
        </AnimatePresence>
        <Footer onRouteChange={handleRouteChange} />
      </main>
      <BottomNav currentRoute={currentRoute} onRouteChange={handleRouteChange} />
    </div>
  );
};
