'use client';

import { useState, useEffect } from 'react';
import { AppRoute, PatientRecord, VolunteerProfile, CommunityPost, WebhookLogEntry } from './types';

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: 1,
    nombre: 'María Isabel Santos',
    cedula: '8-742-1980',
    diagnostico: 'Cáncer de Mama (Etapa II)',
    hospital: 'Instituto Oncológico Nacional (ION)',
    apoyo: 'Insumos Oncológicos',
    region: 'Panamá Centro',
    estado: 'En Tratamiento ION',
    fechaRegistro: '2025-01-14',
    telefono: '+507 6234-8901',
    observaciones: 'Requiere agujas Huber calibre 20G y apósitos de clorhexidina.'
  },
  {
    id: 2,
    nombre: 'Carlos Alberto Mendoza',
    cedula: '4-129-332',
    diagnostico: 'Linfoma No Hodgkin',
    hospital: 'Instituto Oncológico Nacional (ION)',
    apoyo: 'Alojamiento Temporal',
    region: 'Chiriquí',
    estado: 'En Tratamiento ION',
    fechaRegistro: '2025-01-20',
    telefono: '+507 6712-4455',
    observaciones: 'Procedente de Boquete. Hospedaje solidario por 5 días de infusión continua.'
  },
  {
    id: 3,
    nombre: 'Yolanda Castillo P.',
    cedula: '9-710-584',
    diagnostico: 'Cáncer Colorrectal',
    hospital: 'Hosp. Cecilio Castillero (Herrera)',
    apoyo: 'Suplementación Nutricional',
    region: 'Veraguas',
    estado: 'Activo',
    fechaRegistro: '2025-02-02',
    telefono: '+507 6890-1122',
    observaciones: 'Bajo peso severo. Prescrito suplemento hipercalórico líquido 2x al día.'
  },
  {
    id: 4,
    nombre: 'Eusebio De León',
    cedula: '2-98-1120',
    diagnostico: 'Cáncer de Próstata',
    hospital: 'Instituto Oncológico Nacional (ION)',
    apoyo: 'Apoyo Psicológico',
    region: 'Coclé',
    estado: 'En Espera',
    fechaRegistro: '2025-02-10',
    telefono: '+507 6554-3321',
    observaciones: 'Orientación tanatológica y círculo de contención para cuidadores.'
  },
  {
    id: 5,
    nombre: 'Rosalba Navarro Ríos',
    cedula: '8-820-410',
    diagnostico: 'Cáncer Cérvico Uterino',
    hospital: 'Hospital Nicolás A. Solano',
    apoyo: 'Insumos Oncológicos',
    region: 'Panamá Oeste',
    estado: 'Activo',
    fechaRegistro: '2025-02-18',
    telefono: '+507 6445-9012',
    observaciones: 'Kits de aseo estéril y cremas dermoprotectoras para radioterapia.'
  },
  {
    id: 6,
    nombre: 'Arnulfo Samaniego',
    cedula: '3-85-199',
    diagnostico: 'Melanoma Avanzado',
    hospital: 'Instituto Oncológico Nacional (ION)',
    apoyo: 'Suplementación Nutricional',
    region: 'Colón',
    estado: 'Alta Médica',
    fechaRegistro: '2024-11-12',
    telefono: '+507 6332-1188',
    observaciones: 'Ciclos completados favorablemente. Monitoreo semestral en consulta externa.'
  },
  {
    id: 7,
    nombre: 'Doris Villarreal',
    cedula: '7-104-984',
    diagnostico: 'Cáncer Gástrico',
    hospital: 'Instituto Oncológico Nacional (ION)',
    apoyo: 'Alojamiento Temporal',
    region: 'Azuero',
    estado: 'En Espera',
    fechaRegistro: '2025-03-01',
    telefono: '+507 6123-7744',
    observaciones: 'Viaje desde Las Tablas para inicio de primer ciclo de quimioterapia.'
  }
];

