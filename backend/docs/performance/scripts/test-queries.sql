-- ============================================================
-- Script de Análise de Performance - PostgreSQL
-- Sistema SEDUC ON
-- ============================================================

-- 1. VERIFICAR ÍNDICES EXISTENTES
-- ============================================================

\echo '\n=== ÍNDICES NA TABELA alunos_integracao_all ==='
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'alunos_integracao_all'
ORDER BY indexname;

\echo '\n=== ÍNDICES NA TABELA alunos_regular_ei_ef9 ==='
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'alunos_regular_ei_ef9'
ORDER BY indexname;

\echo '\n=== ÍNDICES NA TABELA alunos_aee ==='
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'alunos_aee'
ORDER BY indexname;

\echo '\n=== ÍNDICES NA TABELA alunos_eja ==='
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'alunos_eja'
ORDER BY indexname;

\echo '\n=== ÍNDICES NA TABELA dados_das_escolas ==='
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'dados_das_escolas'
ORDER BY indexname;

\echo '\n=== ÍNDICES NA TABELA consulta_matricula ==='
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'consulta_matricula'
ORDER BY indexname;

-- 2. ESTATÍSTICAS DAS TABELAS
-- ============================================================

\echo '\n=== CONTAGEM DE REGISTROS ==='
SELECT 'alunos_integracao_all' as tabela, COUNT(*) as total FROM alunos_integracao_all
UNION ALL
SELECT 'alunos_regular_ei_ef9', COUNT(*) FROM alunos_regular_ei_ef9
UNION ALL
SELECT 'alunos_aee', COUNT(*) FROM alunos_aee
UNION ALL
SELECT 'alunos_eja', COUNT(*) FROM alunos_eja
UNION ALL
SELECT 'dados_das_escolas', COUNT(*) FROM dados_das_escolas
UNION ALL
SELECT 'consulta_matricula', COUNT(*) FROM consulta_matricula;

\echo '\n=== TAMANHO DAS TABELAS ==='
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables
WHERE tablename IN (
    'alunos_integracao_all',
    'alunos_regular_ei_ef9',
    'alunos_aee',
    'alunos_eja',
    'dados_das_escolas',
    'consulta_matricula'
)
ORDER BY size_bytes DESC;

-- 3. ANÁLISE DE QUERIES CRÍTICAS
-- ============================================================

\echo '\n=== QUERY 1: getStats() - GroupBy por série (aluno.service.js) ==='
\echo 'Analisando agregação global por série...'
EXPLAIN (ANALYZE, BUFFERS, TIMING)
SELECT 
    filtro_serie, 
    COUNT(ra) as count
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO'
GROUP BY filtro_serie;

\echo '\n=== QUERY 2: getStats() - GroupBy por escola, tipo e série ==='
\echo 'Analisando agregação por escola...'
EXPLAIN (ANALYZE, BUFFERS, TIMING)
SELECT 
    nome_escola, 
    tipo_de_ensino, 
    filtro_serie,
    COUNT(ra) as count
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO'
GROUP BY nome_escola, tipo_de_ensino, filtro_serie
ORDER BY nome_escola ASC;

\echo '\n=== QUERY 3: findAllAlunos() - Listagem com filtros ==='
\echo 'Analisando listagem paginada de alunos...'
EXPLAIN (ANALYZE, BUFFERS, TIMING)
SELECT *
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO'
ORDER BY nome_aluno ASC
LIMIT 50 OFFSET 0;

\echo '\n=== QUERY 4: findAllAlunos() - Busca por nome (ILIKE) ==='
\echo 'Analisando busca case-insensitive...'
EXPLAIN (ANALYZE, BUFFERS, TIMING)
SELECT *
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO' 
  AND nome_aluno ILIKE '%Silva%'
ORDER BY nome_aluno ASC
LIMIT 50;

\echo '\n=== QUERY 5: findAlunoByRa() - Lookup por RA ==='
\echo 'Analisando busca por RA (unique constraint)...'
EXPLAIN (ANALYZE, BUFFERS, TIMING)
SELECT *
FROM alunos_regular_ei_ef9
WHERE ra = '123456789';

