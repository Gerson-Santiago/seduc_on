// backend/src/controllers/escola.controller.js
export const listarEscolas = async (req, res) => {
  try {
    const escolas = await req.prisma.dados_das_escolas.findMany();
    res.json(escolas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const getClassCount = async (filtroSerieList) => {
      const count = await req.prisma.consulta_matricula.count({
        where: {
          filtro_serie: { in: filtroSerieList }
        }
      });
      return count;
    };

    const bercario = await getClassCount(['BERÇARIO 1', 'BERÇARIO 2']);
    const maternal = await getClassCount(['MATERNAL 1', 'MATERNAL 2']);
    const pre = await getClassCount(['PRÉ-ESCOLA 1', 'PRÉ-ESCOLA 2']);

    const ano1 = await getClassCount(['1 ANO']);
    const ano2 = await getClassCount(['2 ANO']);
    const ano3 = await getClassCount(['3 ANO']);
    const ano4 = await getClassCount(['4 ANO']);
    const ano5 = await getClassCount(['5 ANO']);

    const eja1 = await getClassCount(['EJA1']);
    const eja2 = await getClassCount(['EJA2']);
    const eee = await getClassCount(['EDUCAÇÃO EXCLUSIVA']);
    const aee = await getClassCount(['EDUCAÇÃO ESPECIAL']);

    res.json({
      bercario,
      maternal,
      pre,
      ano1,
      ano2,
      ano3,
      ano4,
      ano5,
      eja1,
      eja2,
      eee,
      aee
    });

  } catch (error) {
    console.error("Error fetching school stats:", error);
    res.status(500).json({ error: "Failed to fetch school statistics" });
  }
};
