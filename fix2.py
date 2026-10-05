import re
with open("components/views/MuroComunidadView.tsx", "r", encoding="utf-8") as f:
    text = f.read()
text = re.sub(r'alt=\{p.*?n\'\}', 'alt="Publicación"', text)
with open("components/views/MuroComunidadView.tsx", "w", encoding="utf-8") as f:
    f.write(text)
