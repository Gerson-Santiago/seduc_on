# ✅ **PLANO DE REFORMA E UNIFICAÇÃO DOS .MD DO PROJETO**

**Objetivo:**
Criar uma documentação enxuta, padronizada, atualizada, totalmente em **Português Brasil**, reduzindo redundâncias e agrupando arquivos relacionados.

---

# 📌 **1. Levantamento e Agrupamento por Tema**

Os documentos atuais foram mapeados para serem agrupados:

### **1.1 Documentação Raiz**
* `README.md`
* `ENV_VAR_ARCHITECTURE_ANALYSIS.md` -> `ENV_VARS.md`
* `INFRA_REQUIREMENTS.md`

### **1.2 Frontend**
* `frontend/README.md`

### **1.3 Backend**
* `backend/README.md`
* `backend/src/controllers/README.md`
* `backend/scripts/debug/README.md`

### **1.4 Docs do Backend – Gerais**
* `backend/docs/README.md`
* `backend/docs/REVISAO-PROJETO.md` \
* `backend/docs/plano-execucao.md`   -> Unificar em `overview.md`
* `backend/docs/resumo-executivo.md` /
* `backend/docs/migration-plan-gradual.md`
* `backend/docs/API.md` -> `api-reference.md`
* `backend/docs/MANUAL_BANCO_DADOS.md` \
* `backend/docs/ANALISE_SCHEMA.md`     -> Unificar em `database.md`

### **1.5 Segurança**
* `backend/docs/security/analise-seguranca-dados.md` -> `security.md`

### **1.6 Performance**
* `backend/docs/performance/avaliacao-redis-cache.md`
* `backend/docs/performance/analise-sql-queries.md`
* `backend/docs/performance/analise-csv-ingestion.md`
* `backend/docs/performance/benchmark-api.md`
* `backend/docs/performance/teste-cache-redis.md`
* Consolidar resultados em `results.md`:
  * `backend/docs/performance/results/baseline-results.md`
  * `backend/docs/performance/results/resultados-performance.md`
  * `backend/docs/performance/results/fase-0-results.md`

### **1.7 Testes**
* `TESTING.md` (root)      \ -> Unificar em `testing.md`
* `backend/docs/TESTING.md` /

### **1.8 Infra**
* `DEBUGGING_GOOGLE_LOGIN.md` -> MOVER para `backend/docs/infra/debugging-google-login.md`
* `csv/README.md`

---

# 📌 **2. Estrutura Final Definida**

```
/
├── README.md                       -> Visão geral do projeto (PT-BR)
├── INFRA_REQUIREMENTS.md           -> Requisitos de Infra
├── ENV_VARS.md                     -> Variáveis de ambiente (renomeado)
├── PLANO_DE_REFORMA.md             -> Este arquivo
│
├── frontend/
│   └── README.md
│
├── backend/
│   ├── README.md
│   ├── controllers.md
│   ├── scripts-debug.md
│   │
│   └── docs/
│       ├── overview.md             -> unificação: resumo-executivo + revisão + plano
│       ├── api-reference.md        -> antes: API.md
│       ├── database.md             -> manual BD + análise schema
│       ├── migration-plan.md
│       ├── security.md
│       │
│       ├── testing.md              -> unificação (root + backend)
│       │
│       ├── performance/
│       │   ├── overview.md
│       │   ├── redis.md
│       │   ├── sql.md
│       │   ├── csv-ingestion.md
│       │   ├── benchmark.md
│       │   ├── results.md          -> unificar todos os results/*
│       │
│       └── infra/
│           └── debugging-google-login.md
│
└── csv/
    └── README.md
```

---

# 📌 **3. Etapas de Execução**

## **ETAPA 1 — Tradução e Conversão**
- Converter todos para PT-BR.
- Ajustar tom para técnico e direto.

## **ETAPA 2 — Unificação e Limpeza**
- [x] Criar `PLANO_DE_REFORMA.md`.
- [ ] Unificar Testes (`testing.md`).
- [ ] Unificar Overview (`overview.md`).
- [ ] Unificar Banco de Dados (`database.md`).
- [ ] Unificar Resultados de Performance (`performance/results.md`).
- [ ] Mover docs de Infra.

## **ETAPA 3 — Padronização Visual**
- Cabeçalhos padronizados.
- Blocos de código `bash` ou `sql` explícitos.
- Índice no início de arquivos grandes.

## **ETAPA 4 — Revisão**
- Garantir que não há links quebrados (dentro do possível).
- Eliminar arquivos deletados/obsoletos.

## **ETAPA 5 — README Principal**
- Atualizar o `README.md` na raiz para apontar para a nova estrutura.
