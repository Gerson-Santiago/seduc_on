# Plano de Migração Gradual - SEDUC ON Database

**Estratégia:** Redesign progressivo SEM quebrar importação de CSVs  
**Data:** 01/12/2025  
**Princípio:** Adicionar tabelas novas, migrar gradualmente, manter compatibilidade

---

## 🎯 ESTRATÉGIA: Coexistência de Estruturas

### Conceito

```
CSV Import (mantém como está)
    ↓
alunos_integracao_all (staging - SEM MUDANÇAS)
    ↓
alunos_regular_ei_ef9 (mantém - compatibilidade)
    ↓
[NOVO] Processo de sincronização
    ↓
[NOVAS] Tabelas normalizadas (turmas, alunos_normalized, etc)
```

**Benefícios:**
- ✅ CSV imports continuam funcionando
- ✅ API atual continua funcionando
- ✅ Novas queries usam estrutura otimizada
- ✅ Pode reverter a qualquer momento
- ✅ Testa progressivamente

---

## 📋 FASES DA MIGRAÇÃO

### FASE 0: Preparação (AGORA - 1 dia)
**Objetivo:** Melhorias rápidas sem mudanças estruturais

- [ ] Criar índices nas tabelas existentes
- [ ] Refatorar `escola.controller.js` (12 queries → 1)
- [ ] Medir ganhos de performance
- [ ] Commitar melhorias

**Resultado esperado:** De 1.7s para ~50-100ms

**Sem risco:** ✅ Zero mudanças estruturais

---

### FASE 1: Criar Tabelas Normalizadas (Semana 1)
**Objetivo:** Adicionar novas tabelas SEM tocar nas antigas

#### 1.1 Criar Tabela de Turmas

```sql
CREATE TABLE turmas_normalized (
  id SERIAL PRIMARY KEY,
  cod_turma VARCHAR(20) UNIQUE NOT NULL,
  cod_escola VARCHAR(20) NOT NULL,
  nome_turma VARCHAR(100),
  filtro_serie VARCHAR(50),
  periodo VARCHAR(20),
  ano_letivo INT DEFAULT 2025,
  capacidade INT,
  
  -- FK real para escola
  CONSTRAINT fk_turma_escola 
    FOREIGN KEY (cod_escola) 
    REFERENCES dados_das_escolas(cod_escola)
    ON DELETE RESTRICT
);

CREATE INDEX idx_turmas_normalized_escola ON turmas_normalized(cod_escola);
CREATE INDEX idx_turmas_normalized_serie ON turmas_normalized(filtro_serie);
CREATE INDEX idx_turmas_normalized_ano ON turmas_normalized(ano_letivo);
```

#### 1.2 Popular Turmas a partir de dados existentes

```sql
-- Extrair turmas únicas de alunos_regular_ei_ef9
INSERT INTO turmas_normalized (cod_turma, cod_escola, filtro_serie, periodo, ano_letivo)
SELECT DISTINCT 
  cod_turma,
  cod_escola,
  filtro_serie,
  periodo,
  2025
FROM alunos_regular_ei_ef9
WHERE cod_turma IS NOT NULL
ON CONFLICT (cod_turma) DO NOTHING;

-- Mesma coisa para alunos_aee e alunos_eja
```

#### 1.3 Criar View Unificada

```sql
-- View que combina dados antigos + novos
CREATE VIEW v_alunos_completo AS
SELECT 
  a.*,
  e.nome_escola,
  e.inep,
  t.filtro_serie as serie_oficial,
  t.periodo as periodo_oficial
FROM alunos_regular_ei_ef9 a
LEFT JOIN dados_das_escolas e ON a.cod_escola = e.cod_escola
LEFT JOIN turmas_normalized t ON a.cod_turma = t.cod_turma;
```

**Resultado:** Tabelas novas coexistem com antigas

---

### FASE 2: Criar Tabela de Alunos Normalizada (Semana 2)
**Objetivo:** Tabela de alunos sem dados duplicados

