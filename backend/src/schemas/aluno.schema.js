import { z } from 'zod';

export const alunoSchema = z.object({
    ra: z.string().min(1, "RA é obrigatório"),
    nome_aluno: z.string().min(1, "Nome é obrigatório"),
    nome_escola: z.string().optional(),
    filtro_serie: z.string().optional(),
    data_nasci: z.string().or(z.date()).optional(), // Aceita string ISO ou Date object
    nome_responsavel: z.string().optional(),

    // Opcionais comuns
    municipio: z.string().optional(), // UF?
    uf: z.string().optional(),

    // Whitelist explícita: Apenas estes campos serão aceitos.
});

// Para atualização, todos os campos são opcionais.
export const alunoUpdateSchema = alunoSchema.partial();
