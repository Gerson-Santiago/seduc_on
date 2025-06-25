export const listarMatriculas = async (req, res) => {
  try {
    const matriculas = await req.prisma.matricula.findMany();
    res.json(matriculas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar matrículas' });
  }
};

