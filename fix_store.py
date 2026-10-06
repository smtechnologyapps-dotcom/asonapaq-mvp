import re

with open('lib/store.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix cedula in any VolunteerProfile
text = re.sub(r'(nombre: \'[^\']+\',\s*credencial)', r'\1', text) # Wait, I can just use a regex for VolunteerProfile
text = re.sub(r'nombre: \'Carlos Mendoza\',', 'nombre: \'Carlos Mendoza\',\n    cedula: \'8-234-5678\',', text)
text = re.sub(r'nombre: \'Elena Vargas\',', 'nombre: \'Elena Vargas\',\n    cedula: \'8-345-6789\',', text)
text = re.sub(r'nombre: \'Marta Gomez\',', 'nombre: \'Marta Gomez\',\n    cedula: \'8-456-7890\',', text)

# Fix WebhookLogEntry missing event
text = text.replace('eventId: \'wf_call_', 'event: \'workflow_started\',\n    eventId: \'wf_call_')

# Fix duplicate statusText
text = re.sub(r'statusText: \'OK\',\s*statusText: \'OK\',', 'statusText: \'OK\',', text)

with open('lib/store.ts', 'w', encoding='utf-8') as f:
    f.write(text)

