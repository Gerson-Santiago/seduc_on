# Análise de Consultas SQL

> Diagnóstico de performance, análise de queries e otimização de banco de dados.

## Índice
- [1. Diagnóstico](#1-diagnóstico)
- [2. Queries Críticas](#2-queries-críticas)
- [3. Estratégia de Índices](#3-estratégia-de-índices)
- [4. Recomendações](#4-recomendações)

---

## 1. Diagnóstico

O PostgreSQL é o motor principal do sistema. A performance é garantida por uma modelagem correta e uso estratégico de índices.

**Tabelas Principais:**
*   `alunos_regular_ei_ef9`: Tabela principal de alunos (~10k registros).
*   `consulta_matricula`: Tabela de turmas/vagas.
*   `dados_das_escolas`: Cadastro de escolas.

---

## 2. Queries Críticas

### `getStats()` (Escolas)
**Situação Anterior:** Executava 12 queries sequenciais (`COUNT`), gerando 1.7s de latência.
**Solução:** Refatorado para 1 query única usando `GROUP BY` + `CASE`.
**Tempo Atual:** ~17ms.

### Listagem de Alunos
**Query:** Filtros por nome (`ILIKE`) e paginação.
**Gargalo:** O uso de `%termo%` no início da string impede uso de índice B-tree padrão.
**Mitigação:** Uso de filtros exatos onde possível ou Full Text Search (futuro).

---

## 3. Estratégia de Índices

Índices criados para suportar as queries mais frequentes:

| Índice | Tabela | Colunas | Propósito |
| :--- | :--- | :--- | :--- |
| `idx_alunos_regular_situacao_serie` | `alunos_regular` | `situacao`, `filtro_serie` | Estatísticas rápidas |
| `idx_matricula_filtro_serie` | `matricula` | `filtro_serie` | Index Only Scan em counts |
| `idx_alunos_regular_cod_escola` | `alunos_regular` | `cod_escola` | JOINs com escola |

> **Nota:** O overhead de armazenamento é de ~10% do tamanho total do banco, considerado aceitável.

---

## 4. Recomendações

1.  **Manter índices atualizados:** Revisar uso de índices periodicamente (`pg_stat_user_indexes`).
2.  **Evitar N+1:** Sempre usar `prisma.findMany({ include: ... })` ou aggregations ao invés de loops no código.
3.  **Materialized Views:** Considerar para relatórios pesados se o volume de dados crescer muito.
