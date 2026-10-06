'use client';



import React, { useState } from 'react';

import { CommunityPost, CommunityComment } from '../../lib/types';

import { triggerN8NWebhook } from '../../lib/store';

import { GoogleSheetsService } from '../../lib/sheets-service';

import { getAccessToken } from '../../lib/google-auth';

import { AsonapaqLogo } from '../AsonapaqLogo';

import { motion, AnimatePresence } from 'motion/react';

import {

  Heart,

  MessageCircle,

  Send,

  Lock,

  Calendar,

  MapPin,

  BellRing,

  Sparkles,

  ShieldCheck,

  X,

  Share2,

  HandHeart,

  MessageSquarePlus

} from 'lucide-react';



interface MuroComunidadViewProps {

  posts: CommunityPost[];

  onUpdatePosts: (posts: CommunityPost[]) => void;

}



export const MuroComunidadView: React.FC<MuroComunidadViewProps> = ({

  posts,

  onUpdatePosts

}) => {

  const [showCompose, setShowCompose] = useState(false);

  const [composeText, setComposeText] = useState('');

  const [composeSuccess, setComposeSuccess] = useState(false);



  // New comment inputs for each post

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});



  const handleToggleLike = (postId: string) => {

    const updated = posts.map((p) => {

      if (p.id === postId) {

        const nextLiked = !p.userLiked;

        return {

          ...p,

          userLiked: nextLiked,

          likes: nextLiked ? p.likes + 1 : p.likes - 1

        };

      }

      return p;

    });

    onUpdatePosts(updated);

  };



  const handleToggleAllowCommás = (postId: string) => {

    const updated = posts.map((p) => {

      if (p.id === postId) {

        return {

          ...p,

          permitirComentarios: !p.permitirComentarios

        };

      }

      return p;

    });

    onUpdatePosts(updated);

  };



  const handleAddComment = (postId: string) => {

    const text = (commentInputs[postId] || '').trim();

    if (!text) return;



    const newComment: CommunityComment = {

      id: `comm_${Date.now()}`,

      autor: 'TÃƒÂº (Comunidad)',

      iniciales: 'YO',

      tiempo: 'Ahora mismo',

      mensaje: text,

      colorBg: 'bg-emerald-700 text-white'

    };



    const updated = posts.map((p) => {

      if (p.id === postId) {

        return {

          ...p,

          comentarios: [...(p.comentarios || []), newComment]

        };

      }

      return p;

    });



    onUpdatePosts(updated);

    setCommentInputs({ ...commentInputs, [postId]: '' });

  };



  const handlePublishTestáimony = async () => {

    if (!composeText.trim()) return;



    await triggerN8NWebhook('EVT_públicAR_TESTIMONIO_MURO', 'públicar Testáimonio en el Muro', {

      autor: 'Miembro Solidario',

      mensaje: composeText,

      moderation_queue: 'PASTORAL_AND_clínicAL_COMMITTEE',

      created_at: new Date().toISOString()

    });



    // Also persist into Google Sheets Master Spreadsheet if Google Workspace is connected

    try {

      const gToken = await getAccessToken();

      if (gToken) {

        const master = await GoogleSheetsService.getOrCreateMasterSpreadsheet(gToken);

        if (master?.spreadsheetId) {

          await GoogleSheetsService.appendWallPost(

            master.spreadsheetId,

            {

              id: `post_user_${Date.now()}`,

              tipo: 'comunidad',

              autor: 'Miembro Solidario',

              rolAutor: 'Comunidad ASONAPAQ',

              contenido: composeText,

              likes: 1

            },

            gToken

          );

        }

      }

    } catch (gErr) {

      console.warn('Google Sheets sync skipped (offline or not connected):', gErr);

    }



    setComposeText('');

    setShowCompose(false);

    setComposeSuccess(true);

    setTimeout(() => setComposeSuccess(false), 5000);

  };



  return (

    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 py-4 space-y-5 pb-28">

      {/* Banner Inspiracional */}

      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 space-y-3 relative overflow-hidden">

        <div className="flex items-center gap-2 text-emerald-800">

          <AsonapaqLogo size="sm" />

          <span className="text-[11px] font-bold uppercase tracking-wider">

            Comunidad ASONAPAQ

          </span>

        </div>



        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">

          Muro de Fe, Esperanza y Vida

        </h1>



        <p className="text-xs text-slate-600 leading-relaxed">

          Un espacio de amor, fuerza y compañía mutua. Comparte tu luz con pacientes, sobrevivientes y familiares en cada paso del camino en Panamá.á.

        </p>



        {/* Botón Abrir Composer */}

        <button

          type="button"

          onClick={() => setShowCompose(!showCompose)}

          className="w-full h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm active:scale-[0.98] transition-all"

        >

          <MessageSquarePlus className="w-4 h-4" />

          <span>Compartir Testáimonio de Esperanza</span>

        </button>



        {composeSuccess && (

          <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl text-xs text-center font-medium">

            Ã¢Å“â€œ Ã‚Â¡Gracias públicado en el Muro.

          </div>

        )}

      </div>



      {/* Modal / Tray de Redacción */}

      <AnimatePresence>

        {showCompose && (

          <motion.div

            initial={{ opacity: 0, height: 0 }}

            animate={{ opacity: 1, height: 'auto' }}

            exit={{ opacity: 0, height: 0 }}

            className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-slate-200 space-y-3"

          >

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">

              <span className="text-xs font-bold text-slate-900">

                públicar Testáimonio o Mensaje de Aliento

              </span>

              <button

                type="button"

                onClick={() => setShowCompose(false)}

                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"

              >

                <X className="w-4 h-4" />

              </button>

            </div>



            <textarea

              rows={3}

              value={composeText}

              onChange={(e) => setComposeText(e.target.value)}

              placeholder="Escribe unas palabras de aliento, tu experiencia personal de fe o un abrazo fraterno..."

              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"

            />



            <div className="flex items-center justify-between pt-1">

              <span className="text-[10px] text-slate-500 flex items-center gap-1">

                <Lock className="w-3 h-3 text-emerald-700" />

                Espacio seguro con moderación pastoral

              </span>

              <button

                type="button"

                onClick={handlePublishTestáimony}

                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold shadow-xs active:scale-95 transition-transform"

              >

                públicar

              </button>

            </div>

          </motion.div>

        )}

      </AnimatePresence>



      {/* Feed Container */}

      <div className="space-y-5">

        {posts.map((post) => (

          <article

            key={post.id}

            className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col"

          >

            {/* Post Header */}

            <div className="p-4 sm:p-5 pb-2 flex items-center justify-between gap-3">

              <div className="flex items-center gap-3 min-w-0">

                <div

                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0 ${

                    post.avatarColor || 'bg-emerald-700 text-white'

                  }`}

                >

                  {post.avatarIcon ? (

                    <AsonapaqLogo size="sm" />

                  ) : (

                    <span>{post.avatarInitials}</span>

                  )}

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-1.5">

                    <span className="text-sm font-bold text-slate-900 truncate">

                      {post.autor}

                    </span>

                    {post.verificado && (

                      <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100 flex-shrink-0" />

                    )}

                  </div>

                  <span className="text-[11px] text-slate-500 block truncate">

                    {post.rolAutor}

                  </span>

                </div>

              </div>



              {post.badgeTexto && (

                <span

                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${

                    post.tipo === 'oficial'

                      ? 'bg-emerald-100 text-emerald-800'

                      : post.tipo === 'campana'

                      ? 'bg-teal-100 text-teal-800'

                      : 'bg-slate-100 text-slate-700'

                  }`}

                >

                  {post.badgeTexto}

                </span>

              )}

            </div>



            {/* Post Content */}

            <div className="px-4 sm:px-5 py-2 space-y-2">

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">

                {post.contenido}

              </p>

            </div>



            {/* Medía Image */}

            {post.imagenUrl && (

              <div className="px-4 sm:px-5 py-1">

                <div className="relative w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-slate-900">

                  <img

                    src={post.imagenUrl}

                    alt="Publicación"

                    className="w-full h-full object-cover"

                  />

                  {post.badgeTexto === 'Oficial' && (

                    <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">

                      <Sparkles className="w-3 h-3 text-emerald-400" />

                      <span>85 familias beneficiadas</span>

                    </div>

                  )}

                  {post.badgeTexto === 'Campana' && (

                    <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">

                      <BellRing className="w-3 h-3 text-amber-400" />

                      <span>12 de 12 ciclos completados con ééxito Ã¢Å“Â¨</span>

                    </div>

                  )}

                </div>

              </div>

            )}



            {/* Admin Author Control Ribbon (Optional for Post 1) */}

            {post.tipo === 'oficial' && (

              <div className="mx-4 sm:mx-5 my-2 bg-slate-50 border border-slate-200/70 rounded-2xl p-2.5 flex items-center justify-between">

                <div className="flex items-center gap-2 min-w-0">

                  <Lock className="w-3.5 h-3.5 text-slate-500" />

                  <span className="text-[11px] text-slate-700 font-semibold truncate">

                    Modo Autor: Permitir comentarios

                  </span>

                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">

                  <input

                    type="checkbox"

                    checked={post.permitirComentarios}

                    onChange={() => handleToggleAllowCommás(post.id)}

                    className="sr-only peer"

                  />

                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-700" />

                </label>

              </div>

            )}



            {/* Interaction Bar */}

            <div className="px-4 sm:px-5 py-2.5 flex items-center justify-between border-t border-slate-100 mt-2">

              <button

                type="button"

                onClick={() => handleToggleLike(post.id)}

                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-slate-100 transition-colors active:scale-95 text-xs font-semibold"

              >

                <Heart

                  className={`w-4 h-4 transition-colors ${

                    post.userLiked ? 'text-rose-600 fill-rose-600' : 'text-slate-400'

                  }`}

                />

                <span className={post.userLiked ? 'text-rose-600' : 'text-slate-700'}>

                  {post.likes} Me Gusta

                </span>

              </button>



              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">

                <MessageCircle className="w-4 h-4 text-slate-400" />

                <span>{(post.comentarios || []).length} Comentarios</span>

              </div>

            </div>



            {/* Commás Area */}

            {post.soloDifusion ? (

              <div className="bg-slate-50 p-3 text-center border-t border-slate-100">

                <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">

                  <Lock className="w-3 h-3 text-slate-400" />

                  Comentarios desactivados para estáe anuncio oficial

                </span>

              </div>

            ) : post.permitirComentarios ? (

              <div className="bg-slate-50/80 px-4 sm:px-5 py-3.5 space-y-3 border-t border-slate-100">

                {/* Commás List */}

                <div className="space-y-2">

                  {(post.comentarios || []).map((comm) => (

                    <div

                      key={comm.id}

                      className="bg-white p-2.5 rounded-2xl shadow-2xs border border-slate-100 flex items-start gap-2.5 text-xs"

                    >

                      <div

                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 ${

                          comm.colorBg || 'bg-slate-600 text-white'

                        }`}

                      >

                        {comm.iniciales}

                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between">

                          <span className="font-bold text-slate-900">{comm.autor}</span>

                          <span className="text-[10px] text-slate-400">{comm.tiempo}</span>

                        </div>

                        <p className="text-slate-700 mt-0.5 leading-snug">{comm.mensaje}</p>

                      </div>

                    </div>

                  ))}

                </div>



                {/* Add comment input */}

                <div className="flex items-center gap-2 pt-1">

                  <input

                    type="text"

                    value={commentInputs[post.id] || ''}

                    onChange={(e) =>

                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })

                    }

                    onKeyDown={(e) => {

                      if (e.key === 'Enter') handleAddComment(post.id);

                    }}

                    placeholder="Escribe un mensaje de apoyo..."

                    className="flex-1 h-10 px-3.5 rounded-full bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 shadow-2xs"

                  />

                  <button

                    type="button"

                    onClick={() => handleAddComment(post.id)}

                    className="h-10 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-transform flex items-center gap-1"

                  >

                    <span>Enviar</span>

                    <Send className="w-3 h-3" />

                  </button>

                </div>

              </div>

            ) : (

              <div className="bg-slate-50 p-3 text-center border-t border-slate-100">

                <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">

                  <Lock className="w-3 h-3 text-slate-400" />

                  Comentarios desactivados temporalmente por el autor

                </span>

              </div>

            )}

          </article>

        ))}

      </div>



      {/* Humanist Care Note */}

      <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-3.5 shadow-sm">

        <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">

          <HandHeart className="w-5 h-5 text-emerald-700" />

        </div>

        <div className="min-w-0">

          <h4 className="text-xs font-bold text-slate-900">

            ¿Necesitas hablar con alguien hoy?

          </h4>

          <p className="text-[11px] text-slate-600 leading-snug">

            Nuestára línea de acompañamiento emocional y oración estáá activa las 24 horas para ti en Panamá.á.

          </p>

        </div>

      </div>

    </div>

  );

};











