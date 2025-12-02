# Plano de Otimização e Medição - SEDUC ON

**Data início:** 01/12/2025 21:50  
**Objetivo:** Medir performance atual, aplicar otimizações, medir novamente e documentar ganhos

---

## 📋 Checklist de Execução

### Fase 1: Preparação ✅
- [x] Criar documentação de análise
- [x] Criar scripts de otimização
- [x] Commitar documentação no git

### Fase 2: Baseline (Medição Antes) ✅
- [x] Verificar se API está rodando (porta 3001)
- [x] Executar benchmark de API (baseline)
- [x] Documentar tempo de resposta atual
- [x] Salvar resultados em `baseline-results.md`

**Resultados:**
- `/api/alunos/stats`: ~36ms (excelente!)
- `/api/escolas/stats`: ~65ms (12 queries, mas rápido)

### Fase 3: Backup de Segurança
- [ ] Fazer dump do banco PostgreSQL
- [ ] Verificar integridade do backup

### Fase 4: Otimização - Parte 1 (Índices)
- [ ] Executar `optimize-database.sql`
- [ ] Verificar índices criados
- [ ] Verificar se não há erros

### Fase 5: Medição Após Índices
- [ ] Executar benchmark de API (pós-índices)
- [ ] Executar análise de queries SQL (pós-índices)
- [ ] Documentar tempo de resposta
- [ ] Salvar resultados em `post-indexes-results.md`
- [ ] Calcular % de ganho

### Fase 6: Otimização - Parte 2 (Código)
- [ ] Refatorar `escola.controller.js`
- [ ] Testar endpoint manualmente
- [ ] Verificar se não quebrou nada

### Fase 7: Medição Final
- [ ] Executar benchmark de API (final)
- [ ] Documentar tempo de resposta final
- [ ] Salvar resultados em `final-results.md`

### Fase 8: Comparação e Relatório
- [ ] Comparar 3 medições (baseline → índices → código)
- [ ] Calcular ganhos percentuais
- [ ] Atualizar `relatorio-final.md` com dados reais
- [ ] Commitar resultados

---

## 🎯 Métricas a Coletar

### Endpoints a Medir

| Endpoint | Baseline | Pós-Índices | Pós-Refactor | Ganho Total |
|----------|----------|-------------|--------------|-------------|
| `GET /api/alunos/stats` | ___ ms | ___ ms | ___ ms | ___% |
| `GET /api/escolas/stats` | ___ ms | ___ ms | ___ ms | ___% |
| `GET /api/alunos?page=1&limit=50` | ___ ms | ___ ms | ___ ms | ___% |
| `GET /api/escolas` | ___ ms | ___ ms | ___ ms | ___% |

### Queries SQL a Medir

| Query | Baseline | Pós-Índices | Ganho |
|-------|----------|-------------|-------|
| Stats por série (GROUP BY) | ___ ms | ___ ms | ___% |
| Count em matricula | ___ ms | ___ ms | ___% |
| Listagem paginada | ___ ms | ___ ms | ___% |

---

## 📊 Resultados Esperados

### Ganhos Estimados

**Com índices:**
- Queries de agregação: 60-80% mais rápidas
- Queries de lookup: 70-90% mais rápidas

**Com refatoração de código:**
- `/api/escolas/stats`: 80-90% mais rápido (12 queries → 1)

**Total esperado:**
- Performance geral: 70-85% melhor

---

## 🔧 Comandos a Executar

### 1. Verificar API rodando
```bash
curl http://localhost:3000/api/alunos/stats
# Deve retornar JSON com estatísticas
```

### 2. Benchmark baseline
```bash
cd /home/sant/seduc_on/backend
node docs/performance/scripts/benchmark-rotas.js > docs/performance/results/baseline-results.txt
```

### 3. Análise SQL baseline
```bash
psql -U seduc_user -d seduc_on -f docs/performance/scripts/test-queries.sql > docs/performance/results/baseline-sql.txt
```

### 4. Backup do banco
```bash
pg_dump -U seduc_user seduc_on > ~/backups/seduc_on_backup_$(date +%Y%m%d_%H%M%S).sql
```

### 5. Criar índices
```bash
psql -U seduc_user -d seduc_on -f docs/performance/scripts/optimize-database.sql
```

### 6. Benchmark pós-índices
```bash
node docs/performance/scripts/benchmark-rotas.js > docs/performance/results/post-indexes-results.txt
```

### 7. Refatorar código
- Editar `backend/src/controllers/escola.controller.js`
- Converter 12 queries em 1

### 8. Benchmark final
```bash
node docs/performance/scripts/benchmark-rotas.js > docs/performance/results/final-results.txt
```

---

## ✅ Critérios de Sucesso

- [ ] Nenhuma query > 500ms
- [ ] `/api/alunos/stats` < 200ms
- [ ] `/api/escolas/stats` < 200ms
- [ ] Ganho geral > 50%

---

**Status Atual:** Fase 2 - Preparando medição baseline
