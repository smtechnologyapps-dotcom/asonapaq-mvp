import glob, re

for file in glob.glob('components/**/*.tsx', recursive=True) + glob.glob('lib/**/*.ts', recursive=True):
    with open(file, 'r', encoding='utf-8') as f:
        text = f.read()
    
    text = text.replace('httpúblic/', 'https://lh3.googleusercontent.com/aida-public/')
    text = text.replace('httppública/', 'https://lh3.googleusercontent.com/aida-public/')
        
    with open(file, 'w', encoding='utf-8') as f:
        f.write(text)
