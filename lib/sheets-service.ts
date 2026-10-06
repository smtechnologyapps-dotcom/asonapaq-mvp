'use client';

import { PatientRecord, CommunityPost, VolunteerProfile } from './types';
import { getAccessToken } from './google-auth';

export const MASTER_SHEET_TITLE = 'ASONAPAQ — Base de Datos Maestra (Pacientes & Muro de Esperanza)';

export const TABS = {
  PACIENTES: 'Perfiles_Pacientes',
  MURO: 'Muro_Esperanza',
  VOLUNTARIOS: 'Voluntarios_ION'
} as const;

export interface SheetsSyncStatus {
  connected: boolean;
  spreadsheetId: string | null;
  spreadsheetUrl: string | null;
  lastSyncedAt: string | null;
  patientsCount: number;
  postsCount: number;
}

/**
 * Service Layer for Google Sheets API integration
 * Handles read/write operations for Patient Profiles and the Wall of Hope (Muro de Esperanza).
 */
export class GoogleSheetsService {
  /**
   * Helper to ensure an access token is available
   */
  private static async getToken(providedToken?: string | null): Promise<string> {
    const token = providedToken || (await getAccessToken());
    if (!token) {
      throw new Error('No hay sesión activa de Google Workspace. Por favor, inicia sesión con Google.');
    }
    return token;
  }

