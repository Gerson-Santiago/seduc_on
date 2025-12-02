-- ============================================================
-- Script de Otimização - PostgreSQL
-- Sistema SEDUC ON
-- EXECUTAR APENAS APÓS APROVAÇÃO E BACKUP
-- ============================================================

-- IMPORTANTE: Fazer backup antes de executar
-- pg_dump seduc_on > backup_before_optimization_$(date +%Y%m%d).sql

\echo '\n╔═══════════════════════════════════════════════════════════════════╗'
\echo '║  SEDUC ON - OTIMIZAÇÃO DE PERFORMANCE                            ║'
\echo '║  Script de criação de índices                                     ║'
\echo '╚═══════════════════════════════════════════════════════════════════╝\n'

-- ============================================================
-- VERIFICAR TAMANHO DAS TABELAS ANTES
-- ============================================================

\echo '\n=== TAMANHO DAS TABELAS (ANTES) ==='
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size_total,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as size_data,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as size_indexes
FROM pg_tables
WHERE tablename IN (
    'alunos_integracao_all',
    'alunos_regular_ei_ef9',
    'alunos_aee',
    'alunos_eja',
    'dados_das_escolas',
    'consulta_matricula'
)
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================
-- ÍNDICES PRIORITÁRIOS (PRIORIDADE ALTA ⚡)
-- ============================================================

\echo '\n=== CRIANDO ÍNDICES PRIORITÁRIOS ===\n'

-- 1. Índice composto em alunos_regular_ei_ef9 (situação + filtro_serie)
-- Usado em: getStats() - agregações por série de alunos ativos
\echo '1/8 - Criando idx_alunos_regular_situacao_serie...'
CREATE INDEX IF NOT EXISTS idx_alunos_regular_situacao_serie 
ON alunos_regular_ei_ef9(situacao, filtro_serie);

-- 2. Índice em consulta_matricula (filtro_serie)
-- Usado em: getStats() escola - múltiplos counts por série
\echo '2/8 - Criando idx_matricula_filtro_serie...'
CREATE INDEX IF NOT EXISTS idx_matricula_filtro_serie 
ON consulta_matricula(filtro_serie);

-- 3. Índice para JOINs (cod_escola em alunos_regular_ei_ef9)
-- Usado em: JOINs com dados_das_escolas
\echo '3/8 - Criando idx_alunos_regular_cod_escola...'
CREATE INDEX IF NOT EXISTS idx_alunos_regular_cod_escola 
ON alunos_regular_ei_ef9(cod_escola);

-- ============================================================
-- ÍNDICES SECUNDÁRIOS (PRIORIDADE MÉDIA ⚡)
-- ============================================================

\echo '\n=== CRIANDO ÍNDICES SECUNDÁRIOS ===\n'

-- 4. Índice para ordenação por nome
-- Usado em: findAllAlunos() - ORDER BY nome_aluno
\echo '4/8 - Criando idx_alunos_regular_nome...'
CREATE INDEX IF NOT EXISTS idx_alunos_regular_nome 
ON alunos_regular_ei_ef9(nome_aluno);

-- 5. Índices em alunos_aee (situação)
\echo '5/8 - Criando idx_alunos_aee_situacao...'
CREATE INDEX IF NOT EXISTS idx_alunos_aee_situacao 
ON alunos_aee(situacao);

CREATE INDEX IF NOT EXISTS idx_alunos_aee_cod_escola 
ON alunos_aee(cod_escola);

-- 6. Índices em alunos_eja (situação)
\echo '6/8 - Criando idx_alunos_eja_situacao...'
CREATE INDEX IF NOT EXISTS idx_alunos_eja_situacao 
ON alunos_eja(situacao);

CREATE INDEX IF NOT EXISTS idx_alunos_eja_cod_escola 
ON alunos_eja(cod_escola);

-- 7. Índices em alunos_integracao_all (tabela de staging)
\echo '7/8 - Criando índices em alunos_integracao_all...'
CREATE INDEX IF NOT EXISTS idx_integracao_situacao 
ON alunos_integracao_all(situacao);

CREATE INDEX IF NOT EXISTS idx_integracao_cod_escola 
ON alunos_integracao_all(cod_escola);

