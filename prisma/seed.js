import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const superadminEmail = 'gerson.santiago@seducbertioga.com.br'

  // Verifica se já existe superadmin
  const existing = await prisma.usuario.findUnique({
    where: { email: superadminEmail }
  })

  if (!existing) {
    await prisma.usuario.create({
      data: {
        email: superadminEmail,
        perfil: 'superadmin',
        nome: 'Gerson Santiago',
        ativo: true
      }
    })
    console.log('Superadmin criado:', superadminEmail)
  } else {
    console.log('Superadmin já existe:', superadminEmail)
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
