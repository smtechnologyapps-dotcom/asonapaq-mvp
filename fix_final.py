import glob, re

# types.ts
with open('lib/types.ts', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('rolAutor: string;', 'rolAutor?: string;')
text = text.replace('cedula: string;', 'cedula?: string;')
text = text.replace('eventId?: string;', 'eventId?: string;\n  displayName?: string;')
with open('lib/types.ts', 'w', encoding='utf-8') as f:
    f.write(text)

# Header.tsx
with open('components/Header.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('auditoria_social: \'Auditoría Social\'\n  };', 'auditoria_social: \'Auditoría Social\',\n    junta_tecnica: \'Junta Técnica ION\'\n  };')
with open('components/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# MainAppContainer.tsx
with open('components/MainAppContainer.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('<PanelAdministracionView />', '<PanelAdministracionView patients={patients} />')
text = text.replace('<AuditoriaSocialView />', '<AuditoriaSocialView onRouteChange={handleRouteChange} />')
with open('components/MainAppContainer.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# MuroComunidadView.tsx
with open('components/views/MuroComunidadView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('[...post.comentarios,', '[...(post.comentarios || []),')
with open('components/views/MuroComunidadView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# views props
for v in ['PanelAdministracionView.tsx', 'AuditoriaSocialView.tsx']:
    path = f'components/views/{v}'
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    text = re.sub(r'(\w+):\s*PatientRecord\[\];', r'\1?: PatientRecord[];', text)
    text = re.sub(r'onRouteChange:\s*\(', r'onRouteChange?: (', text)
    text = re.sub(r'onOpenGoogleSheets:\s*\(', r'onOpenGoogleSheets?: (', text)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(text)

