# Análise de Consultas SQL e Performance - PostgreSQL

**Sistema:** SEDUC ON  
**Data da Análise:** _A ser preenchido após execução_  
**Analista:** Antigravity AI

---

## 📋 Objetivo

Identificar consultas SQL críticas, analisar seus planos de execução, verificar índices existentes e propor otimizações mantendo a arquitetura atual.

---

## 1. Inventário de Tabelas e Dados

### 1.1 Tabelas Principais

| Tabela | Função | Registros Estimados |
|--------|--------|---------------------|
| `alunos_integracao_all` | Staging de integração CSV | _A preencher_ |
| `alunos_regular_ei_ef9` | Alunos regulares (EI + EF9) | _A preencher_ |
| `alunos_aee` | Alunos AEE (educação especial) | _A preencher_ |
| `alunos_eja` | Alunos EJA (educação de jovens e adultos) | _A preencher_ |
| `dados_das_escolas` | Cadastro de escolas | _A preencher_ |
| `consulta_matricula` | Dados de matrícula/turmas | _A preencher_ |

### 1.2 Tamanho das Tabelas

```
_Output de pg_total_relation_size a ser inserido aqui_
```

---

## 2. Índices Existentes

### 2.1 alunos_regular_ei_ef9

**Índices encontrados:**
```sql
_Output de pg_indexes a ser inserido aqui_
```

**Análise:**
- ✅ Possui índice UNIQUE em `ra` (chave primária)
- ⚠️ Campos sem índice usados em filtros: `situacao`, `filtro_serie`, `nome_aluno`, `cod_escola`

### 2.2 alunos_integracao_all

**Índices encontrados:**
```sql
_A preencher_
```

### 2.3 consulta_matricula

**Índices encontrados:**
```sql
_A preencher_
```

### 2.4 dados_das_escolas

**Índices encontrados:**
```sql
_A preencher_
```

---

## 3. Análise de Queries Críticas

### 3.1 Query: `getStats()` - Agregação Global por Série

**Localização:** `backend/src/services/aluno.service.js:5-10`

**SQL Gerado pelo Prisma:**
```sql
SELECT filtro_serie, COUNT(ra) as count
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO'
GROUP BY filtro_serie;
```

**EXPLAIN ANALYZE:**
```
_Output do EXPLAIN ANALYZE a ser inserido_
```

**Métricas:**
- Tempo de execução: _X ms_
- Linhas escaneadas: _N_
- Método de acesso: _Seq Scan / Index Scan_

**Avaliação:**
- [ ] ✅ Performance aceitável (< 100ms)
- [ ] ⚡ Performance OK (100-300ms)
- [ ] ⚠️ Performance ruim (300-500ms)
- [ ] ❌ Performance crítica (> 500ms)

**Sugestões de Otimização:**
1. _A preencher após análise_

---

### 3.2 Query: `getStats()` - Agregação por Escola, Tipo e Série

**Localização:** `backend/src/services/aluno.service.js:47-53`

**SQL Gerado:**
```sql
SELECT nome_escola, tipo_de_ensino, filtro_serie, COUNT(ra) as count
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO'
GROUP BY nome_escola, tipo_de_ensino, filtro_serie
ORDER BY nome_escola ASC;
```

**EXPLAIN ANALYZE:**
```
_A preencher_
```

**Avaliação:**
- Esta query pode ser pesada com muitas escolas
- Potencial para materialização em view ou cache

**Sugestões de Otimização:**
1. _A preencher_

---

### 3.3 Query: `findAllAlunos()` - Listagem Paginada

**Localização:** `backend/src/services/aluno.service.js:88-110`

**SQL com Filtros:**
```sql
SELECT *
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO'
  AND nome_aluno ILIKE '%Silva%'
ORDER BY nome_aluno ASC
LIMIT 50 OFFSET 0;
```

**EXPLAIN ANALYZE:**
```
_A preencher_
```

**Problemas Potenciais:**
- `ILIKE` com `%` no início não pode usar índice
- Ordenação pode ser custosa sem índice

**Sugestões:**
- Índice em `(situacao, nome_aluno)` para acelerar ordenação
- Considerar full-text search se buscas complexas forem necessárias

---

### 3.4 Query: `getStats()` Escola - Múltiplos Counts

**Localização:** `backend/src/controllers/escola.controller.js:13-35`

**SQL Executado (exemplo):**
```sql
SELECT COUNT(*)
FROM consulta_matricula
WHERE filtro_serie IN ('BERÇARIO 1', 'BERÇARIO 2');
-- Repetido para cada grupo de séries
```

**Problema:**
- **12 queries separadas** sendo executadas para montar estatísticas
- Ineficiente, seria melhor uma única query com GROUP BY

**Sugestão de Refatoração:**
```sql
SELECT 
  CASE 
    WHEN filtro_serie IN ('BERÇARIO 1', 'BERÇARIO 2') THEN 'bercario'
    WHEN filtro_serie IN ('MATERNAL 1', 'MATERNAL 2') THEN 'maternal'
    -- ... outros casos
  END as categoria,
  COUNT(*) as total
FROM consulta_matricula
GROUP BY categoria;
```

---

## 4. Campos Usados em Operações de Filtro/Ordenação

### Campos em WHERE

