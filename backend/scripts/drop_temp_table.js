import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log('Dropping table inconsistencias_importacao...');
    try {
        // Using raw SQL to drop the table. 
        // Note: This works for Postgres.
        await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "inconsistencias_importacao";');
        console.log('Table dropped successfully.');
    } catch (e) {
        console.error('Error dropping table:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
