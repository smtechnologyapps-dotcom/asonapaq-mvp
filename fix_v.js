const fs = require('fs');
const file = 'components/views/PortalVoluntarioView.tsx';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/Inscrito V/g, 'Inscrito \\u2713');
text = text.replace(/8:00 AM .* 12:00 PM/g, '8:00 AM - 12:00 PM');
text = text.replace(/1:00 PM .* 5:00 PM/g, '1:00 PM - 5:00 PM');

fs.writeFileSync(file, text, 'utf8');
