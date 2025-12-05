# Avaliação de Redis Cache

> Análise técnica sobre a necessidade de implementação de cache Redis.

## Índice
- [1. Decisão e Recomendação](#1-decisão-e-recomendação)
- [2. Análise Custo-Benefício](#2-análise-custo-benefício)
- [3. Cenários de Uso](#3-cenários-de-uso)
- [4. Anexo: Metodologia de Teste](#4-anexo-metodologia-de-teste)

---

## 1. Decisão e Recomendação

**Veredito:** ❌ **NÃO IMPLEMENTAR REDIS NO MOMENTO**

### Justificativa
1.  **Performance Atual Excelente:** endpoints críticos respondem em **17ms-36ms** (pós-otimização Fase 0).
2.  **PostgreSQL Cache Eficiente:** O banco já mantém dados quentes em memória.
3.  **Complexidade Desnecessária:** Adicionar Redis aumentaria a carga de manutenção e infraestrutura sem ganho perceptível para o usuário final.

---

## 2. Análise Custo-Benefício

### Custos
*   **Tempo:** ~30h de desenvolvimento e testes.
*   **Infra:** Custo de memória e monitoramento adicional.
*   **Manutenção:** Gerenciamento de invalidação de cache (complexidade alta).

### Benefícios Potenciais
*   Ganho de ~10ms em requisições que já levam 30ms.
*   **Conclusão:** ROI Negativo.

---

## 3. Cenários de Uso

O Redis deve ser reconsiderado **APENAS SE**:
1.  Latência subir consistentemente para **> 200ms**.
2.  Número de usuários simultâneos crescer 10x (> 3000).
3.  Novos requisitos de Analytics em Tempo Real surgirem.

### Alternativas Recomendadas (Imediatas)
*   **Cache HTTP:** `Cache-Control: public, max-age=60` (Simples e eficaz).
*   **In-Memory Cache:** `Map()` do Javascript para dados pequenos e estáticos.

---

## 4. Anexo: Metodologia de Teste

> _Caso a decisão mude no futuro, utilize este plano para validar a implementação._

### Rotas Candidatas
| Rota | Motivo | TTL Sugerido |
| :--- | :--- | :--- |
| `GET /api/alunos/stats` | Agregação pesada | 1h |
| `GET /api/escolas/stats` | Múltiplos COUNTs | 1h |

### Configuração de Teste
Usar `ioredis` e comparar latência P95 com e sem cache sob carga (50 req/s).
