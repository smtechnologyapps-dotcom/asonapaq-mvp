'use client';



import React, { useState, useEffect } from 'react';

import {

  initAuth,

  googleSignIn,

  googleLogout,

  getAccessToken

} from '../lib/google-auth';

import {

  GoogleSheetsService,

  MASTER_SHEET_TITLE,

  TABS

} from '../lib/sheets-service';

import {

  DriveSpreadsheetFile,

  SheetMetadía,

  listUserSpreadsheets,

  getSpreadsheetMetadía,

  readSheetValues

} from '../lib/google-sheets';

import { PatientRecord, VolunteerProfile, CommunityPost } from '../lib/types';

import { AsonapaqLogo } from './AsonapaqLogo';

import { motion, AnimatePresence } from 'motion/react';

import {

  FileSpreadsheet,

  X,

  Plus,

  RefreshCw,

  ExternalLink,

  CheckCircle2,

  AlertTriangle,

  LogOut,

  Table,

  Search,

  Eye,

  Database,

  UploadCloud,

  DownloadCloud,

  Heart,

  Users,

  ShieldCheck,

  Zap

} from 'lucide-react';



interface GoogleSheetsIntegrationModalProps {

  isOpen: boolean;

  onClose: () => void;

  patients: PatientRecord[];

  posts: CommunityPost[];

  volunteer: VolunteerProfile;

  onUpdatePatients: (patients: PatientRecord[]) => void;

  onUpdatePosts: (posts: CommunityPost[]) => void;

}