```sql
CREATE TABLE alunos_normalized (
  id SERIAL PRIMARY KEY,
  ra VARCHAR(20) UNIQUE NOT NULL,
  nome_aluno VARCHAR(255) NOT NULL,
  data_nasci DATE,
  genero CHAR(1),
  situacao VARCHAR(10) NOT NULL,
  
  -- FKs para entidades
  cod_escola VARCHAR(20) NOT NULL,
  cod_turma VARCHAR(20),
  
  -- Dados específicos do aluno (SEM duplicar escola/turma)
  n_chamada INT,
  deficiencia TEXT,
  endereco TEXT,
  telefone VARCHAR(20),
  email_aluno VARCHAR(255),
  nome_responsavel VARCHAR(255),
  
  -- Metadados
  tipo_ensino VARCHAR(50),  -- 'REGULAR', 'AEE', 'EJA'
  data_matricula DATE,
  data_ultima_atualizacao TIMESTAMP DEFAULT NOW(),
  
  -- FKs
  CONSTRAINT fk_aluno_escola 
    FOREIGN KEY (cod_escola) 
    REFERENCES dados_das_escolas(cod_escola),
  CONSTRAINT fk_aluno_turma 
    FOREIGN KEY (cod_turma) 
    REFERENCES turmas_normalized(cod_turma)
);

CREATE INDEX idx_alunos_normalized_escola ON alunos_normalized(cod_escola);
CREATE INDEX idx_alunos_normalized_turma ON alunos_normalized(cod_turma);
CREATE INDEX idx_alunos_normalized_situacao ON alunos_normalized(situacao);
CREATE INDEX idx_alunos_normalized_tipo ON alunos_normalized(tipo_ensino);
```

#### Popular a partir de tabelas antigas

```sql
-- Migrar alunos regulares
INSERT INTO alunos_normalized (
  ra, nome_aluno, data_nasci, genero, situacao,
  cod_escola, cod_turma, tipo_ensino
)
SELECT DISTINCT ON (ra)
  ra, nome_aluno, data_nasci, genero, situacao,
  cod_escola, cod_turma, 'REGULAR'
FROM alunos_regular_ei_ef9
WHERE situacao = 'ATIVO';

-- Migrar alunos AEE
INSERT INTO alunos_normalized (...)
SELECT ... FROM alunos_aee WHERE situacao = 'ATIVO'
ON CONFLICT (ra) DO UPDATE SET tipo_ensino = 'AEE';

-- Migrar alunos EJA
INSERT INTO alunos_normalized (...)
SELECT ... FROM alunos_eja WHERE situacao = 'ATIVO'
ON CONFLICT (ra) DO UPDATE SET tipo_ensino = 'EJA';
```

---

### FASE 3: Criar Triggers de Sincronização (Semana 3)
**Objetivo:** Manter tabelas antigas e novas sincronizadas

```sql
-- Trigger: quando inserir em alunos_regular_ei_ef9, atualiza alunos_normalized
CREATE OR REPLACE FUNCTION sync_aluno_to_normalized()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO alunos_normalized (
    ra, nome_aluno, cod_escola, cod_turma, situacao, tipo_ensino
  ) VALUES (
    NEW.ra, NEW.nome_aluno, NEW.cod_escola, NEW.cod_turma, NEW.situacao, 'REGULAR'
  )
  ON CONFLICT (ra) DO UPDATE SET
    nome_aluno = EXCLUDED.nome_aluno,
    cod_escola = EXCLUDED.cod_escola,
    cod_turma = EXCLUDED.cod_turma,
    situacao = EXCLUDED.situacao,
    data_ultima_atualizacao = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_aluno_regular
AFTER INSERT OR UPDATE ON alunos_regular_ei_ef9
FOR EACH ROW EXECUTE FUNCTION sync_aluno_to_normalized();
```

**Resultado:** Importação CSV funciona normalmente, mas dados propagam para tabelas normalizadas

---

### FASE 4: Migrar API Progressivamente (Semana 4-6)
**Objetivo:** Novas queries usam tabelas otimizadas

#### Criar novos services (paralelos aos antigos)

```javascript
// backend/src/services/aluno-normalized.service.js
export async function getStatsOptimized(prisma) {
  // Usa tabelas normalizadas
  const stats = await prisma.$queryRaw`
    SELECT 
      t.filtro_serie,
      COUNT(DISTINCT a.ra) as total
    FROM alunos_normalized a
    JOIN turmas_normalized t ON a.cod_turma = t.cod_turma
    WHERE a.situacao = 'ATIVO'
    GROUP BY t.filtro_serie
  `;
  
  return processStats(stats);
}
```

