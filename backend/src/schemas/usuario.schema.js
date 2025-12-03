import { z } from 'zod';

export const usuarioSchema = z.object({
    email: z.string().email('Email inválido'),
    nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    role: z.enum(['ADMIN', 'USER', 'GESTOR'], {
        errorMap: () => ({ message: 'Role inválida. Valores permitidos: ADMIN, USER, GESTOR' })
    }).optional(),
    picture: z.string().url('URL da imagem inválida').optional()
});

export const usuarioUpdateSchema = usuarioSchema.partial();
