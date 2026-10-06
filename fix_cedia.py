import glob, re

replacements = {
    'cedía': 'cedula',
    'proximaGuardía': 'proximaGuardia',
    'auditoría_social': 'auditoria_social',
    'onPurgePatientdía': 'onPurgePatientData',
    'AuditoriaSocialView': 'AuditoriaSocialView',  # just in case
    'auditoríaSocialView': 'AuditoriaSocialView',
    'junta_tecnica': 'junta_tecnica'
}

for file in glob.glob('components/**/*.tsx', recursive=True) + glob.glob('lib/**/*.ts', recursive=True):
    with open(file, 'r', encoding='utf-8') as f:
        text = f.read()
    
    for k, v in replacements.items():
        text = text.replace(k, v)
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
