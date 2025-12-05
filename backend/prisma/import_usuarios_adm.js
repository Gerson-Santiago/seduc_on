import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const caminhoArquivoCsv = path.join(__dirname, '../../csv/usuarios_adm.csv');

async function main() {
    console.log('Iniciando importação de usuários...');
    console.log(`Lendo CSV de ${caminhoArquivoCsv}...`);

    const resultados = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream(caminhoArquivoCsv)
            .pipe(csv())
            .on('data', (dados) => resultados.push(dados))
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`Lidas ${resultados.length} linhas. Atualizando/Inserindo no Banco de Dados...`);

    let contador = 0;
    for (const linha of resultados) {
        if (!linha.email) continue;

        try {
            await prisma.usuario.upsert({
                where: { email: linha.email },
                update: {
                    nome: linha.nome,
                    perfil: linha.perfil || 'comum', // Padrão 'comum' se faltar
                    ativo: true
                },
                create: {
                    email: linha.email,
                    nome: linha.nome,
                    perfil: linha.perfil || 'comum',
                    ativo: true
                }
            });
            contador++;
        } catch (e) {
            console.error(`Erro ao importar usuário ${linha.email}:`, e.message);
        }
    }

    console.log(`Importação de usuários concluída. Processados ${contador} usuários.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
