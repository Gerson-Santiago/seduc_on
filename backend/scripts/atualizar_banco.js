import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..'); // backend root

const scripts = [
    { name: 'Importar Escolas', path: 'prisma/import_dados_das_escolas.js' },
    { name: 'Importar Alunos', path: 'prisma/import_ALUNOS.js' },
    { name: 'Importar Matrículas', path: 'prisma/import_consulta_matricula.js' },
    { name: 'Importar Usuários', path: 'prisma/import_usuarios_adm.js' }
];

console.log('==================================================');
console.log('INICIANDO ATUALIZAÇÃO DO BANCO DE DADOS');
console.log('==================================================\n');

for (const script of scripts) {
    console.log(`>>> Executando: ${script.name}...`);
    try {
        // Execute script using node, inheriting stdio to show progress
        execSync(`node ${script.path}`, {
            cwd: rootDir,
            stdio: 'inherit'
        });
        console.log(`>>> ${script.name} concluído com sucesso.\n`);
    } catch (error) {
        console.error(`!!! Erro ao executar ${script.name}.`);
        console.error(error.message);
        console.log('\nProcesso interrompido devido a erro.');
        process.exit(1);
    }
}

console.log('==================================================');
console.log('ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!');
console.log('==================================================');