  /**
   * Search for an existing ASONAPAQ Master Spreadsheet in Drive, or create one.
   */
  public static async getOrCreateMasterSpreadsheet(
    token?: string | null
  ): Promise<{ spreadsheetId: string; spreadsheetUrl: string; isNew: boolean }> {
    const accessToken = await this.getToken(token);

    // 1. Search in Drive
    const query = encodeURIComponent(`name='${MASTER_SHEET_TITLE}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`);
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)&pageSize=1`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (searchRes.ok) {
      const data = await searchRes.json();
      if (data.files && data.files.length > 0) {
        return {
          spreadsheetId: data.files[0].id,
          spreadsheetUrl: data.files[0].webViewLink || `https://docs.google.com/spreadsheets/d/${data.files[0].id}/edit`,
          isNew: false
        };
      }
    }

    // 2. Not found, create new master spreadsheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: MASTER_SHEET_TITLE
        },
        sheets: [
          {
            properties: {
              title: TABS.PACIENTES,
              gridProperties: { rowCount: 150, columnCount: 10 }
            }
          },
          {
            properties: {
              title: TABS.MURO,
              gridProperties: { rowCount: 100, columnCount: 8 }
            }
          },
          {
            properties: {
              title: TABS.VOLUNTARIOS,
              gridProperties: { rowCount: 100, columnCount: 8 }
            }
          }
        ]
      })
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Error al crear la Hoja Maestra de ASONAPAQ en Google Sheets');
    }

    const created = await createRes.json();
    const spreadsheetId = created.spreadsheetId;
    const spreadsheetUrl = created.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // Initialize headers in all tabs
    await this.initHeaders(accessToken, spreadsheetId);

    return {
      spreadsheetId,
      spreadsheetUrl,
      isNew: true
    };
  }

  /**
   * Initialize table headers in each tab
   */
  private static async initHeaders(accessToken: string, spreadsheetId: string) {
    const patientHeaders = [
      'ID Expediente',
      'Nombre Completo',
      'Cédula / Pasaporte',
      'Diagnóstico Oncológico',
      'Centro Médico / Hospital',
      'Tipo de Apoyo',
      'Provincia / Región',
      'Estado Clínico',
      'Fecha Registro',
      'Observaciones Médicas'
    ];

    const wallHeaders = [
      'ID Publicación',
      'Tipo (Oficial / Campana / Taller)',
      'Autor',
      'Rol / Subtítulo',
      'Fecha / Tiempo',
      'Contenido Testimonio',
      'Total Me Gusta',
      'Comentarios Permitidos'
    ];

    const volunteerHeaders = [
      'ID Voluntario',
      'Nombre Completo',
      'Credencial Oficial',
      'Horas Donadías',
      'Pacientes Acompañados',
      'Próxima Asignación ION',
      'Turnos',
      'Zonas'
    ];

    await Promise.all([
      fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.PACIENTES}'!A1:J1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [patientHeaders] })
        }
      ),
      fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.MURO}'!A1:H1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [wallHeaders] })
        }
      ),
      fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.VOLUNTARIOS}'!A1:H1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ values: [volunteerHeaders] })
        }
      )
    ]);
  }

  // ==========================================
  // PACIENTES: LECTURA Y ESCRITURA
  // ==========================================

  /**
   * Write complete list of patients to 'Perfiles_Pacientes'
   */
  public static async writePatients(
    spreadsheetId: string,
    patients: PatientRecord[],
    token?: string | null
  ): Promise<{ writtenCount: number }> {
    const accessToken = await this.getToken(token);

    const rows = patients.map((p) => [
      `EXP-${p.id}`,
      p.nombre,
      p.cedula,
      p.diagnostico,
      p.hospital,
      p.apoyo,
      p.region,
      p.estado,
      p.fechaRegistro,
      p.observaciones || 'Sin observaciones adicionales'
    ]);

    // Clear previous rows starting from row 2
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.PACIENTES}'!A2:J500:clear`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    // Write all rows
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.PACIENTES}'!A2:J?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: rows })
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Error al escribir pacientes en Google Sheets');
    }

    return { writtenCount: rows.length };
  }

  /**
   * Append a single new patient record into 'Perfiles_Pacientes'
   */
  public static async appendPatient(
    spreadsheetId: string,
    patient: PatientRecord,
    token?: string | null
  ): Promise<boolean> {
    const accessToken = await this.getToken(token);

    const row = [
      `EXP-${patient.id}`,
      patient.nombre,
      patient.cedula,
      patient.diagnostico,
      patient.hospital,
      patient.apoyo,
      patient.region,
      patient.estado,
      patient.fechaRegistro,
      patient.observaciones || 'Registrado desde Portal del Paciente'
    ];

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.PACIENTES}'!A:J:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [row] })
      }
    );

    return res.ok;
  }

  /**
   * Read patient records from 'Perfiles_Pacientes'
   */
  public static async readPatients(
    spreadsheetId: string,
    token?: string | null
  ): Promise<PatientRecord[]> {
    const accessToken = await this.getToken(token);

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.PACIENTES}'!A2:J200`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Error al leer pacientes de Google Sheets');
    }

    const data = await res.json();
    const rows: string[][] = data.values || [];

    return rows.map((r, index) => {
      const idNum = parseInt((r[0] || '').replace(/\D/g, ''), 10) || index + 1;
      return {
        id: idNum,
        nombre: r[1] || 'Paciente Sin Nombre',
        cedula: r[2] || 'S/C',
        diagnostico: r[3] || 'Quimioterapia Oncológica',
        hospital: r[4] || 'Instituto Oncológico Nacional (ION)',
        apoyo: r[5] || 'Insumos Oncológicos',
        region: r[6] || 'Panamáá Centro',
        estado: (r[7] as any) || 'Activo',
        fechaRegistro: r[8] || new Date().toISOString().split('T')[0],
        observaciones: r[9] || ''
      };
    });
  }

  // ==========================================
  // MURO DE ESPERANZA: LECTURA Y ESCRITURA
  // ==========================================

  /**
   * Write full feed of posts to 'Muro_Esperanza'
   */
  public static async writeWallPosts(
    spreadsheetId: string,
    posts: CommunityPost[],
    token?: string | null
  ): Promise<{ writtenCount: number }> {
    const accessToken = await this.getToken(token);

    const rows = posts.map((p) => [
      p.id,
      p.tipo,
      p.autor,
      p.rolAutor,
      p.tiempo,
      p.contenido,
      p.likes,
      p.permitirComentarios ? 'SI' : 'NO'
    ]);

    // Clear previous rows starting from row 2
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.MURO}'!A2:H300:clear`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.MURO}'!A2:H?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: rows })
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Error al escribir el Muro en Google Sheets');
    }

    return { writtenCount: rows.length };
  }

  /**
   * Append a single new testimony/post to 'Muro_Esperanza'
   */
  public static async appendWallPost(
    spreadsheetId: string,
    post: { id: string; tipo: string; autor: string; rolAutor: string; contenido: string; likes: number },
    token?: string | null
  ): Promise<boolean> {
    const accessToken = await this.getToken(token);

    const row = [
      post.id,
      post.tipo,
      post.autor,
      post.rolAutor,
      new Date().toLocaleDateString('es-PA'),
      post.contenido,
      post.likes,
      'SI'
    ];

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.MURO}'!A:H:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [row] })
      }
    );

    return res.ok;
  }

  /**
   * Read wall posts from 'Muro_Esperanza'
   */
  public static async readWallPosts(
    spreadsheetId: string,
    token?: string | null
  ): Promise<CommunityPost[]> {
    const accessToken = await this.getToken(token);

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${TABS.MURO}'!A2:H100`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Error al leer el Muro desde Google Sheets');
    }

    const data = await res.json();
    const rows: string[][] = data.values || [];

    return rows.map((r) => {
      const tipo = (r[1] as any) || 'oficial';
      return {
        id: r[0] || `post_${Date.now()}`,
        tipo,
        autor: r[2] || 'Miembro de la Comunidad',
        rolAutor: r[3] || 'ASONAPAQ Panamáá',
        tiempo: r[4] || 'Reciente',
        contenido: r[5] || '',
        likes: parseInt(r[6], 10) || 0,
        userLiked: false,
        permitirComentarios: (r[7] || '').toUpperCase() !== 'NO',
        verificado: (r[2] || '').includes('ASONAPAQ') || (r[2] || '').includes('Oficial'),
        comentarios: []
      };
    });
  }
}
