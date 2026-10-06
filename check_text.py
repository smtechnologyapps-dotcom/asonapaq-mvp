import glob, re

files = glob.glob('components/views/*.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    issues = []
    # Search for common broken text patterns from yesterday
    if re.search(r'p\s*blica\s*de Panam', content, re.IGNORECASE): issues.append('República de Panamá')
    if 'tcnica' in content: issues.append('técnica')
    if 'medica' in content: issues.append('médica')
    if 'panama' in content.lower(): issues.append('panamá')
    if 'auditoria' in content: issues.append('auditoría')
    
    if issues:
        print(f'{f}: {issues}')
