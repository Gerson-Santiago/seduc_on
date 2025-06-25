export const listarEscolas = async (req, res) => {
  try {
    const escolas = await req.prisma.escola.findMany();
    res.json(escolas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar escolas' });
  }
};
