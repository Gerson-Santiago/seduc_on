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
    // OTIMIZAÇÃO: 1 query com CASE ao invés de 12 queries separadas
    const stats = await req.prisma.$queryRaw`
      SELECT 
        CASE 
          WHEN filtro_serie IN ('BERÇARIO 1', 'BERÇARIO 2') THEN 'bercario'
          WHEN filtro_serie IN ('MATERNAL 1', 'MATERNAL 2') THEN 'maternal'
          WHEN filtro_serie IN ('PRÉ-ESCOLA 1', 'PRÉ-ESCOLA 2') THEN 'pre'
          WHEN filtro_serie = '1 ANO' THEN 'ano1'
          WHEN filtro_serie = '2 ANO' THEN 'ano2'
          WHEN filtro_serie = '3 ANO' THEN 'ano3'
          WHEN filtro_serie = '4 ANO' THEN 'ano4'
          WHEN filtro_serie = '5 ANO' THEN 'ano5'
          WHEN filtro_serie = 'EJA1' THEN 'eja1'
          WHEN filtro_serie = 'EJA2' THEN 'eja2'
          WHEN filtro_serie = 'EDUCAÇÃO EXCLUSIVA' THEN 'eee'
          WHEN filtro_serie = 'EDUCAÇÃO ESPECIAL' THEN 'aee'
        END as categoria,
        COUNT(*) as total
      FROM consulta_matricula
      WHERE filtro_serie IS NOT NULL
      GROUP BY categoria
    `;

    // Transformar resultado em objeto com valores padrão 0
    const result = {
      bercario: 0,
      maternal: 0,
      pre: 0,
      ano1: 0,
      ano2: 0,
      ano3: 0,
      ano4: 0,
      ano5: 0,
      eja1: 0,
      eja2: 0,
      eee: 0,
      aee: 0
    };

    // Preencher com dados da query
    stats.forEach(row => {
      if (row.categoria && row.total) {
        result[row.categoria] = Number(row.total);
      }
    });

    res.json(result);

  } catch (error) {
    console.error("Error fetching school stats:", error);
    res.status(500).json({ error: "Failed to fetch school statistics" });
  }
};
