import glob, re

replacements = {
    'auditora': 'auditoría',
    'mdica': 'médica',
    'Repblica': 'República',
    'Panam': 'Panamá',
    'Pblica': 'Pública',
    'tcnica': 'técnica',
    'mdico': 'médico'
}

for file in glob.glob('components/**/*.tsx', recursive=True):
    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    for k, v in replacements.items():
        text = text.replace(k, v)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
