export type AppRoute =
  | 'inicio_publica'
  | 'portal_pacientes'
  | 'muro_comunicaciones'
  | 'portal_voluntarios'
  | 'panel_administracion'
  | 'auditoria_social'
  | 'junta_tecnica';

export interface PatientRecord {
  id: number;
  nombre: string;
  cedula: string;
  diagnostico: string;
  hospital: string;
  apoyo: string;
  region: string;
  estado: 'Activo' | 'En Espera' | 'En Tratamiento ION' | 'Alta Médica';
  fechaRegistro: string;
  telefono?: string;
  observaciones?: string;
}

export interface VolunteerProfile {
  id: string;
  nombre: string;
  credencial: string;
  horasAcumuladas: number;
  pacientesAcompanados: number;
  disponible: boolean;
  proximaGuardia: {
    lugar: string;
    fecha: string;
    hora: string;
  };
  diasDisponibles: string[];
  turnosPreferidos: string[];
  zonasHabilitadas: string[];
}

export interface CommunityComment {
  id: string;
  autor: string;
  iniciales: string;
  tiempo: string;
  mensaje: string;
  colorBg?: string;
}

export interface CommunityPost {
  id: string;
  tipo: 'oficial' | 'campana' | 'taller';
  autor: string;
  rolAutor: string;
  tiempo: string;
  avatarIcon?: string;
  avatarInitials?: string;
  avatarColor?: string;
  verificado: boolean;
  titulo?: string;
  contenido: string;
  imagenUrl?: string;
  imagenAlt?: string;
  badgeTexto?: string;
  likes: number;
  userLiked: boolean;
  permitirComentarios: boolean;
  comentarios: CommunityComment[];
  soloDifusion?: boolean;
}

export interface WebhookLogEntry {
  id: string;
  eventId: string;
  displayName: string;
  url: string;
  timestamp: string;
  status: number;
  statusText: string;
  payload: any;
  response: any;
}
