// backend/verify_picture.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const users = await prisma.usuario.findMany({
        select: {
            email: true,
            nome: true,
            picture: true
        }
    })

    console.log('--- Usuários no Banco de Dados ---')
    users.forEach(u => {
        console.log(`Email: ${u.email}`)
        console.log(`Nome: ${u.nome}`)
        console.log(`Foto: ${u.picture ? '✅ Salva (' + u.picture.substring(0, 30) + '...)' : '❌ Não salva'}`)
        console.log('-----------------------------------')
    })
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