-- 8. Índice em consulta_matricula para JOINs
\echo '8/8 - Criando idx_matricula_cod_escola...'
CREATE INDEX IF NOT EXISTS idx_matricula_cod_escola 
ON consulta_matricula(cod_escola);

-- ============================================================
-- ÍNDICES ESPECIALIZADOS (OPCIONAL - COMENTADOS)
-- ============================================================

-- Índice parcial para apenas alunos ATIVOS (reduz tamanho)
-- Descomente se a maioria das queries filtra por situacao = 'ATIVO'
/*
\echo '\n=== CRIANDO ÍNDICES PARCIAIS (OPCIONAL) ===\n'

CREATE INDEX IF NOT EXISTS idx_alunos_regular_ativos_serie 
ON alunos_regular_ei_ef9(filtro_serie) 
WHERE situacao = 'ATIVO';

CREATE INDEX IF NOT EXISTS idx_alunos_aee_ativos 
ON alunos_aee(cod_escola) 
WHERE situacao = 'ATIVO';

CREATE INDEX IF NOT EXISTS idx_alunos_eja_ativos 
ON alunos_eja(cod_escola) 
WHERE situacao = 'ATIVO';
*/

-- ============================================================
-- ANÁLISE E VACUUM
-- ============================================================

\echo '\n=== ATUALIZANDO ESTATÍSTICAS DO PLANNER ===\n'

-- Atualizar estatísticas para que o PostgreSQL use os novos índices
ANALYZE alunos_integracao_all;
ANALYZE alunos_regular_ei_ef9;
ANALYZE alunos_aee;
ANALYZE alunos_eja;
ANALYZE consulta_matricula;
ANALYZE dados_das_escolas;

\echo '\n=== EXECUTANDO VACUUM (LIMPEZA) ===\n'

-- Limpar tabelas e otimizar
VACUUM alunos_integracao_all;
VACUUM alunos_regular_ei_ef9;
VACUUM alunos_aee;
VACUUM alunos_eja;
VACUUM consulta_matricula;
VACUUM dados_das_escolas;

-- ============================================================
-- VERIFICAR ÍNDICES CRIADOS
-- ============================================================

\echo '\n=== ÍNDICES CRIADOS EM alunos_regular_ei_ef9 ==='
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'alunos_regular_ei_ef9'
ORDER BY indexname;

\echo '\n=== ÍNDICES CRIADOS EM consulta_matricula ==='
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'consulta_matricula'
ORDER BY indexname;

-- ============================================================
-- TAMANHO DAS TABELAS APÓS ÍNDICES
-- ============================================================

\echo '\n=== TAMANHO DAS TABELAS (APÓS) ==='
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size_total,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as size_data,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as size_indexes
FROM pg_tables
WHERE tablename IN (
    'alunos_integracao_all',
    'alunos_regular_ei_ef9',
    'alunos_aee',
    'alunos_eja',
    'dados_das_escolas',
    'consulta_matricula'
)
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================
-- TESTE RÁPIDO DE PERFORMANCE
-- ============================================================

\echo '\n=== TESTE DE PERFORMANCE (APÓS ÍNDICES) ==='

-- Testar query de estatísticas
\echo '\nQuery 1: Estatísticas por série (deve usar índice)'
EXPLAIN ANALYZE
SELECT filtro_serie, COUNT(ra) as count
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO'
GROUP BY filtro_serie;

\echo '\nQuery 2: Count em consulta_matricula (deve usar índice)'
EXPLAIN ANALYZE
SELECT COUNT(*)
FROM consulta_matricula
WHERE filtro_serie IN ('BERÇARIO 1', 'BERÇARIO 2');

\echo '\n╔═══════════════════════════════════════════════════════════════════╗'
\echo '║  OTIMIZAÇÃO CONCLUÍDA COM SUCESSO!                               ║'
\echo '╚═══════════════════════════════════════════════════════════════════╝\n'

\echo 'Próximos passos:'
\echo '  1. Executar benchmark da API para medir ganhos'
\echo '  2. Comparar com performance anterior'
\echo '  3. Ajustar índices conforme necessário'
\echo ''
