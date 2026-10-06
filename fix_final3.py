import re

# store.ts
with open('lib/store.ts', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('nombre: \'Ana Victoria\',', 'nombre: \'Ana Victoria\',\n  cedula: \'8-123-4567\',')
text = text.replace('status: 200,', 'status: 200,\n    statusText: \'OK\',')
with open('lib/store.ts', 'w', encoding='utf-8') as f:
    f.write(text)

# types.ts
with open('lib/types.ts', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('url?: string;', 'url?: string;\n  statusText?: string;')
with open('lib/types.ts', 'w', encoding='utf-8') as f:
    f.write(text)

# PanelAdministracionView.tsx
with open('components/views/PanelAdministracionView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = re.sub(r'patients\.slice', '(patients || []).slice', text)
text = re.sub(r'patients\.map', '(patients || []).map', text)
text = re.sub(r'patients\.length', '(patients || []).length', text)
with open('components/views/PanelAdministracionView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

# MuroComunidadView.tsx
with open('components/views/MuroComunidadView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('[...post.comentarios]', '[...(post.comentarios || [])]')
with open('components/views/MuroComunidadView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