\echo '\n=== QUERY 6: getStats() escola - Múltiplos counts (escola.controller.js) ==='
\echo 'Analisando count por filtro_serie em consulta_matricula...'
EXPLAIN (ANALYZE, BUFFERS, TIMING)
SELECT COUNT(*)
FROM consulta_matricula
WHERE filtro_serie IN ('BERÇARIO 1', 'BERÇARIO 2');

\echo '\n=== QUERY 7: Teste de JOIN - Alunos com Escolas ==='
\echo 'Analisando JOIN entre alunos e escolas...'
EXPLAIN (ANALYZE, BUFFERS, TIMING)
SELECT 
    a.ra,
    a.nome_aluno,
    a.cod_escola,
    e.nome_escola,
    e.endereco
FROM alunos_regular_ei_ef9 a
LEFT JOIN dados_das_escolas e ON a.cod_escola = e.cod_escola
WHERE a.situacao = 'ATIVO'
LIMIT 100;

-- 4. ANÁLISE DE CAMPOS USADOS EM WHERE/GROUP BY
-- ============================================================

\echo '\n=== CAMPOS MAIS USADOS EM FILTROS ==='
\echo 'Campos que aparecem em WHERE e GROUP BY:'
\echo '  - filtro_serie (GROUP BY, WHERE IN)'
\echo '  - situacao (WHERE =)'
\echo '  - nome_aluno (WHERE ILIKE, ORDER BY)'
\echo '  - nome_escola (WHERE ILIKE, GROUP BY)'
\echo '  - tipo_de_ensino (GROUP BY)'
\echo '  - ra (WHERE = - já tem UNIQUE constraint)'
\echo '  - cod_escola (JOIN, WHERE)'

-- 5. SUGESTÕES DE ÍNDICES
-- ============================================================

\echo '\n=== SUGESTÕES DE ÍNDICES A CONSIDERAR ==='
\echo '
SUGESTÕES:

1. alunos_regular_ei_ef9:
   - CREATE INDEX idx_alunos_regular_situacao ON alunos_regular_ei_ef9(situacao);
   - CREATE INDEX idx_alunos_regular_filtro_serie ON alunos_regular_ei_ef9(filtro_serie);
   - CREATE INDEX idx_alunos_regular_nome ON alunos_regular_ei_ef9(nome_aluno);
   - CREATE INDEX idx_alunos_regular_escola ON alunos_regular_ei_ef9(cod_escola);
   - CREATE INDEX idx_alunos_regular_composite ON alunos_regular_ei_ef9(situacao, filtro_serie);

2. consulta_matricula:
   - CREATE INDEX idx_matricula_filtro_serie ON consulta_matricula(filtro_serie);
   - CREATE INDEX idx_matricula_escola ON consulta_matricula(cod_escola);

3. alunos_integracao_all:
   - CREATE INDEX idx_integracao_escola ON alunos_integracao_all(cod_escola);
   - CREATE INDEX idx_integracao_situacao ON alunos_integracao_all(situacao);

4. alunos_aee:
   - CREATE INDEX idx_aee_situacao ON alunos_aee(situacao);
   - CREATE INDEX idx_aee_escola ON alunos_aee(cod_escola);

5. alunos_eja:
   - CREATE INDEX idx_eja_situacao ON alunos_eja(situacao);
   - CREATE INDEX idx_eja_escola ON alunos_eja(cod_escola);
';

-- 6. ANÁLISE DE VACUUM E AUTOVACUUM
-- ============================================================

\echo '\n=== STATUS DO AUTOVACUUM ==='
SELECT 
    schemaname,
    relname,
    last_vacuum,
    last_autovacuum,
    vacuum_count,
    autovacuum_count
FROM pg_stat_user_tables
WHERE relname IN (
    'alunos_integracao_all',
    'alunos_regular_ei_ef9',
    'alunos_aee',
    'alunos_eja',
    'dados_das_escolas',
    'consulta_matricula'
);

\echo '\n=== FIM DA ANÁLISE ===\n'
