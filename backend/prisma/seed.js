// backend/prisma/seed.js
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function main() {
  const superadminEmail = process.env.SUPERADMIN_EMAIL
  const superadminName = process.env.SUPERADMIN_NAME

  if (!superadminEmail) {
    throw new Error('SUPERADMIN_EMAIL não definido no .env')
  }

  const existing = await prisma.usuario.findUnique({
    where: { email: superadminEmail }
  })

  if (!existing) {
    await prisma.usuario.create({
      data: {
        email: superadminEmail,
        perfil: 'superadmin',
        nome: superadminName,
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
