import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Verifying Repair Table Strategy...');

    /*
      Expected Schema:
      model inconsistencias_importacao {
        id             Int      @id @default(autoincrement())
        arquivo_origem String
        linha_original Int?
        dados_json     Json
        motivo         String   <-- New
        ra             String?  <-- New
        nome_aluno     String?  <-- New
        criado_em      DateTime @default(now())
      }
    */

    try {
        const errorCount = await prisma.inconsistencias_importacao.count();
        console.log(`Total inconsistencies: ${errorCount}`);

        if (errorCount > 0) {
            // Fetch 5 to check fields
            const sample = await prisma.inconsistencias_importacao.findMany({
                take: 5,
                orderBy: { id: 'desc' }
            });

            console.log('Sample data:');
            sample.forEach(row => {
                console.log(`[ID: ${row.id}] RA: ${row.ra} | Nome: "${row.nome_aluno}" | Motivo: "${row.motivo}"`);
            });

            // Check specifically for RA 122758796 with correct fields
            const target = await prisma.inconsistencias_importacao.findFirst({
                where: { ra: '122758796' }
            });

            if (target) {
                console.log('\n✅ SUCCESS: Found target RA 122758796 in inconsistencies table.');
                console.log(`   Motivo: ${target.motivo}`);
                console.log(`   Nome Original: "${target.nome_aluno}"`);
            } else {
                console.log('\n❌ FAILURE: Target RA 122758796 NOT found in inconsistencies table (using new RA column).');
            }

        } else {
            console.log('No inconsistencies found. Check if import script ran correctly.');
        }

    } catch (e) {
        console.error('Error during verification:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
