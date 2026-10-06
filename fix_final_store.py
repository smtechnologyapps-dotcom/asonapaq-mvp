# Fix store.ts
with open('lib/store.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('id: \'VN-089\',', 'id: \'VN-089\',\n  cedula: \'8-888-8888\',')
import re
text = re.sub(r'statusText: \'OK\',\n\s*statusText: \'OK \(Simulated n8n Trigger Execution\)\',', 'statusText: \'OK (Simulated n8n Trigger Execution)\',', text)

with open('lib/store.ts', 'w', encoding='utf-8') as f:
    f.write(text)

# Also fix WebhookLogEntry in types.ts because I might have broken it
with open('lib/types.ts', 'r', encoding='utf-8') as f:
    text = f.read()
text = text.replace('event: string;', 'event?: string;')
with open('lib/types.ts', 'w', encoding='utf-8') as f:
    f.write(text)

