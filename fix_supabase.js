const fs = require('fs');
let formPath = 'components/views/FormularioRegistroView.tsx';
let formText = fs.readFileSync(formPath, 'utf8');

// Ensure supabase is imported
if (!formText.includes("import { supabase }")) {
  formText = formText.replace(
    "import { AsonapaqLogo } from '../AsonapaqLogo';",
    "import { AsonapaqLogo } from '../AsonapaqLogo';\nimport { supabase } from '../../lib/supabase';"
  );
}

// Update state to include password
if (!formText.includes("password: ''")) {
  formText = formText.replace(
    "fechaNacimiento: '', sexo: '', estadoCivil: '', nivelAcademico: '',",
    "password: '', fechaNacimiento: '', sexo: '', estadoCivil: '', nivelAcademico: '',"
  );
}

// Add loading state
if (!formText.includes("isSubmitting")) {
  formText = formText.replace(
    "const [userType, setUserType] = useState<'paciente' | 'voluntario' | ''>('');",
    "const [userType, setUserType] = useState<'paciente' | 'voluntario' | ''>('');\n  const [isSubmitting, setIsSubmitting] = useState(false);"
  );
}

// Rewrite handleSubmit
const newSubmit =   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { nombre: formData.nombre, cedula: formData.cedula, rol: userType }
        }
      });
      if (authError) throw authError;

      if (authData.user) {
        // 2. Actualizar resto del perfil
        const { error: profileError } = await supabase.from('perfiles').update({
          celular: formData.celular,
          fecha_nacimiento: formData.fechaNacimiento || null,
          sexo: formData.sexo,
          estado_civil: formData.estadoCivil,
          nivel_academico: formData.nivelAcademico,
          provincia: formData.provincia,
          direccion: formData.direccion,
          tipo_sangre: formData.tipoSangre,
          contacto_emergencia: formData.contactoEmergencia,
          tel_emergencia: formData.telEmergencia,
          parentesco_emergencia: formData.parentesco
        }).eq('id', authData.user.id);
        if (profileError) throw profileError;

        // 3. Insertar datos específicos
        if (userType === 'paciente') {
          await supabase.from('datos_medicos_pacientes').insert({
            id: authData.user.id,
            diagnostico_principal: formData.diagnostico,
            etapa_cancer: formData.etapa,
            centro_atencion: formData.atencion,
            tratamiento_actual: formData.tratamiento,
            medicamentos: formData.medicamento,
            donante_sangre: formData.donante === 'Sí'
          });
        } else if (userType === 'voluntario') {
          await supabase.from('datos_voluntarios').insert({
            id: authData.user.id,
            estatus_laboral: formData.estatusLaboral,
            area_apoyo: formData.tipoApoyo,
            pasatiempos: formData.pasatiempo
          });
        }
      }

      alert('¡Registro completado exitosamente! Hemos asegurado tu información.');
      if (onRouteChange) onRouteChange('inicio_publica');
    } catch (err: any) {
      console.error(err);
      alert('Error al registrar: ' + (err.message || 'Error desconocido'));
    } finally {
      setIsSubmitting(false);
    }
  };;

formText = formText.replace(/const handleSubmit = \(e: React\.FormEvent\) => \{[\s\S]*?\};\n/m, newSubmit + '\n');

// Add Email and Password to Paso 2
if (!formText.includes('name="email"')) {
  const newInputs =                 <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Correo Electrónico</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej. correo@ejemplo.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase">Crear Contraseña</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Mínimo 6 caracteres" minLength={6} />
                </div>;
  formText = formText.replace(
    /<div className="space-y-2">\s*<label className="text-xs font-bold text-slate-700 uppercase">Celular<\/label>/,
    newInputs + '\n                <div className="space-y-2">\n                  <label className="text-xs font-bold text-slate-700 uppercase">Celular</label>'
  );
}

// Update submit button to show loading
formText = formText.replace(
  /<button\s+type="submit"[\s\S]*?<\/button>/,
  <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                <Save className="w-5 h-5" /> {isSubmitting ? 'Guardando...' : 'Enviar Registro'}
              </button>
);

fs.writeFileSync(formPath, formText, 'utf8');
console.log('Successfully updated form logic with Supabase');
