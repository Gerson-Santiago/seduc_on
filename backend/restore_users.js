import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const usersToRestore = [
    { email: 'gerson.santiago@seducbertioga.com.br', nome: 'Gerson Santiago', perfil: 'superadmin' },
    { email: 'monitoramento@seducbertioga.com.br', nome: 'Monitoramento', perfil: 'admin' }
  ];

  console.log("Restoring users...");

  for (const u of usersToRestore) {
    const existing = await prisma.usuario.findUnique({ where: { email: u.email } });
    
    if (!existing) {
      await prisma.usuario.create({
        data: {
          email: u.email,
          nome: u.nome,
          perfil: u.perfil,
          ativo: true
        }
      });
      console.log(`✅ Created user: ${u.email}`);
    } else {
      console.log(`ℹ️ User already exists: ${u.email}`);
      // Ensure it is active
      if (!existing.ativo) {
        await prisma.usuario.update({
          where: { email: u.email },
          data: { ativo: true }
        });
        console.log(`   -> Reactivated user.`);
      }
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
