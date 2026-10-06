import glob
for file in glob.glob('components/**/*.tsx', recursive=True):
    with open(file, 'r', encoding='utf-8') as f:
        text = f.read()
    # Fix possibly undefined
    text = text.replace('post.comentarios.map', '(post.comentarios || []).map')
    text = text.replace('post.comentarios.length', '(post.comentarios || []).length')
    text = text.replace('volunteer.horasAcumuladas', '(volunteer.horasAcumuladas || 0)')
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)

# Fix MainAppContainer props
with open('components/views/PanelAdministracionView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
    text = text.replace('interface PanelAdministracionViewProps {\n  patients: PatientRecord[];\n  onRouteChange: (route: AppRoute) => void;\n  onOpenGoogleSheets: () => void;\n}', 'interface PanelAdministracionViewProps {\n  patients?: PatientRecord[];\n  onRouteChange?: (route: AppRoute) => void;\n  onOpenGoogleSheets?: () => void;\n}')
with open('components/views/PanelAdministracionView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

with open('components/views/AuditoriaSocialView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
    text = text.replace('interface AuditoriaSocialViewProps {\n  onRouteChange: (route: AppRoute) => void;\n}', 'interface AuditoriaSocialViewProps {\n  onRouteChange?: (route: AppRoute) => void;\n}')
with open('components/views/AuditoriaSocialView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

