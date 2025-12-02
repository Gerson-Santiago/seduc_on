# Benchmark de Performance da API - SEDUC ON

**Data:** _A ser preenchido após execução_  
**Ambiente:** Desenvolvimento Local  
**URL Base:** http://localhost:3000

---

## 📋 Objetivo

Medir a performance das principais rotas da API sob diferentes níveis de carga para identificar gargalos e rotas que precisam de otimização.

---

## Metodologia

### Rotas Testadas

1. `GET /api/alunos/stats` - Estatísticas globais
2. `GET /api/alunos?page=1&limit=50` - Listagem paginada
3. `GET /api/alunos?nome=Silva` - Busca por nome
4. `GET /api/escolas/stats` - Estatísticas de turmas
5. `GET /api/escolas` - Listagem de escolas
6. `GET /api/matriculas` - Listagem de matrículas

### Níveis de Concorrência

- **1 req:** Baseline (sem concorrência)
- **10 req:** Carga baixa
- **50 req:** Carga média
- **100 req:** Carga alta

### Métricas Coletadas

- **Média:** Tempo médio de resposta
- **Mediana:** Valor central
- **P95:** 95% das requisições abaixo deste valor
- **P99:** 99% das requisições abaixo deste valor
- **Min/Max:** Valores extremos
- **Throughput:** Requisições por segundo

---

## Resultados

### GET /api/alunos/stats

**Descrição:** Estatísticas globais e por escola (query complexa com GROUP BY)

| Concorrência | Média (ms) | Mediana (ms) | P95 (ms) | P99 (ms) | Throughput (req/s) | Erros |
|--------------|------------|--------------|----------|----------|--------------------|-------|
| 1            | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 10           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 50           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 100          | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |

**Análise:**
- _A preencher após testes_

---

### GET /api/alunos (paginado)

**Descrição:** Listagem de 50 alunos com ordenação

| Concorrência | Média (ms) | Mediana (ms) | P95 (ms) | P99 (ms) | Throughput (req/s) | Erros |
|--------------|------------|--------------|----------|----------|--------------------|-------|
| 1            | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 10           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 50           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 100          | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |

**Análise:**
- _A preencher_

---

### GET /api/alunos?nome=Silva

**Descrição:** Busca case-insensitive (ILIKE)

| Concorrência | Média (ms) | Mediana (ms) | P95 (ms) | P99 (ms) | Throughput (req/s) | Erros |
|--------------|------------|--------------|----------|----------|--------------------|-------|
| 1            | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 10           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 50           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 100          | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |

**Análise:**
- _A preencher_

---

### GET /api/escolas/stats

**Descrição:** Estatísticas de turmas (12 queries COUNT separadas)

| Concorrência | Média (ms) | Mediana (ms) | P95 (ms) | P99 (ms) | Throughput (req/s) | Erros |
|--------------|------------|--------------|----------|----------|--------------------|-------|
| 1            | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 10           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 50           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 100          | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |

**Análise:**
- ⚠️ **ATENÇÃO:** Esta rota executa 12 queries separadas (N+1 problem)
- _A preencher após testes_

---

### GET /api/escolas

**Descrição:** Listagem de todas as escolas

| Concorrência | Média (ms) | Mediana (ms) | P95 (ms) | P99 (ms) | Throughput (req/s) | Erros |
|--------------|------------|--------------|----------|----------|--------------------|-------|
| 1            | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 10           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 50           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 100          | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |

**Análise:**
- _A preencher_

---

### GET /api/matriculas

**Descrição:** Listagem de matrículas

| Concorrência | Média (ms) | Mediana (ms) | P95 (ms) | P99 (ms) | Throughput (req/s) | Erros |
|--------------|------------|--------------|----------|----------|--------------------|-------|
| 1            | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 10           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 50           | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |
| 100          | _TBD_      | _TBD_        | _TBD_    | _TBD_    | _TBD_              | 0     |

**Análise:**
- _A preencher_

---

## Resumo Geral

### Rotas com Performance Aceitável (P95 < 300ms)

_A preencher após testes_

### Rotas com Performance Moderada (P95 300-500ms)

_A preencher após testes_

### Rotas com Performance Crítica (P95 > 500ms)

_A preencher após testes_

---

## Análise do Prisma ORM

### Queries SQL Geradas

_Incluir exemplos de queries geradas pelo Prisma durante os testes_

### Eficiência do ORM

**Pontos Positivos:**
- _A avaliar_

**Pontos de Atenção:**
- _A avaliar_

---

## Recomendações de Otimização

### Prioridade ALTA

1. _A preencher com base nos resultados_

### Prioridade MÉDIA

1. _A preencher_

### Otimizações de Código

**Refatorar getStats() de Escola:**

Reduzir de 12 queries para 1:

```javascript
// Atual: 12 queries separadas
const bercario = await getClassCount(['BERÇARIO 1', 'BERÇARIO 2']);
const maternal = await getClassCount(['MATERNAL 1', 'MATERNAL 2']);
// ... 10 mais

// Proposta: 1 query com GROUP BY
const stats = await req.prisma.$queryRaw`
  SELECT 
    CASE 
      WHEN filtro_serie IN ('BERÇARIO 1', 'BERÇARIO 2') THEN 'bercario'
      WHEN filtro_serie IN ('MATERNAL 1', 'MATERNAL 2') THEN 'maternal'
      -- ... outros
    END as categoria,
    COUNT(*) as total
  FROM consulta_matricula
  GROUP BY categoria
`;
```

**Ganho estimado:** 80% redução de tempo

---

## Próximos Passos

1. Executar o script de benchmark
2. Preencher tabelas com dados reais
3. Implementar otimizações prioritárias
4. Re-testar para validar melhorias

---

## Como Executar o Benchmark

```bash
# Certifique-se de que a API está rodando
cd /home/sant/seduc_on/backend
npm run dev

# Em outro terminal, execute o benchmark
node docs/performance/scripts/benchmark-rotas.js
```
