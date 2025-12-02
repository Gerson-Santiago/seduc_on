# Avaliação de Cache com Redis - SEDUC ON

**Status:** 🔬 Análise Opcional  
**Data:** _A ser preenchido_

---

## 📋 Objetivo

Avaliar se a implementação de cache Redis traria benefícios significativos de performance para o sistema SEDUC ON, considerando o volume atual de usuários e a frequência de atualização dos dados.

---

## 1. Contexto

### Características do Sistema

- **Frequência de Atualização:** Dados de alunos/escolas atualizados via CSV periodicamente
- **Volume de Usuários:** _A definir com o usuário_
- **Padrão de Acesso:** _A avaliar_ (leitura pesada? atualizações frequentes?)

### Questão Central

> **Vale a pena adicionar Redis para um sistema que pode ter dados razoavelmente estáticos e volume moderado de acessos?**

---

## 2. Candidatos para Cache

### 2.1 Rotas que Mais se Beneficiariam

| Rota | Motivo | TTL Sugerido |
|------|--------|--------------|
| `GET /api/alunos/stats` | Agregações complexas, dados mudam apenas com importação CSV | 1-4 horas |
| `GET /api/escolas/stats` | 12 queries COUNT, dados estáveis | 1-4 horas |
| `GET /api/escolas` | Lista de escolas raramente muda | 8-24 horas |
| `GET /api/matriculas` | Dados de turmas, atualização periódica | 1-4 horas |

### 2.2 Rotas que NÃO Devem Ser Cacheadas

- `GET /api/alunos` (paginado com filtros dinâmicos)
- `POST/PUT/DELETE` de qualquer entidade (escrita)

---

## 3. Teste de Performance com Redis

### 3.1 Configuração do Teste

**Ambiente:**
- Redis: `redis:alpine` (Docker)
- Node.js com `ioredis`

**Implementação:**
```javascript
import Redis from 'ioredis';
const redis = new Redis();

async function getCachedStats(req, res) {
  const cacheKey = 'stats:alunos';
  
  // Tentar buscar do cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // Se não tem no cache, buscar do banco
  const stats = await AlunoService.getStats(req.prisma);
  
  // Armazenar no cache por 2 horas
  await redis.setex(cacheKey, 7200, JSON.stringify(stats));
  
  return res.json(stats);
}
```

### 3.2 Resultados do Teste

**GET /api/alunos/stats**

| Cenário | Tempo Médio (ms) | P95 (ms) | P99 (ms) | Ganho |
|---------|------------------|----------|----------|-------|
| Sem cache (DB direto) | _TBD_ | _TBD_ | _TBD_ | - |
| Com cache (Redis hit) | _TBD_ | _TBD_ | _TBD_ | _X%_ |
| Com cache (Redis miss) | _TBD_ | _TBD_ | _TBD_ | _X%_ |

**GET /api/escolas/stats**

| Cenário | Tempo Médio (ms) | P95 (ms) | P99 (ms) | Ganho |
|---------|------------------|----------|----------|-------|
| Sem cache (12 queries) | _TBD_ | _TBD_ | _TBD_ | - |
| Com cache (Redis hit) | _TBD_ | _TBD_ | _TBD_ | _X%_ |

---

## 4. Análise Custo vs Benefício

### 4.1 Benefícios Esperados

✅ **Se ganho for significativo:**
- Redução de 70-90% no tempo de resposta (cache hit)
- Menor carga no PostgreSQL
- Melhor experiência do usuário em dashboards

### 4.2 Custos e Complexidade

❌ **Pontos contra:**
- **Infraestrutura adicional:** Redis server para manter
- **Complexidade de invalidação:** Quando atualizar CSV, precisa limpar cache
- **Manutenção:** Mais um serviço na stack
- **Equipe pequena:** 2 desenvolvedores, mais complexidade pode ser overkill

### 4.3 Alternativas ao Redis

**Opção 1: Cache em memória (Node.js)**
```javascript
// Simples, sem dependência externa
const cache = new Map();
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 horas

function getCached(key, fetchFn) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetchFn();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

**Prós:**
- Sem infraestrutura adicional
- Simples de implementar

**Contras:**
- Cache perdido ao reiniciar servidor
- Não compartilhado entre instâncias (se houver load balancer)

**Opção 2: Materialized Views (PostgreSQL)**
```sql
CREATE MATERIALIZED VIEW mv_estatisticas_alunos AS
SELECT filtro_serie, COUNT(*) as total
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO'
GROUP BY filtro_serie;

-- Refresh após importação CSV
REFRESH MATERIALIZED VIEW mv_estatisticas_alunos;
```

**Prós:**
- Usa tecnologia já existente (PostgreSQL)
- Consistente com banco de dados

**Contras:**
- Refresh manual necessário
- Menos flexível que cache programático

---

## 5. Estratégia de Invalidação

### Quando Limpar o Cache?

1. **Após importação de CSV:**
   ```javascript
   async function importarCSV() {
     // ... processar CSV
     
     // Limpar cache
     await redis.del('stats:alunos', 'stats:escolas', 'list:escolas');
   }
   ```

2. **Após alterações manuais:**
   - Criar/editar/deletar aluno → invalidar `stats:alunos`
   - Editar escola → invalidar `list:escolas`

### TTL Recomendados

- **Estatísticas:** 2-4 horas (dados mudam pouco)
- **Lista de escolas:** 8-24 horas (dados muito estáveis)
- **Dados de matrícula:** 1-2 horas

---

## 6. Decisão e Recomendação

### Critérios de Decisão

**Implementar Redis se:**
- [ ] P95 de `/api/alunos/stats` > 300ms
- [ ] P95 de `/api/escolas/stats` > 500ms
- [ ] Volume de acessos > 100 req/min
- [ ] Múltiplos usuários acessando dashboards simultaneamente

**NÃO implementar Redis se:**
- [ ] Performance atual é aceitável (< 300ms)
- [ ] Volume de acessos é baixo
- [ ] Otimizações de SQL/índices resolvem o problema

### Recomendação Final

> [!NOTE]
> **Recomendação:** _A preencher após testes_
>
> **Justificativa:**
> - _Baseado nos resultados de performance_
> - _Considerando simplicidade vs ganho_
> - _Adequado para equipe de 2 desenvolvedores_

### Alternativa Recomendada

Se Redis não for necessário:
1. **Otimizar queries SQL** com índices adequados
2. **Implementar cache em memória** para casos críticos
3. **Refatorar código** para reduzir queries (ex: escola.controller.js)

---

## 7. Plano de Implementação (Se Aprovado)

### Fase 1: Setup
- [ ] Adicionar Redis ao docker-compose (ou instalação local)
- [ ] Instalar `ioredis` no backend
- [ ] Criar módulo de cache genérico

### Fase 2: Implementação
- [ ] Cachear `/api/alunos/stats`
- [ ] Cachear `/api/escolas/stats`
- [ ] Implementar invalidação após importação CSV

### Fase 3: Validação
- [ ] Re-executar benchmarks
- [ ] Validar ganho real de performance
- [ ] Ajustar TTLs conforme necessário

---

## 8. Referências

- [Redis Documentation](https://redis.io/docs/)
- [ioredis - Node.js Redis Client](https://github.com/luin/ioredis)
- [PostgreSQL Materialized Views](https://www.postgresql.org/docs/current/rules-materializedviews.html)
