const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Sometimes it's the replacement character (U+FFFD)
    content = content.replace(/C\uFFFDdula/g, 'Cédula');
    content = content.replace(/c\uFFFDdula/g, 'cédula');
    content = content.replace(/Contrase\uFFFDa/g, 'Contraseña');
    content = content.replace(/contrase\uFFFDa/g, 'contraseña');
    content = content.replace(/sint\uFFFDtico/g, 'sintético');
    content = content.replace(/Revisi\uFFFDn/g, 'Revisión');
    content = content.replace(/m\uFFFDdicos/g, 'médicos');
    content = content.replace(/Funci\uFFFDn/g, 'Función');
    content = content.replace(/autom\uFFFDticamente/g, 'automáticamente');
    content = content.replace(/Pol\uFFFDticas/g, 'Políticas');
    content = content.replace(/M\uFFFDdicos/g, 'Médicos');
    content = content.replace(/m\uFFFDdico/g, 'médico');
    content = content.replace(/\?\?\?\?\?\?\?\?/g, '••••••••');
    
    // Some specific strange encodings from the images
    content = content.replace(/Panamáá/g, 'Panamá');
    content = content.replace(/ÃƒÂ¡nete/g, 'Únete');
    content = content.replace(/med\u00eda/g, 'médica');
    content = content.replace(/Testáimonio/g, 'Testimonio');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

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

console.log('Done scanning for replacement chars.');