export const GoogleSheetsIntegrationModal: React.FC<GoogleSheetsIntegrationModalProps> = ({

  isOpen,

  onClose,

  patients,

  posts,

  volunteer,

  onUpdatePatients,

  onUpdatePosts

}) => {

  const [currentUser, setCurrentUser] = useState<any>(null);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'service' | 'browse' | 'viewer'>('service');



  // Master Spreadsheet status

  const [masterSpreadsheetId, setMasterSpreadsheetId] = useState<string | null>(null);

  const [masterSpreadsheetUrl, setMasterSpreadsheetUrl] = useState<string | null>(null);

  const [isConnectingMaster, setIsConnectingMaster] = useState(false);

  const [lastSyncAction, setLastSyncAction] = useState<string | null>(null);



  // Drive listing

  const [spreadsheets, setSpreadsheets] = useState<DriveSpreadsheetFile[]>([]);

  const [isLoadingDrive, setIsLoadingDrive] = useState(false);

  const [driveError, setDriveError] = useState<string | null>(null);



  // Cell viewer

  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);

  const [selectedSheetMetadía, setSelectedSheetMetadía] = useState<SheetMetadía | null>(null);

  const [selectedSheetTab, setSelectedSheetTab] = useState<string>('');

  const [sheetTabledía, setSheetTabledía] = useState<string[][]>([]);

  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const [tableSearch, setTableSearch] = useState('');



  // Mandatory confirmation dialog for mutating operations

  const [pendingOperation, setPendingOperation] = useState<{

    type: 'write_patients' | 'write_posts';

    title: string;

    description: string;

    affectedCount: number;

  } | null>(null);

  const [isExecutingMutation, setIsExecutingMutation] = useState(false);



  const autoDetectMaster = async (token: string) => {

    try {

      const res = await GoogleSheetsService.getOrCreateMasterSpreadsheet(token);

      setMasterSpreadsheetId(res.spreadsheetId);

      setMasterSpreadsheetUrl(res.spreadsheetUrl);

    } catch (e) {

      // Ignored if user hasn't created it yet

    }

  };



  useEffect(() => {

    const unsubscribe = initAuth(

      (user, token) => {

        setCurrentUser(user);

        setAccessToken(token);

        // Look up master spreadsheet when session is active

        autoDetectMaster(token);

      },

      () => {

        setCurrentUser(null);

        setAccessToken(null);

        setMasterSpreadsheetId(null);

        setMasterSpreadsheetUrl(null);

      }

    );

    return () => unsubscribe();

  }, []);



  const handleSignIn = async () => {

    setIsLoggingIn(true);

    try {

      const res = await googleSignIn();

      if (res) {

        setCurrentUser(res.user);

        setAccessToken(res.accessToken);

        autoDetectMaster(res.accessToken);

      }

    } catch (err: any) {

      console.error('Sign-in error:', err);

    } finally {

      setIsLoggingIn(false);

    }

  };



  const handleSignOut = async () => {

    await googleLogout();

    setCurrentUser(null);

    setAccessToken(null);

    setMasterSpreadsheetId(null);

    setMasterSpreadsheetUrl(null);

    setSpreadsheets([]);

    setSelectedSheetId(null);

    setSheetTabledía([]);

  };



  const handleConnectMasterSheet = async () => {

    const token = accessToken || (await getAccessToken());

    if (!token) return;



    setIsConnectingMaster(true);

    try {

      const res = await GoogleSheetsService.getOrCreateMasterSpreadsheet(token);

      setMasterSpreadsheetId(res.spreadsheetId);

      setMasterSpreadsheetUrl(res.spreadsheetUrl);

      setLastSyncAction(

        res.isNew

          ? 'Ã‚Â¡Hoja Maestra creada exitosamente con pestaÃƒÂ±as de Pacientes, Muro y Voluntarios!'

          : 'Ã‚Â¡Hoja Maestra de ASONAPAQ vinculada correctamente!'

      );

    } catch (err: any) {

      alert(`Error al vincular Hoja Maestra: ${err.message}`);

    } finally {

      setIsConnectingMaster(false);

    }

  };



  // 1. ESCRITURA DE PACIENTES (REQUIERE CONFIRMACIÃƒâ€œN)

  const requestWritePatients = () => {

    setPendingOperation({

      type: 'write_patients',

      title: 'Escribir Perfiles de Pacientes a Google Sheets',

      description: `Esta acciÃƒÂ³n actualizarÃƒÂ¡ la pestaÃƒÂ±a '${TABS.PACIENTES}' en la Hoja Maestra de Google Sheets con todos los datos clínicos y requerimientos activos.`,

      affectedCount: patients.length

    });

  };



  // 2. ESCRITURA DEL MURO DE ESPERANZA (REQUIERE CONFIRMACIÃƒâ€œN)

  const requestWritePosts = () => {

    setPendingOperation({

      type: 'write_posts',

      title: 'Escribir Muro de Esperanza a Google Sheets',

      description: `Esta acciÃƒÂ³n guardarÃƒÂ¡ los testimonios, historias de victoria (campana) y anuncios oficiales en la pestaÃƒÂ±a '${TABS.MURO}'.`,

      affectedCount: posts.length

    });

  };



  // Execute confirmed mutating action

  const handleConfirmExecuteOperation = async () => {

    if (!pendingOperation || !masterSpreadsheetId) return;



    const token = accessToken || (await getAccessToken());

    if (!token) return;



    setIsExecutingMutation(true);

    try {

      if (pendingOperation.type === 'write_patients') {

        const res = await GoogleSheetsService.writePatients(masterSpreadsheetId, patients, token);

        setLastSyncAction(`Ã¢Å“â€œ Se escribieron exitosamente ${res.writtenCount} perfiles de pacientes en Google Sheets.`);

      } else if (pendingOperation.type === 'write_posts') {

        const res = await GoogleSheetsService.writeWallPosts(masterSpreadsheetId, posts, token);

        setLastSyncAction(`Ã¢Å“â€œ Se escribieron exitosamente ${res.writtenCount} públicaciones del Muro en Google Sheets.`);

      }

      setPendingOperation(null);

    } catch (err: any) {

      alert(`Error en la operaciÃƒÂ³n: ${err.message}`);

    } finally {

      setIsExecutingMutation(false);

    }

  };



  // 3. LECTURA DE PACIENTES DESDE GOOGLE SHEETS

  const handleReadPatients = async () => {

    if (!masterSpreadsheetId) return;

    const token = accessToken || (await getAccessToken());

    if (!token) return;



    setIsConnectingMaster(true);

    try {

      const día = await GoogleSheetsService.readPatients(masterSpreadsheetId, token);

      if (día && día.length > 0) {

        onUpdatePatients(día);

        setLastSyncAction(`Ã¢Å“â€œ Se leyeron e importaron ${día.length} pacientes directamente desde Google Sheets.`);

      } else {

        setLastSyncAction('La pestaÃƒÂ±a de pacientes en Google Sheets estÃƒÂ¡ vacÃƒÂ­a.');

      }

    } catch (err: any) {

      alert(`Error al leer pacientes: ${err.message}`);

    } finally {

      setIsConnectingMaster(false);

    }

  };



  // 4. LECTURA DEL MURO DE ESPERANZA DESDE GOOGLE SHEETS

  const handleReadPosts = async () => {

    if (!masterSpreadsheetId) return;

    const token = accessToken || (await getAccessToken());

    if (!token) return;



    setIsConnectingMaster(true);

    try {

      const día = await GoogleSheetsService.readWallPosts(masterSpreadsheetId, token);

      if (día && día.length > 0) {

        onUpdatePosts(día);

        setLastSyncAction(`Ã¢Å“â€œ Se leyeron e impúblicaciones del Muro desde Google Sheets.`);

      } else {

        setLastSyncAction('La pestaÃƒÂ±a del Muro en Google Sheets estÃƒÂ¡ vacÃƒÂ­a.');

      }

    } catch (err: any) {

      alert(`Error al leer el Muro: ${err.message}`);

    } finally {

      setIsConnectingMaster(false);

    }

  };



  // Load user spreadsheets in Drive

  const handleLoadDriveSpreadsheets = async () => {

    const token = accessToken || (await getAccessToken());

    if (!token) return;



    setIsLoadingDrive(true);

    setDriveError(null);

    try {

      const files = await listUserSpreadsheets(token);

      setSpreadsheets(files);

    } catch (err: any) {

      setDriveError(err.message || 'Error al conectar con Google Drive');

    } finally {

      setIsLoadingDrive(false);

    }

  };



  // Inspect any spreadsheet

  const handleInspectSpreadsheet = async (sheetId: string) => {

    const token = accessToken || (await getAccessToken());

    if (!token) return;



    setSelectedSheetId(sheetId);

    setIsLoadingTable(true);

    setActiveTab('viewer');

    try {

      const meta = await getSpreadsheetMetadía(token, sheetId);

      setSelectedSheetMetadía(meta);

      const defaultTab = meta.sheets[0]?.title || 'Sheet1';

      setSelectedSheetTab(defaultTab);



      const rows = await readSheetValues(token, sheetId, `${defaultTab}!A1:Z100`);

      setSheetTabledía(rows);

    } catch (err: any) {

      alert(`Error al leer hoja: ${err.message}`);

    } finally {

      setIsLoadingTable(false);

    }

  };



  // Switch tab in viewer

  const handleSwitchTab = async (tabName: string) => {

    if (!selectedSheetId) return;

    const token = accessToken || (await getAccessToken());

    if (!token) return;



    setSelectedSheetTab(tabName);

    setIsLoadingTable(true);

    try {

      const rows = await readSheetValues(token, selectedSheetId, `${tabName}!A1:Z100`);

      setSheetTabledía(rows);

    } catch (err: any) {

      alert(`Error al leer pestaÃƒÂ±a: ${err.message}`);

    } finally {

      setIsLoadingTable(false);

    }

  };



  const filteredRows = sheetTabledía.slice(1).filter((row) => {

    if (!tableSearch) return true;

    return row.some((cell) => cell.toLowerCase().includes(tableSearch.toLowerCase()));

  });



  if (!isOpen) return null;



  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md">

      <motion.div

        initial={{ opacity: 0, scale: 0.95, y: 15 }}

        animate={{ opacity: 1, scale: 1, y: 0 }}

        exit={{ opacity: 0, scale: 0.95, y: 15 }}

        className="bg-white text-slate-900 w-full max-w-4xl h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"

      >

        {/* Top Header */}

        <div className="p-4 sm:p-5 bg-[#0F172A] text-white flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">

              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />

            </div>

            <div className="min-w-0">

              <div className="flex items-center gap-2">

                <span className="font-bold text-sm sm:text-base text-white tracking-tight truncate">

                  Google SheetsÃ¢â€žÂ¢ Service Layer Ã‚Â· ASONAPAQ

                </span>

                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">

                  Lectura & Escritura Activa

                </span>

              </div>

              <p className="text-[11px] text-slate-300 truncate">

                Capa de servicio para persistir y sincronizar perfiles de pacientes y el Muro de Esperanza en tiempo real.

              </p>

            </div>

          </div>



          <button

            type="button"

            onClick={onClose}

            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors flex-shrink-0"

          >

            <X className="w-4 h-4" />

          </button>

        </div>



        {/* Auth Ribbon */}

        <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">

          {currentUser ? (

            <div className="flex items-center gap-2.5 text-xs text-slate-700">

              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px] shadow-xs">

                {currentUser.displayName ? currentUser.displayName[0] : 'U'}

              </div>

              <div>

                <span className="font-bold text-slate-900 block">

                  {currentUser.displayName || 'Usuario Conectado'}

                </span>

                <span className="text-[10px] text-slate-500">{currentUser.email}</span>

              </div>

            </div>

          ) : (

            <div className="flex items-center gap-2 text-xs text-slate-600">

              <span className="w-2 h-2 rounded-full bg-amber-500" />

              <span>AutenticaciÃƒÂ³n requerida para acceder al cliente de Google Sheets API.</span>

            </div>

          )}



          <div>

            {currentUser ? (

              <button

                type="button"

                onClick={handleSignOut}

                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-2xs"

              >

                <LogOut className="w-3.5 h-3.5 text-slate-500" />

                <span>Desconectar</span>

              </button>

            ) : (

              <button

                type="button"

                disabled={isLoggingIn}

                onClick={handleSignIn}

                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-full border border-slate-300 shadow-xs font-medium text-xs transition-all active:scale-95 disabled:opacity-50"

              >

                <svg className="w-4 h-4" viewBox="0 0 48 48">

                  <path

                    fill="#EA4335"

                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"

                  />

                  <path

                    fill="#4285F4"

                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"

                  />

                  <path

                    fill="#FBBC05"

                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"

                  />

                  <path

                    fill="#34A853"

                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"

                  />

                </svg>

                <span>{isLoggingIn ? 'Iniciando...' : 'Iniciar sesión con Google'}</span>

              </button>

            )}

          </div>

        </div>



        {/* Navigation Tabs */}

        {currentUser && (

          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200">

            {[

              { id: 'service', label: '1. Capa de Servicio (Pacientes & Muro)', icon: Zap },

              { id: 'browse', label: '2. Explorador Google Drive', icon: Database },

              { id: 'viewer', label: '3. Visor de Celdas Interactivo', icon: Table }

            ].map((t) => (

              <button

                key={t.id}

                type="button"

                onClick={() => {

                  setActiveTab(t.id as any);

                  if (t.id === 'browse' && spreadsheets.length === 0) {

                    handleLoadDriveSpreadsheets();

                  }

                }}

                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${

                  activeTab === t.id

                    ? 'bg-emerald-700 text-white shadow-xs'

                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'

                }`}

              >

                <t.icon className="w-3.5 h-3.5" />

                <span>{t.label}</span>

              </button>

            ))}

          </div>

        )}



        {/* Main Body */}

        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">

          {!currentUser ? (

            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">

              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">

                <FileSpreadsheet className="w-8 h-8 text-emerald-700" />

              </div>

              <div className="space-y-1 max-w-sm">

                <h3 className="text-base font-bold text-slate-900">

                  Capa de Servicio Google Sheets

                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">

                  Conecta la apúblicaciones del Muro de Esperanza.

                </p>

              </div>

              <button

                type="button"

                onClick={handleSignIn}

                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold text-xs shadow-md transition-all active:scale-95"

              >

                <FileSpreadsheet className="w-4 h-4" />

                <span>Conectar con Google Workspace</span>

              </button>

            </div>

          ) : (

            <>

              {/* TAB 1: CAPA DE SERVICIO (PACIENTES Y MURO) */}

              {activeTab === 'service' && (

                <div className="space-y-5">

                  {/* Master Sheet Connection Card */}

                  <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-3xl space-y-3">

                    <div className="flex items-center justify-between gap-2 flex-wrap">

                      <div className="flex items-center gap-2 text-emerald-800">

                        <AsonapaqLogo size="xs" />

                        <span className="text-xs font-bold uppercase tracking-wider">

                          Hoja Maestra ASONAPAQ (Google Sheets)

                        </span>

                      </div>



                      {masterSpreadsheetId ? (

                        <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-300">

                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />

                          <span>Conectado</span>

                        </span>

                      ) : (

                        <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full flex items-center gap-1 border border-amber-200">

                          <span>Pendiente de VinculaciÃƒÂ³n</span>

                        </span>

                      )}

                    </div>



                    <h3 className="text-base font-bold text-slate-900">

                      {MASTER_SHEET_TITLE}

                    </h3>



                    <p className="text-xs text-slate-600 leading-relaxed">

                      Esta hoja central en Google Drive contiene las pestaÃƒÂ±as homologadas:{' '}

                      <strong className="text-slate-800">{TABS.PACIENTES}</strong> (Expedientes ION),{' '}

                      <strong className="text-slate-800">{TABS.MURO}</strong> (Testimonios y Campana), y{' '}

                      <strong className="text-slate-800">{TABS.VOLUNTARIOS}</strong>.

                    </p>



                    <div className="flex items-center gap-2 pt-1 flex-wrap">

                      {!masterSpreadsheetId ? (

                        <button

                          type="button"

                          disabled={isConnectingMaster}

                          onClick={handleConnectMasterSheet}

                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center gap-1.5"

                        >

                          <Plus className="w-4 h-4" />

                          <span>{isConnectingMaster ? 'Creando en Drive...' : 'Crear / Vincular Hoja Maestra'}</span>

                        </button>

                      ) : (

                        <>

                          <a

                            href={masterSpreadsheetUrl || '#'}

                            target="_blank"

                            rel="noopener noreferrer"

                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700 text-white rounded-full font-bold text-xs shadow-2xs hover:bg-emerald-800"

                          >

                            <span>Abrir en Google Sheets</span>

                            <ExternalLink className="w-3.5 h-3.5" />

                          </a>



                          <button

                            type="button"

                            onClick={() => handleInspectSpreadsheet(masterSpreadsheetId)}

                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 rounded-full font-bold text-xs shadow-2xs hover:bg-emerald-50"

                          >

                            <Table className="w-3.5 h-3.5 text-emerald-700" />

                            <span>Ver Celdas en la App</span>

                          </button>

                        </>

                      )}

                    </div>

                  </div>



                  {lastSyncAction && (

                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 font-medium">

                      {lastSyncAction}

                    </div>

                  )}



                  {/* Operational Cards for Read & Write */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* 1. MÃƒÂ³dulo Pacientes */}

                    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 text-left">

                      <div className="flex items-center gap-2 text-emerald-700">

                        <Users className="w-5 h-5 text-emerald-700" />

                        <h4 className="text-sm font-bold text-slate-900">Perfiles de Pacientes</h4>

                      </div>



                      <p className="text-xs text-slate-600 leading-snug">

                        Sincroniza los expedientes oncológicos del ION, cÃƒÂ©dulas, diagnÃƒÂ³sticos y tipos de apoyo.

                      </p>



                      <div className="p-2.5 bg-slate-50 rounded-2xl text-xs flex justify-between items-center text-slate-600">

                        <span>Pacientes en memoria:</span>

                        <strong className="text-slate-900 text-sm font-bold">{patients.length}</strong>

                      </div>



                      <div className="flex flex-col gap-2 pt-1">

                        <button

                          type="button"

                          disabled={!masterSpreadsheetId}

                          onClick={requestWritePatients}

                          className="w-full h-10 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"

                        >

                          <UploadCloud className="w-4 h-4" />

                          <span>Escribir Pacientes a Google Sheets</span>

                        </button>



                        <button

                          type="button"

                          disabled={!masterSpreadsheetId || isConnectingMaster}

                          onClick={handleReadPatients}

                          className="w-full h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"

                        >

                          <DownloadCloud className="w-4 h-4 text-emerald-700" />

                          <span>Leer / Importar desde Google Sheets</span>

                        </button>

                      </div>

                    </div>



                    {/* 2. MÃƒÂ³dulo Muro de Esperanza */}

                    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 text-left">

                      <div className="flex items-center gap-2 text-teal-700">

                        <Heart className="w-5 h-5 text-teal-600" />

                        <h4 className="text-sm font-bold text-slate-900">Muro de Esperanza</h4>

                      </div>



                      <p className="text-xs text-slate-600 leading-snug">

                        Guarda y lee testimonios de victoria (campana), entregas en ION y mensajes solidarios.

                      </p>



                      <div className="p-2.5 bg-slate-50 rounded-2xl text-xs flex justify-between items-center text-slate-600">

                        <spúblicaciones en memoria:</span>

                        <strong className="text-slate-900 text-sm font-bold">{posts.length}</strong>

                      </div>



                      <div className="flex flex-col gap-2 pt-1">

                        <button

                          type="button"

                          disabled={!masterSpreadsheetId}

                          onClick={requestWritePosts}

                          className="w-full h-10 rounded-full bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"

                        >

                          <UploadCloud className="w-4 h-4" />

                          <span>Escribir Muro a Google Sheets</span>

                        </button>



                        <button

                          type="button"

                          disabled={!masterSpreadsheetId || isConnectingMaster}

                          onClick={handleReadPosts}

                          className="w-full h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50"

                        >

                          <DownloadCloud className="w-4 h-4 text-teal-700" />

                          <span>Leer / Importar desde Google Sheets</span>

                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              )}



              {/* TAB 2: EXPLORADOR DRIVE */}

              {activeTab === 'browse' && (

                <div className="space-y-4">

                  <div className="flex items-center justify-between">

                    <div>

                      <h3 className="text-sm font-bold text-slate-900">

                        Hojas de CÃƒÂ¡lculo en tu Google Drive

                      </h3>

                      <p className="text-xs text-slate-500">

                        Selecciona un archivo para inspeccionar sus celdas en vivo.

                      </p>

                    </div>

                    <button

                      type="button"

                      disabled={isLoadingDrive}

                      onClick={handleLoadDriveSpreadsheets}

                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition-colors"

                    >

                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDrive ? 'animate-spin' : ''}`} />

                      <span>Actualizar</span>

                    </button>

                  </div>



                  {driveError && (

                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800">

                      {driveError}

                    </div>

                  )}



                  {isLoadingDrive ? (

                    <div className="py-12 text-center text-xs text-slate-500">

                      <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />

                      Consultando Google Drive...

                    </div>

                  ) : spreadsheets.length === 0 ? (

                    <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-2">

                      <p className="text-xs font-bold text-slate-700">No se encontraron hojas de cÃƒÂ¡lculo</p>

                      <p className="text-xs text-slate-500">

                        Crea la Hoja Maestra de ASONAPAQ en la pestaÃƒÂ±a 1 para comenzar.

                      </p>

                    </div>

                  ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">

                      {spreadsheets.map((sheet) => (

                        <div

                          key={sheet.id}

                          className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-2xs space-y-2 text-left transition-all"

                        >

                          <div className="flex items-start gap-2.5">

                            <FileSpreadsheet className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />

                            <div className="min-w-0 flex-1">

                              <h4 className="text-xs font-bold text-slate-900 truncate">

                                {sheet.name}

                              </h4>

                              <span className="text-[10px] text-slate-400 block">

                                Modificado: {new Date(sheet.modifiedTime).toLocaleDateString()}

                              </span>

                            </div>

                          </div>



                          <div className="flex items-center justify-between pt-1 border-t border-slate-100">

                            <button

                              type="button"

                              onClick={() => handleInspectSpreadsheet(sheet.id)}

                              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"

                            >

                              <Eye className="w-3.5 h-3.5" />

                              <span>Inspeccionar Celdas</span>

                            </button>



                            <a

                              href={`https://docs.google.com/spreadsheets/d/${sheet.id}/edit`}

                              target="_blank"

                              rel="noopener noreferrer"

                              className="text-slate-400 hover:text-slate-600"

                              title="Abrir en pestaÃƒÂ±a nueva"

                            >

                              <ExternalLink className="w-3.5 h-3.5" />

                            </a>

                          </div>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              )}



              {/* TAB 3: VISOR DE CELDAS */}

              {activeTab === 'viewer' && (

                <div className="space-y-4">

                  {selectedSheetMetadía ? (

                    <div className="space-y-3">

                      <div className="flex items-center justify-between gap-3 flex-wrap">

                        <div>

                          <h3 className="text-sm font-bold text-slate-900">

                            {selectedSheetMetadía.title}

                          </h3>

                          <span className="text-xs text-slate-500 font-mono">

                            ID: {selectedSheetMetadía.spreadsheetId}

                          </span>

                        </div>



                        {/* Search in table */}

                        <div className="relative w-48">

                          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

                          <input

                            type="text"

                            value={tableSearch}

                            onChange={(e) => setTableSearch(e.target.value)}

                            placeholder="Buscar en celdas..."

                            className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-full text-xs text-slate-900 focus:outline-none focus:bg-white border border-slate-200"

                          />

                        </div>

                      </div>



                      {/* Sheet Tabs Pills */}

                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">

                        {selectedSheetMetadía.sheets.map((tab) => (

                          <button

                            key={tab.sheetId}

                            type="button"

                            onClick={() => handleSwitchTab(tab.title)}

                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${

                              selectedSheetTab === tab.title

                                ? 'bg-emerald-700 text-white'

                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'

                            }`}

                          >

                            {tab.title}

                          </button>

                        ))}

                      </div>



                      {/* Table Render */}

                      {isLoadingTable ? (

                        <div className="py-16 text-center text-xs text-slate-500">

                          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />

                          Leyendo celdas desde Google Sheets API...

                        </div>

                      ) : sheetTabledía.length === 0 ? (

                        <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200 text-xs text-slate-500">

                          Esta pestaÃƒÂ±a no contiene celdas o estÃƒÂ¡ vacÃƒÂ­a.

                        </div>

                      ) : (

                        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">

                          <div className="overflow-x-auto max-h-96">

                            <table className="w-full text-left text-xs border-collapse">

                              <thead className="bg-[#0F172A] text-white sticky top-0 z-10">

                                <tr>

                                  {sheetTabledía[0]?.map((colHeader, idx) => (

                                    <th

                                      key={idx}

                                      className="px-3 py-2.5 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap border-b border-slate-700"

                                    >

                                      {colHeader}

                                    </th>

                                  ))}

                                </tr>

                              </thead>

                              <tbody className="divide-y divide-slate-100 bg-white font-mono text-[11px]">

                                {filteredRows.map((row, rIdx) => (

                                  <tr key={rIdx} className="hover:bg-slate-50">

                                    {row.map((cell, cIdx) => (

                                      <td

                                        key={cIdx}

                                        className="px-3 py-2 text-slate-700 whitespace-nowrap max-w-xs truncate"

                                      >

                                        {cell}

                                      </td>

                                    ))}

                                  </tr>

                                ))}

                              </tbody>

                            </table>

                          </div>

                          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center px-4">

                            <span>Mostrando {filteredRows.length} fila(s)</span>

                            <span className="font-semibold text-emerald-700">Google Sheets v4 API</span>

                          </div>

                        </div>

                      )}

                    </div>

                  ) : (

                    <div className="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200 text-xs text-slate-500">

                      Selecciona una hoja en la pestaÃƒÂ±a &ldquo;Explorador Google Drive&rdquo; para ver sus datos aquí­.

                    </div>

                  )}

                </div>

              )}

            </>

          )}

        </div>



        {/* Mandatory User Confirmation Dialog for Mutating Operations */}

        <AnimatePresence>

          {pendingOperation && (

            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">

              <motion.div

                initial={{ scale: 0.9, opacity: 0 }}

                animate={{ scale: 1, opacity: 1 }}

                exit={{ scale: 0.9, opacity: 0 }}

                className="bg-white max-w-md w-full p-6 rounded-3xl shadow-2xl border border-slate-200 space-y-4 text-left"

              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">

                    <AlertTriangle className="w-5 h-5 text-amber-600" />

                  </div>

                  <div>

                    <h4 className="text-sm font-bold text-slate-900">

                      {pendingOperation.title}

                    </h4>

                    <span className="text-[11px] text-slate-500">

                      OperaciÃƒÂ³n con permás de Google Sheets

                    </span>

                  </div>

                </div>



                <div className="text-xs text-slate-600 space-y-2 leading-relaxed">

                  <p>{pendingOperation.description}</p>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-[11px]">

                    <p>Ã¢â‚¬Â¢ Cantidad de registros a escribir: <strong>{pendingOperation.affectedCount}</strong></p>

                    <p>Ã¢â‚¬Â¢ Destino: <strong>{MASTER_SHEET_TITLE}</strong></p>

                  </div>

                </div>



                <div className="flex gap-2 pt-2">

                  <button

                    type="button"

                    disabled={isExecutingMutation}

                    onClick={handleConfirmExecuteOperation}

                    className="flex-1 h-11 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"

                  >

                    {isExecutingMutation ? 'Escribiendo en Sheets...' : 'Confirmar Escritura'}

                  </button>

                  <button

                    type="button"

                    onClick={() => setPendingOperation(null)}

                    className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-semibold text-xs transition-colors"

                  >

                    Cancelar

                  </button>

                </div>

              </motion.div>

            </div>

          )}

        </AnimatePresence>

      </motion.div>

    </div>

  );

};







