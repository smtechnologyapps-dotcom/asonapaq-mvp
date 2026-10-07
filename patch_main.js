const fs = require('fs');
let file = 'components/MainAppContainer.tsx';
let text = fs.readFileSync(file, 'utf8');

// Agregar import de Supabase
if (!text.includes('import { supabase }')) {
  text = text.replace(
    "import { INITIAL_PATIENTS, INITIAL_VOLUNTEER, INITIAL_POSTS } from '../lib/store';",
    "import { INITIAL_PATIENTS, INITIAL_VOLUNTEER, INITIAL_POSTS } from '../lib/store';\nimport { supabase } from '../lib/supabase';"
  );
}

// Agregar useEffect para fetch
if (!text.includes('fetchSupabasePatients')) {
  const fetchHook = \
  React.useEffect(() => {
    if (isAuthenticatedAs === 'admin') {
      const fetchSupabasePatients = async () => {
        try {
          const { data, error } = await supabase
            .from('perfiles')
            .select('*, datos_medicos_pacientes(*)');
            
          if (data && !error) {
            const mapped = data.map(p => ({
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
\;
  text = text.replace(
    "const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);",
    "const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);\n" + fetchHook
  );
}

fs.writeFileSync(file, text, 'utf8');
console.log('MainAppContainer updated with real-time fetch');
