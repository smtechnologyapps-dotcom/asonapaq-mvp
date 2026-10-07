export type AppRoute = 
  | 'inicio_publica'
  | 'portal_pacientes'
  | 'muro_comunicaciones'
  | 'portal_voluntarios'
  | 'panel_administracion'
  | 'auditoria_social'
  | 'junta_tecnica'
  | 'registro';

export interface PatientRecord {
  id: string | number;
  nombre: string;
  cedula: string;
  telefono?: string;
  diagnostico: string;
  hospital: string;
  apoyo: string;
  region: string;
  estado: 'Aprobado' | 'En Revisión' | 'Rechazado' | 'Activo' | string;
  fechaRegistro: string;
  observaciones: string;
}

export interface VolunteerProfile {
  id: string | number;
  nombre: string;
  cedula: string;
  diasDisponibles: string[];
  turnosPreferidos: string[];
  zonasHabilitadas: string[];
  credencial: string;
  horasAcumuladas?: number;
  pacientesAcompañados: number;
  proximaGuardia: any;
  disponible?: boolean;
}

export interface CommunityComment {
  id: string;
  autor: string;
  rolAutor?: string;
  contenido?: string;
  mensaje?: string;
  tiempo: string;
  iniciales?: string;
  colorBg?: string;
}

export interface CommunityPost {
  id: string;
  autor: string;
  rolAutor?: string;
  contenido: string;
  tipo: 'Testimonio' | 'Agradecimiento' | 'Alerta' | 'Donación' | 'oficial' | 'campana' | 'taller' | string;
  tiempo: string;
  likes: number;
  imagenUrl?: string;
  imagenAlt?: string;
  permitirComentarios?: boolean;
  verificado?: boolean;
  userLiked?: boolean;
  avatarIcon?: any;
  avatarInitials?: string;
  avatarColor?: string;
  badgeTexto?: string;
  soloDifusion?: boolean;
  comentarios?: CommunityComment[];
}

export interface WebhookLogEntry {
  id: string;
  timestamp: string;
  event?: string;
  payload: any;
  status: 'success' | 'error' | number;
  eventId?: string;
  displayName?: string;
  url?: string;
  statusText?: string;
  response?: any;
}