export const INITIAL_VOLUNTEER: VolunteerProfile = {
  id: 'VN-089',
  nombre: 'Carmen Elena Morales',
  credencial: 'Chaleco Verde Oficial · ID #VN-089',
  horasAcumuladas: 48,
  pacientesAcompanados: 32,
  disponible: true,
  proximaGuardia: {
    lugar: 'Sala de Quimioterapia Ambulatoria ION',
    fecha: 'Hoy',
    hora: '1:30 PM'
  },
  diasDisponibles: ['lunes', 'martes', 'jueves', 'sabado'],
  turnosPreferidos: ['matutino', 'vespertino'],
  zonasHabilitadas: ['ion', 'visitas_domiciliarias']
};

export const INITIAL_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    tipo: 'oficial',
    autor: 'ASONAPAQ Oficial',
    rolAutor: 'Ayer a las 10:30 AM · Hospital Oncológico (ION)',
    tiempo: 'Ayer a las 10:30 AM',
    avatarIcon: 'health_and_safety',
    avatarColor: 'bg-emerald-700 text-white',
    verificado: true,
    badgeTexto: 'Oficial',
    contenido:
      'Con inmenso amor y solidaridad realizamos la entrega de 85 turbantes de algodón suave y kits de hidratación especial para piel en tratamiento de quimioterapia en el Instituto Oncológico Nacional. ¡Ningún paciente camina solo!',
    imagenUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCIvC7X4I9_cfxiBbAYCW7I0byB6nvh6M_OaSftgc-cKPIYzxYBe_BzNlGdZMPcISznErgF-xOjajmuOmdC5_z9dNZ4gRbq-Y8vR1Eij5LjBpI_49pZcbWS5s1hUiVRzZNYt7kc4eEZA3lW2o6mDqR7QVn1thUANa3Mw3l9AKEqPFoCFp9bsW2SUniIyvxcDxz8glUgOm6ii3k0Hak1K2lJBsvF9lUI9b4mKc3ARgXr2c6RsushltgVxg',
    imagenAlt: 'Jornada de donación de turbantes y kits de hidratación ASONAPAQ en ION',
    likes: 142,
    userLiked: false,
    permitirComentarios: true,
    comentarios: [
      {
        id: 'c1',
        autor: 'Maritza Castillo',
        iniciales: 'MC',
        tiempo: 'Hace 4 h',
        mensaje: '¡Dios bendiga las manos de todos los voluntarios! Mi mamá recibió su kit hoy y su sonrisa nos llenó de esperanza.',
        colorBg: 'bg-teal-600 text-white'
      },
      {
        id: 'c2',
        autor: 'Jorge Luis Ramos',
        iniciales: 'JL',
        tiempo: 'Hace 2 h',
        mensaje: 'Gracias por estar siempre presentes en el ION. El calor humano es tan curativo como la medicina misma.',
        colorBg: 'bg-slate-700 text-white'
      }
    ]
  },
  {
    id: 'post_2',
    tipo: 'campana',
    autor: 'Elena Arias',
    rolAutor: 'Hoy a las 9:15 AM · Testimonio de Victoria',
    tiempo: 'Hoy a las 9:15 AM',
    avatarInitials: 'EA',
    avatarColor: 'bg-teal-100 text-teal-800',
    verificado: false,
    badgeTexto: 'Campana',
    contenido:
      '🔔 ¡Hoy toqué la campana! Tras 12 ciclos intensos de quimioterapia en el ION, celebro la vida. Gracias infinitas a mi familia y a los ángeles voluntarios de ASONAPAQ por nunca soltar mi mano en los días más duros. ¡Sí se puede! La fe mueve montañas.',
    imagenUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAUiqttZx9B8wXb0Tujnmy04uJTK-hO8LIHBNouekwxM7uCOqnvQ6ozFduYu7CNLIEJpl4nitbe4gSWMW3F6WlZRiWc4x4x8uCIVfQtB1zNw4Zlp1aRuzB7FMrVijaZfpAX5Ty2eYu-4PDQf7OtCmRLiDiSqSOjQWQBNIHGfTjkttfB9jYXKVtC72z6DBM_5Ha6he7z6MAUe1X8AoSor5YGNi9KFx5YZg98vi96R9eEXCKgerj6I1j0iQ',
    imagenAlt: 'Elena tocando la campana de la victoria tras su ciclo de quimioterapia',
    likes: 389,
    userLiked: false,
    permitirComentarios: true,
    comentarios: [
      {
        id: 'c3',
        autor: 'Lic. Gabriela Solís (Psicóloga)',
        iniciales: 'LG',
        tiempo: 'Hace 1 h',
        mensaje: '¡Bravo Elena querida! Eres un testimonio viviente de templanza, coraje y dulzura. Todo el equipo celebra contigo.',
        colorBg: 'bg-emerald-600 text-white'
      },
      {
        id: 'c4',
        autor: 'Carlos R. (Paciente)',
        iniciales: 'CR',
        tiempo: 'Hace 45 min',
        mensaje: 'Voy por mi ciclo 4 y tu foto me devolvió la energía. ¡Felicidades guerrera!',
        colorBg: 'bg-teal-700 text-white'
      }
    ]
  },
  {
    id: 'post_3',
    tipo: 'taller',
    autor: 'Comité de Educación ASONAPAQ',
    rolAutor: '3 de Marzo · Anuncio Oficial',
    tiempo: '3 de Marzo',
    avatarIcon: 'restaurant',
    avatarColor: 'bg-teal-700 text-white',
    verificado: true,
    badgeTexto: 'Taller',
    contenido:
      '🥗 Taller Práctico: Nutrición y Manejo de Náuseas durante el Tratamiento. Sesión virtual y presencial gratuita para pacientes y cuidadores. Impartido por la Dra. Cecilia Méndez (Nutricionista Oncológica).',
    imagenUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDYU1nPT-I913MsAxdqf9lnvih6bi5lC_MNszjfaIvJjDYaWfTeFhrntI8S5GS2YtNA2E6k8rGdCr0H2Pmmbcu3XIYaVpfmplcQcJmaAKcUAqhBj2sTbRF85jvnEJFl8S4ymsJCA7br1HjgLY0o7-eTuTPJqz5gGnv4X6mBxylnWLIaYd-or20u_Dfd6tKEFy0O985gjiVvOXTJgGqxIXerl9xTqfMJQ71SLVwKj5SdRd5gNxJprl7krA',
    imagenAlt: 'Taller de Nutrición Oncológica y Alivio de Náuseas',
    likes: 96,
    userLiked: false,
    permitirComentarios: false,
    soloDifusion: true,
    comentarios: []
  }
];

