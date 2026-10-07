const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqa2ZvcWFudHRpa3RoZG9ydWliIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDIwNDQ4MywiZXhwIjoyMTA1NzgwNDgzfQ.YEeQwMZKw2PtS5oRDFVmwE6ZzHf5b9ZzzTc_BhL9uEM';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, SERVICE_ROLE_KEY);

async function test() {
    const { data, error } = await supabase.from('perfiles').select('*, datos_medicos_pacientes(*)').limit(1);
    console.log(JSON.stringify(data, null, 2));
}
test();
