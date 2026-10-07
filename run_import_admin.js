const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Usar Service Role Key para saltarse límites
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqa2ZvcWFudHRpa3RoZG9ydWliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDIwNDQ4MywiZXhwIjoyMTA1NzgwNDgzfQ.YEeQwMZKw2PtS5oRDFVmwE6ZzHf5b9ZzzTc_BhL9uEM';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

const data = JSON.parse(fs.readFileSync('patients_data.json', 'utf8'));

async function runImport() {
  console.log('Iniciando importación masiva de ' + data.length + ' pacientes (MODO ADMIN)...');
  
  for (const p of data) {
    const cleanCedula = p.cedula.replace(/[^0-9a-zA-Z-]/g, '');
    const syntheticEmail = `p${cleanCedula.replace(/-/g, '')}@asonapaq.local`;
    const password = p.cedula.replace(/-/g, '') + 'Aso!';
    
    console.log('Procesando: ' + p.nombre + ' (' + p.cedula + ') -> ' + syntheticEmail);

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: syntheticEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        nombre_completo: p.nombre,
        cedula: p.cedula,
        rol: 'paciente'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('  ⚠️ Usuario ya existe, saltando...');
      } else {
        console.log('  ❌ Auth Error: ' + authError.message);
      }
      continue;
    }

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('perfiles')
        .update({
          celular: p.celular,
          provincia: p.provincia,
          sexo: 'Desconozco',
          estado_civil: 'Desconozco'
        })
        .eq('id', authData.user.id);
        
      if (profileError) console.log('  ❌ Error Perfil: ' + profileError.message);

      const { error: medError } = await supabase
        .from('datos_medicos_pacientes')
        .insert({
          id: authData.user.id,
          diagnostico_principal: p.diagnostico,
          etapa_cancer: p.etapa,
          centro_atencion: 'ION'
        });
        
      if (medError) console.log('  ❌ Error Medico: ' + medError.message);
      else console.log('  ✅ Migrado con éxito');
    }
  }
  
  console.log('Importación finalizada.');
}

runImport();
