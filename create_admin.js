const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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

async function createAdmin() {
  const email = 'admin@asonapaq.local';
  const cedula = 'admin';
  const password = 'admin123';
  const nombre_completo = 'Omar Gutierrez (Director)';

  console.log('Creando usuario administrador...');

  const { data: user, error: authError } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: {
      cedula: cedula,
      nombre_completo: nombre_completo,
      rol: 'admin'
    }
  });

  if (authError) {
    if (authError.message.includes('already been registered')) {
        console.log('Admin auth user ya existe, actualizando su rol en perfiles...');
        const { data: existingUser } = await supabase.from('perfiles').select('*').eq('cedula', cedula).single();
        if (existingUser) {
           await supabase.from('perfiles').update({ rol: 'admin' }).eq('id', existingUser.id);
           console.log('Rol de Admin actualizado.');
        } else {
            console.log('El perfil no existe aun, algo fallo.');
        }
    } else {
        console.error('Error creando admin auth:', authError);
    }
  } else {
    console.log('Admin creado en Auth:', user.user.id);
    const { error: profileError } = await supabase
      .from('perfiles')
      .update({ rol: 'admin' })
      .eq('id', user.user.id);

    if (profileError) {
      console.error('Error actualizando rol en perfil:', profileError);
    } else {
      console.log('Admin creado y configurado exitosamente.');
    }
  }
}

createAdmin();