// Helper for simulated n8n webhook triggers
export async function triggerN8NWebhook(
  eventId: string,
  displayName: string,
  payload: any
): Promise<WebhookLogEntry> {
  const url = `https://n8n.asonapaq.org/webhook/v1/${eventId.toLowerCase().replace(/_/g, '-')}`;
  
  // Simulate network latency (250 - 450ms)
  await new Promise((res) => setTimeout(res, 320));

  const logEntry: WebhookLogEntry = {
    id: `n8n_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    eventId,
    displayName,
    url,
    timestamp: new Date().toISOString(),
    status: 200,
    statusText: 'OK (Simulated n8n Trigger Execution)',
    payload,
    response: {
      success: true,
      workflow_execution_id: `wf_exec_${Math.floor(Math.random() * 900000 + 100000)}`,
      received_at: new Date().toISOString(),
      action_dispatched: `n8n_flow_${eventId.toLowerCase()}`,
      environment: 'asonapaq-production-n8n',
      message: 'Trigger procesado correctamente por el motor de flujos n8n.'
    }
  };

  try {
    const raw = localStorage.getItem('asonapaq_v2_webhook_logs');
    const logs: WebhookLogEntry[] = raw ? JSON.parse(raw) : [];
    logs.unshift(logEntry);
    localStorage.setItem('asonapaq_v2_webhook_logs', JSON.stringify(logs.slice(0, 50)));
  } catch (e) {
    // localStorage might fail in strict private mode
  }

  return logEntry;
}
