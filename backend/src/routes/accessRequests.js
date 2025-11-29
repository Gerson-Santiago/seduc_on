import express from 'express';
import { PrismaClient } from '@prisma/client';
import { createUserFromRequest } from '../services/usuario.service.js';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const requests = await prisma.access_requests.findMany({
            orderBy: { solicitado_em: 'desc' }
        });
        return res.json(requests);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno' });
    }
});

router.post('/', async (req, res) => {
    try {
        const {
            nome_completo,
            registro_funcional,
            contador_registro_funcional,
            cargo,
            setor,
            email
        } = req.body;

        // validações básicas
        if (!nome_completo || !registro_funcional || !email) {
            return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
        }

        // dominio institucional (do .env)
        const INSTITUTION_DOMAIN = process.env.SEDUC_DOMAIN || 'seducbertioga.com.br';
        if (!email.endsWith(`@${INSTITUTION_DOMAIN}`)) {
            return res.status(400).json({ message: `E-mail deve terminar com @${INSTITUTION_DOMAIN}` });
        }

        // registro_funcional e contador inteiros
        const rf = parseInt(String(registro_funcional).replace(/\D/g, ''), 10);
        const contador = contador_registro_funcional ? parseInt(String(contador_registro_funcional).replace(/\D/g, ''), 10) : 1;

        if (Number.isNaN(rf)) return res.status(400).json({ message: 'Registro funcional inválido.' });

        const created = await prisma.access_requests.create({
            data: {
                nome_completo,
                registro_funcional: rf,
                contador_registro_funcional: contador,
                cargo,
                setor,
                email,
            }
        });

        return res.status(201).json({ id: created.id, status: created.status });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno' });
    }
});

// Aprovar solicitação
router.put('/:id/approve', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const reqRow = await prisma.access_requests.findUnique({ where: { id } });
        if (!reqRow) return res.status(404).json({ message: 'Solicitação não encontrada.' });

        // atualizar status
        await prisma.access_requests.update({ where: { id }, data: { status: 'aprovado' } });

        // criar usuário automaticamente
        await createUserFromRequest(prisma, reqRow);

        return res.json({ message: 'Aprovado e usuário criado.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno.' });
    }
});

// Rejeitar solicitação
router.put('/:id/reject', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const reqRow = await prisma.access_requests.findUnique({ where: { id } });
        if (!reqRow) return res.status(404).json({ message: 'Solicitação não encontrada.' });

        // atualizar status
        await prisma.access_requests.update({ where: { id }, data: { status: 'negado' } });

        return res.json({ message: 'Solicitação negada.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro interno.' });
    }
});

export default router;
