# Relatório de Performance (Histórico)

> Registro consolidado das medições de performance, benchmarks e ganhos obtidos com otimizações.

## Índice
- [1. Resumo dos Ganhos](#1-resumo-dos-ganhos)
- [2. Baseline (O Problema)](#2-baseline-o-problema)
- [3. Fase 0: Otimizações Realizadas](#3-fase-0-otimizações-realizadas)
- [4. Comparativo Detalhado](#4-comparativo-detalhado)

---

## 1. Resumo dos Ganhos

A **Fase 0** de otimização focou em resolver gargalos críticos de leitura na API, identificados em Dezembro/2025.

| Endpoint | Baseline (Cold Start) | Após Otimização | Melhoria |
| :--- | :--- | :--- | :--- |
| `GET /api/escolas/stats` | **1740ms** (1.7s) | **17-27ms** | 🚀 **98%** |
| `GET /api/alunos/stats` | 36ms | 36ms | Estável |

**Conclusão:** O sistema passou de "inaceitável para picos de uso" para "altamente performático".

---

## 2. Baseline (O Problema)

**Data:** 01/12/2025  
**Cenário:** 10.000 alunos, 452 matrículas. PostgreSQL sem índices específicos.

### Diagnóstico Inicial
O endpoint `/api/escolas/stats` realizava **12 queries sequenciais** (loop N+1), cada uma fazendo um table scan completo na tabela `consulta_matricula`.

*   **Impacto:** O primeiro request após restart (cold start) levava **1.7 segundos**.
*   **Risco:** Com 300 usuários simultâneos, o banco travaria por exaustão de conexões.

---

## 3. Fase 0: Otimizações Realizadas

Para resolver o baseline crítico, foram aplicadas duas estratégias:

### A. Criação de Índices (Banco de Dados)
Foram criados 11 índices estratégicos, totalizando ~920KB de overhead (desprezível).

**Principais Índices:**
*   `idx_matricula_filtro_serie`: Permitiu **Index Only Scan**, reduzindo a leitura de disco a zero para contagens.
*   `idx_alunos_regular_cod_escola`: Otimizou filtros por escola.

### B. Refatoração de Código (Backend)
O arquivo `escola.controller.js` foi reescrito.
*   **Antes:** 12 queries `await prisma.count(...)`.
*   **Depois:** 1 query SQL bruta (`GROUP BY` + `CASE`) executada via Prisma.

---

## 4. Comparativo Detalhado

### GET /api/escolas/stats

| Cenário | Tempo (ms) | Causa Raiz |
| :--- | :--- | :--- |
| **Baseline (Cold)** | 1740ms | Table Scan × 12 |
| **Baseline (Cached)** | 152ms | Cache de SO ajudava, mas query era ruim |
| **Pós-Índices** | ~800ms (Cold) | Index Scan × 12 (Melhor, ainda N+1) |
| **Pós-Refatoração** | **17ms** | Single Query + Index Only Scan |

### GET /api/alunos/stats

| Cenário | Tempo (ms) | Observação |
| :--- | :--- | :--- |
| **Baseline** | 36ms | Já era eficiente (poucas queries) |
| **Pós-Fase 0** | 36ms | Performance mantida |

### Overhead de Índices

| Tabela | Espaço Adicional | Status |
| :--- | :--- | :--- |
| `alunos_regular_ei_ef9` | +608 KB | Aceitável |
| `consulta_matricula` | +40 KB | Aceitável |
| **Total** | **+0.9 MB** | ✅ Aprovado |

---

> _Dados coletados em ambiente de desenvolvimento local simulando carga de produção._
