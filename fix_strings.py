import glob, re

replacements = {
    # Encoding artifacts from image
    'Ã,Â·': '·',
    'ÃƒÂ³': 'ó',
    'ÃƒÂ±': 'ñ',
    'ÃƒÂ­': 'í',
    'ÃƒÂ¡': 'á',
    'ÃƒÂ©': 'é',
    'AÃƒÂ±os': 'Años',
    'panameÃƒÂ±as': 'panameñas',
    'OrientaciÃƒÂ³n InmediÃ,Â·a': 'Orientación Inmediata',
    
    # Specific messed up phrases in code
    'Un espública de Panamá;': 'En la República de Panamá.',
    'Un espública de Panamá': 'En la República de Panamá',
    'Cada pblica de Panam.': 'Cada paciente es abrazado con empatía, cuidado y respeto en su proceso.',
    'Cada pública de Panamá.': 'Cada paciente es abrazado con empatía, cuidado y respeto en su proceso.',
    'calida cada': 'calidad a cada',
    'Juntcnica': 'Junta Técnica',
    
    # Broken Unicode chars
    'Insums': 'Insumos',
    'Mǟdicos': 'Médicos',
    'Mǟdicos': 'Médicos',
    'proteccin': 'protección',
    'apǟsitos': 'apósitos',
    'apǟsitos': 'apósitos',
    'oncolgicos': 'oncológicos',
    'catteres': 'catéteres',
    'mdicaciǟn': 'medicación',
    'médicaciǟn': 'medicación',
    'mdicaciǟn': 'medicación',
    'Contenciǟn': 'Contención',
    'Contenciǟn': 'Contención',
    'Cǟrculos': 'Círculos',
    'Cǟrculos': 'Círculos',
    'acompaamiento': 'acompañamiento',
    'crǟticos': 'críticos',
    'crǟticos': 'críticos',
    'Nutriciǟn': 'Nutrición',
    'Nutriciǟn': 'Nutrición',
    'hipercalǟricos': 'hipercalóricos',
    'hipercalǟricos': 'hipercalóricos',
    'asesora': 'asesoría',
    'paǟs': 'país',
    'paǟs': 'país',
    'Misiǟn': 'Misión',
    'Misiǟn': 'Misión',
    'Visiǟn': 'Visión',
    'Visiǟn': 'Visión',
    'Panam': 'Panamá',
    'oncolgica': 'oncológica',
    'ningǟn': 'ningún',
    'ningǟn': 'ningún',
    'Guǟan': 'Guían',
    'Guǟan': 'Guían',
    'Empatǟa': 'Empatía',
    'Empatǟa': 'Empatía',
    'Auditora': 'Auditoría',
    'Gestin': 'Gestión',
    
    'ǟ': 'í',
    'ǟ': 'í',
    'ǭ': 'á',
    'Ǹ': 'é'
}

for file in glob.glob('components/**/*.tsx', recursive=True) + glob.glob('lib/**/*.ts', recursive=True):
    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    for k, v in replacements.items():
        text = text.replace(k, v)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
