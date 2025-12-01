import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

const csvFilePath = path.join(__dirname, '../../csv/usuarios_adm.csv');

async function main() {
    console.log('Starting users import...');
    console.log(`Reading CSV from ${csvFilePath}...`);

    const results = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });

    console.log(`Parsed ${results.length} rows. Upserting into DB...`);

    let count = 0;
    for (const row of results) {
        if (!row.email) continue;

        try {
            await prisma.usuario.upsert({
                where: { email: row.email },
                update: {
                    nome: row.nome,
                    perfil: row.perfil || 'comum', // Default to comum if missing
                    ativo: true
                },
                create: {
                    email: row.email,
                    nome: row.nome,
                    perfil: row.perfil || 'comum',
                    ativo: true
                }
            });
            count++;
        } catch (e) {
            console.error(`Error importing user ${row.email}:`, e.message);
        }
    }

    console.log(`Users import complete. Processed ${count} users.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
