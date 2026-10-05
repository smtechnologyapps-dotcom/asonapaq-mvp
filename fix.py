# -*- coding: utf-8 -*-
with open('components/views/InicioPublicaView.tsx', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('onRoutécnica', 'onRouteChange(''junta_tecnica''')
with open('components/views/InicioPublicaView.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
