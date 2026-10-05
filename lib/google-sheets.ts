'use client';

import { PatientRecord, VolunteerProfile } from './types';

export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink?: string;
}

export interface SheetMetadata {
  spreadsheetId: string;
  title: string;
  sheets: {
    sheetId: number;
    title: string;
    rowCount?: number;
    columnCount?: number;
  }[];
}

// List user spreadsheets from Google Drive
export async function listUserSpreadsheets(accessToken: string): Promise<DriveSpreadsheetFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=20`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al listar hojas de cálculo (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

// Fetch spreadsheet metadata (to get available sheet tab names)
export async function getSpreadsheetMetadata(
  accessToken: string,
  spreadsheetId: string
): Promise<SheetMetadata> {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al obtener metadatos de la hoja (${res.status})`);
  }

  const data = await res.json();
  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || 'Hoja de Cálculo',
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId,
      title: s.properties?.title || 'Hoja 1',
      rowCount: s.properties?.gridProperties?.rowCount,
      columnCount: s.properties?.gridProperties?.columnCount
    }))
  };
}

// Read cell values from a sheet
export async function readSheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string
): Promise<string[][]> {
  const encodedRange = encodeURIComponent(range);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al leer celdas de la hoja (${res.status})`);
  }

  const data = await res.json();
  return data.values || [];
}

// Append rows to a sheet
export async function appendRowToSheet(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  rowValues: (string | number)[]
) {
  const encodedRange = encodeURIComponent(range);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [rowValues]
      })
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Error al agregar fila en Google Sheets (${res.status})`);
  }

  return await res.json();
}

// Create official ASONAPAQ master spreadsheet
export async function createOfficialAsonapaqSpreadsheet(
  accessToken: string,
  patients: PatientRecord[],
  volunteer: VolunteerProfile
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const title = `ASONAPAQ — Registro Oficial Oncológico ${new Date().getFullYear()} (ION)`;

  // 1. Create spreadsheet with 3 tabs
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title
      },
      sheets: [
        {
          properties: {
            title: 'Pacientes y Solicitudes ION',
            gridProperties: { rowCount: 100, columnCount: 10 }
          }
        },
        {
          properties: {
            title: 'Voluntarios Chalecos Verdes',
            gridProperties: { rowCount: 100, columnCount: 8 }
          }
        },
        {
          properties: {
            title: 'Auditoría e Insumos 2025',
            gridProperties: { rowCount: 50, columnCount: 6 }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Error al crear la hoja en Google Sheets');
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // 2. Populate 'Pacientes y Solicitudes ION'
  const patientHeaders = [
    'ID Expediente',
    'Nombre Completo',
    'Cédula / Documento',
    'Diagnóstico Oncológico',
    'Centro Médico',
    'Tipo de Apoyo',
    'Provincia / Región',
    'Estado',
    'Fecha de Registro',
    'Observaciones Clínicas'
  ];

  const patientRows = patients.map((p) => [
    `EXP-${p.id}`,
    p.nombre,
    p.cedula,
    p.diagnostico,
    p.hospital,
    p.apoyo,
    p.region,
    p.estado,
    p.fechaRegistro,
    p.observaciones || 'Sin observaciones'
  ]);

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Pacientes y Solicitudes ION'!A1:J?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [patientHeaders, ...patientRows]
      })
    }
  );

  // 3. Populate 'Voluntarios Chalecos Verdes'
  const volunteerHeaders = [
    'ID Voluntario',
    'Nombre',
    'Credencial Oficial',
    'Horas Voluntarias',
    'Pacientes Acompañados',
    'Próxima Asignación',
    'Turnos Preferidos',
    'Zonas Habilitadas'
  ];

  const volunteerRow = [
    volunteer.id,
    volunteer.nombre,
    volunteer.credencial,
    volunteer.horasAcumuladas,
    volunteer.pacientesAcompanados,
    `${volunteer.proximaGuardia.fecha} - ${volunteer.proximaGuardia.lugar}`,
    volunteer.turnosPreferidos.join(', '),
    volunteer.zonasHabilitadas.join(', ')
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Voluntarios Chalecos Verdes'!A1:H?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [volunteerHeaders, volunteerRow]
      })
    }
  );

  // 4. Populate 'Auditoría e Insumos 2025'
  const auditHeaders = ['Rubro Asistencial', 'Cantidad Entregada', 'Beneficiarios ION', 'Estado Auditoría'];
  const auditRows = [
    ['Kits de Quimioterapia y Apósitos Huber', 1280, 'Pacientes ambulatorios ION', 'Auditado 100%'],
    ['Suplementos Hipercalóricos', 4100, 'Pacientes en caquexia oncológica', 'Auditado 100%'],
    ['Hospedaje Temporal y Transporte Interior', 650, 'Familias foráneas', 'Auditado 100%']
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Auditoría e Insumos 2025'!A1:D?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [auditHeaders, ...auditRows]
      })
    }
  );

  return { spreadsheetId, spreadsheetUrl };
}
