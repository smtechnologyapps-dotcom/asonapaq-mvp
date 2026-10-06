import glob, codecs

replacements = {
    'Panamáá¡ Ã‚Â· Desde 1989': 'Panamá · Desde 1989',
    'material-symás-outlined': 'material-symbols-outlined',
    'Fe Ã‚Â· Esperanza Ã‚Â· Vida': 'Fe · Esperanza · Vida',
    'día Asociación': 'de la Asociación',
    'quimioterapia. En la República de Panamáá¡.': 'Quimioterapia en la República de Panamá.',
    'Orientación Inmedía Ã‚Â·': 'Orientación Inmediata ·',
    'Insumás Médicos': 'Insumos Médicos',
    'calidía cada paciente': 'calidad a cada paciente',
    'Panamáá¡.': 'Panamá.',
    'Panamáá¡': 'Panamá',
    'ningÃƒÂºn paciente': 'ningún paciente',
    'Cada pública de Panamá.': 'Cada paciente es abrazado con empatía, cuidado y respeto en su proceso.',
    'Instécnica': 'Institucional',
    'Juntécnica ION': 'Junta Técnica ION'
}

with codecs.open('components/views/InicioPublicaView.tsx', 'r', 'utf-8') as f:
    text = f.read()

for k, v in replacements.items():
    text = text.replace(k, v)

with codecs.open('components/views/InicioPublicaView.tsx', 'w', 'utf-8') as f:
    f.write(text)

# Also fix the Header because it has "Panamáá" and footer has "Panamáá"
for file in glob.glob('components/**/*.tsx', recursive=True):
    with codecs.open(file, 'r', 'utf-8') as f:
        content = f.read()
    changed = False
    if 'Panamáá' in content or 'Ã' in content:
        content = content.replace('Panamáá', 'Panamá')
        content = content.replace('Ã,Â·', '·')
        content = content.replace('ÃƒÂ±', 'ñ')
        changed = True
    if changed:
        with codecs.open(file, 'w', 'utf-8') as f:
            f.write(content)

