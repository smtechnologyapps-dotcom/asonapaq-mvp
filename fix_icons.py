import glob

for file in glob.glob('components/**/*.tsx', recursive=True):
    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
        text = f.read()
    
    text = text.replace('material-syms-outlined', 'material-symbols-outlined')
    text = text.replace('material-symós-outlined', 'material-symbols-outlined')
    text = text.replace('material-syms-rounded', 'material-symbols-rounded')
    text = text.replace('material-symós-rounded', 'material-symbols-rounded')
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