#### Adicionar flag de feature

```javascript
// backend/src/config/features.js
export const FEATURES = {
  USE_NORMALIZED_TABLES: process.env.USE_NORMALIZED === 'true'
};

// backend/src/controllers/aluno.controller.js
export async function getEstatisticas(req, res) {
  if (FEATURES.USE_NORMALIZED_TABLES) {
    const stats = await AlunoNormalizedService.getStatsOptimized(req.prisma);
    return res.json(stats);
  }
  
  // Fallback para código antigo
  const stats = await AlunoService.getStats(req.prisma);
  res.json(stats);
}
```

**Resultado:** Pode testar tabelas novas com flag, reverter instantaneamente se houver problema

---

### FASE 5: Desativar Tabelas Antigas (Mês 2-3)
**Objetivo:** Após validação completa, desativar estrutura antiga

Apenas quando:
- ✅ Todas queries funcionando com tabelas novas
- ✅ Performance validada
- ✅ Sem bugs por 2+ semanas
- ✅ Time confortável com nova estrutura

**Ações:**
1. Renomear tabelas antigas: `alunos_regular_ei_ef9_legacy`
2. Criar views de compatibilidade se necessário
3. Eventualmente dropar após 6 meses

---

## 🔄 PROCESSO DE IMPORTAÇÃO CSV (Mantém Intacto!)

### Atual (não muda)

```
1. CSV → alunos_integracao_all (staging)
2. Script SQL → distribui para alunos_regular_ei_ef9, alunos_aee, alunos_eja
```

### Fase 3+ (com triggers)

```
1. CSV → alunos_integracao_all (staging) ✅ IGUAL
2. Script SQL → distribui para alunos_regular_ei_ef9, alunos_aee, alunos_eja ✅ IGUAL
3. TRIGGER → sincroniza automaticamente para alunos_normalized ✨ NOVO
4. TRIGGER → atualiza turmas_normalized se necessário ✨ NOVO
```

**Zero mudanças** no processo de import!

---

## 📊 COMPARAÇÃO: ANTES vs DURANTE vs DEPOIS

| Aspecto | Atual | Durante Migração | Após Migração |
|---------|-------|------------------|---------------|
| **CSV Import** | ✅ Funciona | ✅ Funciona (igual) | ✅ Funciona |
| **Tabelas Antigas** | ✅ Usadas | ✅ Mantidas + sincronizadas | 🔵 Legado/opcional |
| **Tabelas Novas** | ❌ Não existem | ✅ Populadas via trigger | ✅ Principais |
| **API** | ✅ Funciona | ✅ Flag permite escolher | ✅ Usa novas |
| **Performance** | ⚠️ 1.7s | ⚡ 50-100ms | ⚡ 30-50ms |
| **Integridade** | ⚠️ App-level | ✅ DB-level (FKs) | ✅ DB-level |
| **Risco** | - | 🟢 Baixo (pode reverter) | 🟢 Baixo |

---

## 🎯 DECISÕES PARA FASE 0 (Esta Semana)

**O que fazer AGORA sem risco:**

1. ✅ Criar índices nas tabelas atuais
2. ✅ Refatorar `escola.controller.js`
3. ✅ Medir ganhos
4. ✅ Commitar

**Próxima semana (Fase 1):**
1. Criar `turmas_normalized`
2. Popular com dados existentes
3. Criar views de compatibilidade
4. Testar queries

---

## 💡 VANTAGENS DESTA ABORDAGEM

1. **Zero Risco de Quebrar Imports** ✅
2. **Pode Reverter a Qualquer Momento** ✅
3. **Testa Progressivamente** ✅
4. **Time Aprende Gradualmente** ✅
5. **Produção Não é Afetada** ✅
6. **Melhora Contínua** ✅

---

## ❓ PRÓXIMA DECISÃO

**Você aprova começar com Fase 0?**

- Criar índices (5 min)
- Refatorar controller (30 min)
- Testar (15 min)
- **Total: ~1 hora**

Ganho imediato sem nenhum risco!

---

**Status:** Aguardando aprovação para Fase 0 🚀