| Campo | Tabela | Operação | Índice Existente? |
|-------|--------|----------|-------------------|
| `situacao` | `alunos_regular_ei_ef9` | `= 'ATIVO'` | ❌ Não |
| `filtro_serie` | `alunos_regular_ei_ef9` | `=` e `IN` | ❌ Não |
| `filtro_serie` | `consulta_matricula` | `IN (...)` | ❌ Não |
| `nome_aluno` | `alunos_regular_ei_ef9` | `ILIKE '%..%'` | ❌ Não |
| `nome_escola` | `alunos_regular_ei_ef9` | `ILIKE '%..%'` | ❌ Não |
| `ra` | `alunos_regular_ei_ef9` | `= '...'` | ✅ Sim (UNIQUE) |
| `cod_escola` | `alunos_regular_ei_ef9` | `= '...'` (JOIN) | ❌ Não |

### Campos em GROUP BY

- `filtro_serie`
- `nome_escola`
- `tipo_de_ensino`

### Campos em ORDER BY

- `nome_aluno`
- `nome_escola`

---

## 5. Recomendações de Índices

### 5.1 Prioridade ALTA ⚡

Índices que devem ser criados imediatamente:

```sql
-- 1. Índice composto para filtro mais comum (situacao + série)
CREATE INDEX idx_alunos_regular_situacao_serie 
ON alunos_regular_ei_ef9(situacao, filtro_serie);

-- 2. Índice para filtro em consulta_matricula
CREATE INDEX idx_matricula_filtro_serie 
ON consulta_matricula(filtro_serie);

-- 3. Índice para JOINs
CREATE INDEX idx_alunos_regular_cod_escola 
ON alunos_regular_ei_ef9(cod_escola);
```

### 5.2 Prioridade MÉDIA ⚡

Índices úteis mas não críticos:

```sql
-- 4. Para ordenação por nome
CREATE INDEX idx_alunos_regular_nome 
ON alunos_regular_ei_ef9(nome_aluno);

-- 5. Para buscas em outras tabelas de alunos
CREATE INDEX idx_alunos_aee_situacao 
ON alunos_aee(situacao);

CREATE INDEX idx_alunos_eja_situacao 
ON alunos_eja(situacao);

-- 6. Para tabela de integração
CREATE INDEX idx_integracao_situacao 
ON alunos_integracao_all(situacao);
```

### 5.3 Índices Condicionais (Opcional)

Índices parciais para casos específicos:

```sql
-- Apenas alunos ativos (reduz tamanho do índice)
CREATE INDEX idx_alunos_regular_ativos 
ON alunos_regular_ei_ef9(filtro_serie) 
WHERE situacao = 'ATIVO';
```

---

## 6. Outras Otimizações SQL

### 6.1 Refatorar getStats() de Escola

**Atual:** 12 queries separadas  
**Proposta:** 1 query com GROUP BY + CASE

Ganho estimado: 80% redução de tempo

### 6.2 Considerar Materialized Views

Para estatísticas que mudam raramente:

```sql
CREATE MATERIALIZED VIEW mv_estatisticas_alunos AS
SELECT 
  filtro_serie,
  nome_escola,
  tipo_de_ensino,
  COUNT(*) as total
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO'
GROUP BY filtro_serie, nome_escola, tipo_de_ensino;

-- Refresh periódico (ex: de hora em hora)
REFRESH MATERIALIZED VIEW mv_estatisticas_alunos;
```

---

## 7. Análise do Prisma ORM

### 7.1 Queries Geradas

✅ **Bom:** Prisma gera SQL limpo e eficiente  
⚠️ **Atenção:** `groupBy` pode gerar queries pesadas sem índices

### 7.2 Limitações Identificadas

- Múltiplas queries para estatísticas (N+1 em `escola.controller.js`)
- Sem suporte nativo a query raw em alguns casos

### 7.3 Sugestões

Usar `$queryRaw` para queries complexas que o ORM não otimiza bem.

---

## 8. Conclusão e Próximos Passos

### ✅ O que funciona bem

- Estrutura de tabelas normalizada
- Uso correto de constraints (UNIQUE em RA)
- Prisma gerando SQL correto

### ⚠️ Problemas Identificados

1. **Falta de índices** em campos filtrados com frequência
2. **Queries múltiplas** onde uma seria suficiente
3. **Agregações sem índices** causando table scans

### 🎯 Ações Recomendadas

**Imediatas (mantendo arquitetura atual):**
1. Criar índices prioritários (seção 5.1)
2. Refatorar `getStats()` de escola para query única
3. Testar ganho de performance

**Médio prazo:**
4. Adicionar índices secundários
5. Considerar cache para estatísticas

**Não recomendado no momento:**
- ❌ Migração de banco de dados
- ❌ Mudança de ORM
- ❌ Separação de backend

---

## 📊 Anexos

### Script de Execução

Para reproduzir esta análise:

```bash
cd /home/sant/seduc_on
psql -U <user> -d <database> -f backend/docs/performance/scripts/test-queries.sql > query-analysis-output.txt
```

### Referências

- [Documentação Prisma - Performance](https://www.prisma.io/docs/guides/performance-and-optimization)
- [PostgreSQL - Indexes](https://www.postgresql.org/docs/current/indexes.html)
