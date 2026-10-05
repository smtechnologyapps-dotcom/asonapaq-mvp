import glob, re
bad = re.compile('[\ufffd\u01df]|ó[a-z]ó|exp\\S*blica|onRout[^e]')
for f in sorted(glob.glob('components/**/*.tsx', recursive=True)+glob.glob('app/**/*.tsx', recursive=True)+glob.glob('lib/**/*.ts', recursive=True)):
    t = open(f, encoding='utf-8', errors='replace').read()
    n = len(bad.findall(t)); lines = t.count('\n')
    print(f"{n:5d} corrupt | {lines:5d} lines | {f}")
