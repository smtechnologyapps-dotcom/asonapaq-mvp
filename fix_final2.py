import glob, re

# types.ts
with open('lib/types.ts', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('displayName?: string;', 'displayName?: string;\n  url?: string;')
text = text.replace('cedula?: string;', 'cedula: string;') # Revert cedula because it broke PanelAdministracionView
with open('lib/types.ts', 'w', encoding='utf-8') as f:
    f.write(text)

# Fix cedula in store.ts for the volunteer that missed it
with open('lib/store.ts', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('nombre: \'Carlos Mendoza\',', 'nombre: \'Carlos Mendoza\',\n  cedula: \'8-888-8888\',')
with open('lib/store.ts', 'w', encoding='utf-8') as f:
    f.write(text)

# MuroComunidadView.tsx
with open('components/views/MuroComunidadView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('[...post.comentarios].sort', '[...(post.comentarios || [])].sort')
with open('components/views/MuroComunidadView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# PanelAdministracionView.tsx
with open('components/views/PanelAdministracionView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('patients.filter', '(patients || []).filter')
text = text.replace('patients.reduce', '(patients || []).reduce')
text = text.replace('activeDataSet.filter', '(activeDataSet || []).filter')
text = text.replace('onRouteChange(', 'onRouteChange?.(')
with open('components/views/PanelAdministracionView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# AuditoriaSocialView.tsx
with open('components/views/AuditoriaSocialView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('onRouteChange(', 'onRouteChange?.(')
with open('components/views/AuditoriaSocialView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

