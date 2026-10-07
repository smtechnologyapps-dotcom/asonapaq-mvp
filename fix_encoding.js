const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    const replacements = {
        'Panamáá': 'Panamá',
        'CǸdula': 'Cédula',
        'cǸdula': 'cédula',
        'contrasea': 'contraseña',
        'sintǸtico': 'sintético',
        '????????': '••••••••',
        'Testáimonio': 'Testimonio',
        'ÃƒÂ¡nete': 'Únete',
        'med\u00eda': 'médica',
        'Ã¢Â€Â¦': '...',
        'Ã¢â‚¬â€œ': '-',
        'Revisin': 'Revisión',
        'mǸdicos': 'médicos',
        'Funcin': 'Función',
        'automǭticamente': 'automáticamente',
        'Polticas': 'Políticas',
        'Contrasea': 'Contraseña'
    };

    let original = content;
    for (const [key, val] of Object.entries(replacements)) {
        content = content.split(key).join(val);
    }
    
    if (original !== content) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed encoding in:', filePath);
    }
}

const dirsToScan = [
    'components',
    'components/views',
    'components/security',
    'lib'
];

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            scanDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.sql')) {
            replaceInFile(fullPath);
        }
    }
}

scanDir('components');
scanDir('lib');
replaceInFile('schema-supabase.sql');

console.log('Done scanning for encoding issues.');
