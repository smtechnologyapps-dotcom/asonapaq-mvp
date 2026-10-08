const fs = require('fs');
let form = fs.readFileSync('components/views/FormularioRegistroView.tsx', 'utf8');

const regex = /<input required name="diagnostico" value=\{formData\.diagnostico\} onChange=\{handleChange\} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500" placeholder="Ej\. [^"]+" \/>/;

const selectHTML = `<select required name="diagnostico" value={formData.diagnostico} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-emerald-500 text-sm">
                    <option value="">Seleccione su diagnóstico principal...</option>
                    <option value="Cáncer de Mama">Cáncer de Mama</option>
                    <option value="Cáncer de Próstata">Cáncer de Próstata</option>
                    <option value="Cáncer de Cérvix / Cuello Uterino">Cáncer de Cérvix / Cuello Uterino</option>
                    <option value="Cáncer de Pulmón">Cáncer de Pulmón</option>
                    <option value="Cáncer de Estómago / Gástrico">Cáncer de Estómago / Gástrico</option>
                    <option value="Cáncer de Colon / Recto">Cáncer de Colon / Recto</option>
                    <option value="Leucemia">Leucemia</option>
                    <option value="Linfoma">Linfoma</option>
                    <option value="Cáncer de Ovarios">Cáncer de Ovarios</option>
                    <option value="Cáncer de Tiroides">Cáncer de Tiroides</option>
                    <option value="Cáncer de Piel (Melanoma / No Melanoma)">Cáncer de Piel</option>
                    <option value="Cáncer de Hígado">Cáncer de Hígado</option>
                    <option value="Cáncer de Páncreas">Cáncer de Páncreas</option>
                    <option value="Tumor Cerebral">Tumor Cerebral</option>
                    <option value="Mieloma Múltiple">Mieloma Múltiple</option>
                    <option value="Otro">Otro (No listado)</option>
                  </select>`;

form = form.replace(regex, selectHTML);
fs.writeFileSync('components/views/FormularioRegistroView.tsx', form, 'utf8');
