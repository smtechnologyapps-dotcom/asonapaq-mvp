import glob

for file in glob.glob('components/**/*.tsx', recursive=True):
    with open(file, 'r', encoding='utf-8') as f:
        text = f.read()
    
    text = text.replace('Panamáá', 'Panamá')
    text = text.replace('Panam', 'Panamá')
    text = text.replace('size=\"xs\"', 'size=\"sm\"')
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
