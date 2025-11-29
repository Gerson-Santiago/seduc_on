// scripts/apply_headers.js
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const TARGET_DIRS = ['frontend', 'backend', 'scripts'];
const IGNORE_DIRS = ['node_modules', '.git', '.vite', 'dist', 'build', 'coverage', '.vscode', '.idea'];

const COMMENT_STYLES = {
    '//': ['.js', '.jsx', '.ts', '.tsx', '.cjs', '.mjs'],
    '/*': ['.css', '.scss'],
    '<!--': ['.html']
};

function getCommentStyle(ext) {
    for (const [style, extensions] of Object.entries(COMMENT_STYLES)) {
        if (extensions.includes(ext)) return style;
    }
    return null;
}

function generateHeader(filePath, style) {
    const relativePath = path.relative(ROOT_DIR, filePath);
    // Normaliza para barras (mesmo em Windows)
    const normalizedPath = relativePath.split(path.sep).join('/');

    if (style === '//') return `// ${normalizedPath}`;
    if (style === '/*') return `/*\n// ${normalizedPath}\n*/`;
    if (style === '<!--') return `<!-- ${normalizedPath} -->`;
    return '';
}

function processFile(filePath) {
    const ext = path.extname(filePath);
    const style = getCommentStyle(ext);

    if (!style) return;

    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        const header = generateHeader(filePath, style);

        // Verifica se já tem o header correto
        if (lines[0].trim() === header.trim()) {
            return;
        }

        // Verifica se tem um header antigo ou incorreto na primeira linha
        // Se a primeira linha for um comentário do mesmo estilo, assumimos que é um header antigo e substituímos
        let newContent;
        let isFirstLineComment = false;

        if (style === '//' && lines[0].trim().startsWith('//')) isFirstLineComment = true;
        if (style === '/*' && lines[0].trim() === '/*' && lines[1] && lines[1].trim().startsWith('//')) {
            // Detecta formato multi-linha específico do usuário
            isFirstLineComment = true;
            // Precisamos substituir as 3 primeiras linhas
            lines.splice(0, 3, header);
            newContent = lines.join('\n');
            // Retorna aqui pois a lógica abaixo é para linha única
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`Updated (Multi-line CSS): ${filePath}`);
            return;
        }
        if (style === '/*' && lines[0].trim().startsWith('/*')) isFirstLineComment = true;
        if (style === '<!--' && lines[0].trim().startsWith('<!--')) isFirstLineComment = true;

        if (isFirstLineComment) {
            // Substitui a primeira linha
            lines[0] = header;
            newContent = lines.join('\n');
        } else {
            // Adiciona no topo
            newContent = header + '\n' + content;
        }

        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err);
    }
}

function traverseDir(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                traverseDir(fullPath);
            }
        } else {
            processFile(fullPath);
        }
    }
}

console.log('Starting header standardization...');
TARGET_DIRS.forEach(dir => {
    const fullPath = path.join(ROOT_DIR, dir);
    if (fs.existsSync(fullPath)) {
        traverseDir(fullPath);
    } else {
        console.warn(`Directory not found: ${fullPath}`);
    }
});
console.log('Done.');
