const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const data = JSON.parse(fs.readFileSync('patients_data.json', 'utf8'));

async function runImport() {
  console.log('Iniciando importación masiva de ' + data.length + ' pacientes...');
  
  for (const p of data) {
    const syntheticEmail = `${p.cedula}@asonapaq.local`;
    const password = p.cedula.replace(/-/g, '') + 'Aso!';
    
    console.log('Procesando: ' + p.nombre + ' (' + p.cedula + ')');

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: syntheticEmail,
      password: password,
      options: {
        data: {
          nombre_completo: p.nombre,
          cedula: p.cedula,
          rol: 'paciente'
        }
      }
    });

    if (authError) {
      console.log('  Auth Error: ' + authError.message);
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
        
      if (profileError) console.log('  Error Perfil: ' + profileError.message);

      const { error: medError } = await supabase
        .from('datos_medicos_pacientes')
        .insert({
          id: authData.user.id,
          diagnostico_principal: p.diagnostico,
          etapa_cancer: p.etapa,
          centro_atencion: 'ION'
        });
        
      if (medError) console.log('  Error Medico: ' + medError.message);
      else console.log('  Migrado con éxito');
    }
  }
  
  console.log('Importación finalizada.');
}

runImport();
