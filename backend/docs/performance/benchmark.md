# Benchmark de API

> Metodologia e registro de testes de carga da API.

## Índice
- [1. Metodologia](#1-metodologia)
- [2. Cenários de Teste](#2-cenários-de-teste)
- [3. Resultados de Referência](#3-resultados-de-referência)

---

## 1. Metodologia

Utilizamos scripts customizados (`docs/performance/scripts/benchmark-rotas.js`) para simular carga.

**Métricas Coletadas:**
*   **Tempo Médio:** Latência média.
*   **P95:** Percentil 95 (indica a experiência da maioria dos usuários, ignorando outliers extremos).
*   **Throughput:** Requisições por segundo.

---

## 2. Cenários de Teste

### Perfil de Carga
*   **Baixa:** 1 a 10 requisições simultâneas.
*   **Média:** 50 requisições simultâneas (Simula uso normal).
*   **Alta:** 100+ requisições simultâneas (Simula pico de entrega de notas).

### Rotas Críticas
1.  `GET /api/alunos/stats`: Dashboard principal.
2.  `GET /api/escolas/stats`: Dashboard de gestão.
3.  `GET /api/alunos`: Listagem paginada.

---

## 3. Resultados de Referência

> Valores obtidos em ambiente de desenvolvimento (Dez/2025).

| Rota | Concorrência | Média (ms) | P95 (ms) | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/api/escolas/stats` | 50 | 25ms | 45ms | ✅ Excelente |
| `/api/alunos/stats` | 50 | 40ms | 80ms | ✅ Excelente |
| `/api/alunos` | 50 | 60ms | 120ms | ✅ Bom |

**Como executar o benchmark:**
```bash
cd backend
node docs/performance/scripts/benchmark-rotas.js
```
