# Troubleshooting & Checklist de Ambiente — SEDUC ON

> **Classificação:** Operacional / Infra Dev
> **Gerado em:** 2026-06-25
> **Ambiente:** Crostini (Debian 12) + PostgreSQL nativo + pnpm + Node.js v24

---

## ⚠️ TL;DR — Execute antes de qualquer coisa

```bash
# 1. Validar CLIENT_ID (backend vs frontend devem ser idênticos)
node scripts/validate_google_env.js

# 2. Validar usuário no banco
cd backend && node scripts/check_user.js

# 3. Verificar portas livres
ss -tlnp | grep -E "3000|3001|5173|4173|5432|5433"

# 4. Subir tudo
./start_seduc_on.sh dev
```

---

## 🗂️ Índice de Problemas (16 encontrados em 2026-06-25)

| # | Problema | Arquivo Afetado | Severidade |
|---|---------|----------------|-----------|
| 1 | PostgreSQL na porta 5433, não 5432 | `.env.dev`, `.env.preview`, `setup_env.sh` | 🔴 CRÍTICO |
| 2 | `VITE_BASE_URL=/` em vez de `/aee/` | `frontend/.env.dev` | 🔴 CRÍTICO |
| 3 | `VITE_GOOGLE_REDIRECT_URI` sem prefixo `/aee/` | `frontend/.env.dev` | 🔴 CRÍTICO |
| 4 | `backend/.env` e `frontend/.env` ausentes | Raiz de cada módulo | 🔴 CRÍTICO |
| 5 | Banco `aee_db` e usuário `aee_user` não criados | PostgreSQL | 🔴 CRÍTICO |
| 6 | Superadmin não seedado no banco | Tabela `usuarios` | 🔴 CRÍTICO |
| 7 | `pnpm dlx prisma` baixa v7, projeto usa v6 | `package.json` | 🟡 ALTO |
| 8 | `environments.js` com path antigo `/seduc_on/` | `src/config/environments.js` | 🟡 ALTO |
| 9 | `VITE_GOOGLE_CLIENT_ID` ausente do `define` do Vite | `vite.config.js` | 🟡 ALTO |
| 10 | Docker de outro projeto ocupando portas | `horelite-app` / `horelite-db` | 🟡 ALTO |
| 11 | `start_seduc_on.sh` com versão PG e gerenciador errados | `start_seduc_on.sh` | 🟠 MÉDIO |
| 12 | `ErrorModal` não importado em `AuthCallback.jsx` | `AuthCallback.jsx` | 🟠 MÉDIO |
| 13 | `window.history.replaceState` ignorando basename | `AuthCallback.jsx` | 🟠 MÉDIO |
| 14 | `scripts/validate_google_env.js` lê `.env` não `.env.dev` | `scripts/validate_google_env.js` | 🟠 MÉDIO |
| 15 | Token JWT Google expira em 1h — não reutilizar URL de callback | Fluxo OAuth | 🟠 MÉDIO |
| 16 | `setup_env.sh` gerava `DATABASE_URL` com porta 5432 | `scripts/setup_env.sh` | 🟠 MÉDIO |

---

## 🔴 Problemas CRÍTICOS

### #1 — PostgreSQL na porta `5433`, não `5432`

**Sintoma:** Backend inicia mas não conecta ao banco. Erro de conexão recusada.

**Diagnóstico:**
```bash
pg_lsclusters
# Ver Cluster Port Status
# 17  main    5433 online  ← porta correta
```

**Regra de ouro:**
```
Modo local (sem Docker) → porta 5433
Modo Docker             → hostname "db", porta 5432 (compose cuida disso)
```

**Correção:**
```ini
# backend/.env.dev e backend/.env.preview
DATABASE_URL="postgresql://aee_user:MinhaSenhaSegura123@localhost:5433/aee_db"
```

---

### #2 — `VITE_BASE_URL=/` causa 404 no callback OAuth

**Sintoma:** Login no Google funciona, mas ao retornar para `/aee/auth/callback` aparece "404 - Página não encontrada".

**Causa:**
```
VITE_BASE_URL=/    → BrowserRouter.basename="/"
React Router vê:   /aee/auth/callback  → não existe → 404

VITE_BASE_URL=/aee/ → BrowserRouter.basename="/aee/"
React Router vê:   /auth/callback      → existe ✅
```

**Correção em `frontend/.env.dev`:**
```ini
VITE_BASE_URL=/aee/
```

---

### #3 — `VITE_GOOGLE_REDIRECT_URI` sem `/aee/`

**Sintoma:** Google retorna `401 invalid_client` antes de mostrar tela de consentimento.

**Correção em `frontend/.env.dev`:**
```ini
# ❌ ERRADO
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# ✅ CORRETO
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/aee/auth/callback
```

**Verificar no Google Cloud Console (APIs & Services → Credentials):**
```
Authorized redirect URIs:
  ✅ http://localhost:5173/aee/auth/callback
  ✅ http://localhost:4173/aee/auth/callback
JavaScript origins:
  ✅ http://localhost:5173
  ✅ http://localhost:4173
```

---

### #4 — `backend/.env` e `frontend/.env` ausentes

**Sintoma:** `node scripts/validate_google_env.js` → `❌ File not found: backend/.env`

**Causa:** Os scripts de validação leem `.env` (sem sufixo). O projeto em dev usa `.env.dev`.

**Correção (executar uma vez por ambiente/clone):**
```bash
cp backend/.env.dev backend/.env
cp frontend/.env.dev frontend/.env
```

> **Atenção:** esses arquivos estão no `.gitignore`. Recrie após cada `git clone`.

---

### #5 — Banco e usuário PostgreSQL não criados

**Sintoma:** Prisma retorna `P1003: Database does not exist` ou `P1000: Authentication failed`.

**Diagnóstico:**
```bash
sudo -u postgres psql -c "\du"   # listar usuários
sudo -u postgres psql -c "\l"    # listar bancos
```

**Correção:**
```bash
sudo -u postgres psql -c "CREATE USER aee_user WITH PASSWORD 'MinhaSenhaSegura123';"
sudo -u postgres psql -c "CREATE DATABASE aee_db OWNER aee_user;"

# Rodar migrations (SEMPRE com o binário local, não dlx!)
cd backend
DATABASE_URL="postgresql://aee_user:MinhaSenhaSegura123@localhost:5433/aee_db" \
  ./node_modules/.bin/prisma migrate deploy
```

---

### #6 — Superadmin não seedado

**Sintoma:** Login retorna `401 Usuário não autorizado` mesmo com email `@seducbertioga.com.br`.

**Diagnóstico:**
```bash
cd backend && node scripts/check_user.js
```

**Correção:**
```bash
cd backend
DATABASE_URL="postgresql://aee_user:MinhaSenhaSegura123@localhost:5433/aee_db" \
  node --input-type=module <<'EOF'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const exists = await prisma.usuario.findUnique({
  where: { email: 'monitoramento@seducbertioga.com.br' }
})
if (!exists) {
  await prisma.usuario.create({
    data: {
      email: 'monitoramento@seducbertioga.com.br',
      perfil: 'superadmin',
      nome: 'Prefeitura de Bertioga',
      ativo: true
    }
  })
  console.log('✅ Superadmin criado!')
} else {
  console.log('✅ Já existe:', exists.email, '| perfil:', exists.perfil)
}
await prisma.$disconnect()
EOF
```

---

## 🟡 Problemas ALTOS

### #7 — `pnpm dlx prisma` vs binário local

| Comando | Versão | Usar? |
|---------|--------|-------|
| `pnpm dlx prisma` | v7+ (mais recente) | ❌ Breaking changes |
| `./node_modules/.bin/prisma` | v6.x (local) | ✅ Sempre |
| `pnpm exec prisma` | v6.x (local) | ✅ |

### #8 — `environments.js` com path `/seduc_on/` (nome antigo)

**Arquivo:** `backend/src/config/environments.js`
```js
// ❌ ERRADO (nome antigo do projeto)
GOOGLE_REDIRECT_URI: 'http://localhost:5173/seduc_on/auth/callback'

// ✅ CORRETO
GOOGLE_REDIRECT_URI: 'http://localhost:5173/aee/auth/callback'
```

### #9 — `VITE_GOOGLE_CLIENT_ID` fora do bloco `define`

**Arquivo:** `frontend/vite.config.js` — deve conter:
```js
define: {
  'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
  // ...outros
}
```

### #10 — Docker de outro projeto ocupando portas

**Diagnóstico:**
```bash
docker ps                         # ver containers rodando
ss -tlnp | grep -E "3000|5432"   # ver portas ocupadas
```

**Correção:**
```bash
docker stop horelite-app horelite-db
# ou: docker stop $(docker ps -q)
```

> **Regra:** SEDUC ON em dev não usa Docker. Docker é só para produção.

### #11 — `start_seduc_on.sh` com configurações erradas

```bash
# ❌ ERRADO (antes da correção)
PG_CLUSTER_VERSION="18"
NODE_ENV=development npm run dev

# ✅ CORRETO (após correção)
PG_CLUSTER_VERSION="17"
NODE_ENV=development pnpm run dev
```

### #12 — `ErrorModal` não importado em `AuthCallback.jsx`

O componente crashava silenciosamente ao tentar renderizar erro de domínio.
**Corrigido:** UI de erro inline + `.catch()` explícito no `login()`.

### #13 — `window.history.replaceState` ignora `basename`

```js
// ❌ Causava URL /dashboard em vez de /aee/dashboard
window.history.replaceState(null, '', '/dashboard')

// ✅ Removido — navigate() do React Router cuida disso
navigate('/dashboard')
```

### #15 — Token Google expira em 1 hora

**NUNCA copie e cole uma URL de callback do browser para testar novamente.**
O `id_token` tem `exp` de 1h. Faça um novo login do zero.

---

## 📋 Checklist de Setup (Primeira Vez / Novo Clone)

```
[ ] node --version   →  v24+
[ ] pnpm --version   →  v8+
[ ] pg_lsclusters    →  cluster 17 na porta 5433

[ ] docker stop $(docker ps -q) 2>/dev/null  # matar outros projetos
[ ] ss -tlnp | grep -E "3001|5173"           # portas livres

[ ] sudo -u postgres psql -c "CREATE USER aee_user WITH PASSWORD 'MinhaSenhaSegura123';"
[ ] sudo -u postgres psql -c "CREATE DATABASE aee_db OWNER aee_user;"

[ ] cp backend/.env.dev backend/.env
[ ] cp frontend/.env.dev frontend/.env

[ ] cd backend && ./node_modules/.bin/prisma migrate deploy  (com DATABASE_URL apontando 5433)

[ ] node scripts/validate_google_env.js   →  ✅ Configuration is VALID
[ ] cd backend && node scripts/check_user.js  →  superadmin existe

[ ] ./start_seduc_on.sh dev
[ ] Acessar http://localhost:5173/aee/
```

---

## 📋 Checklist de Login (A cada teste)

```
[ ] ss -tlnp | grep 3001   →  backend rodando
[ ] ss -tlnp | grep 5173   →  frontend rodando
[ ] node scripts/validate_google_env.js  →  ✅
[ ] cd backend && node scripts/check_user.js  →  superadmin existe
[ ] grep VITE_BASE_URL frontend/.env.dev   →  deve ser /aee/
[ ] grep VITE_GOOGLE_REDIRECT_URI frontend/.env.dev  →  deve ter /aee/
[ ] grep DATABASE_URL backend/.env.dev    →  deve ter 5433
[ ] docker ps                             →  nenhum container do horelite
[ ] DevTools (F12) aberto na aba Console antes de logar
[ ] Usar conta @seducbertioga.com.br      →  não gmail.com
```

---

## 🚦 Tabela de Erros de Login

| Código | Mensagem | Causa | Solução |
|--------|---------|-------|---------|
| `401 invalid_client` | OAuth client not found | `redirect_uri` não cadastrada no GCP ou `client_id` errado | GCP Console + `validate_google_env.js` |
| `404` após callback | Página não encontrada | `VITE_BASE_URL=/` em vez de `/aee/` | Corrigir `frontend/.env.dev` e reiniciar Vite |
| `401 Domínio não autorizado` | Backend rejeita | Email não é `@seducbertioga.com.br` | Usar conta institucional |
| `401 Usuário não autorizado` | Backend rejeita | Email não cadastrado na tabela `usuarios` | Rodar seed |
| `401 Token inválido` | Backend rejeita | `client_id` diferente entre frontend e backend | `validate_google_env.js` |
| `Autenticando...` (trava) | Sem redirect | `AuthCallback` não encontrou `id_token` ou backend offline | Ver Console → `[AuthCallback]` |
| `Network Error` | Backend offline | Backend não está rodando | `ss -tlnp \| grep 3001` |
| Redirect para URL antiga | `/seduc_on/` na URL | `environments.js` com path antigo | Corrigir `environments.js` |

---

## 🗺️ Mapa de Portas

```
DEV (local)       PREVIEW (local)    DOCKER
─────────────     ───────────────    ──────────────────
PG  → 5433        PG  → 5433         PG  → db:5432 (interno)
API → 3001        API → 3000         API → localhost:3001
SPA → 5173/aee/   SPA → 4173/aee/   SPA → localhost:5173
```

## 📁 Mapa dos Arquivos `.env`

```
backend/
├── .env.dev      ← nodemon dev     (--env-file=.env.dev)
├── .env.preview  ← nodemon preview (--env-file=.env.preview)
├── .env          ← seed.js e scripts de validação  [NÃO versionado]
└── .env.example  ← template [versionado]

frontend/
├── .env.dev      ← Vite dev     (--mode development)
├── .env.preview  ← Vite preview (--mode preview)
├── .env          ← scripts de validação           [NÃO versionado]
└── .env.example  ← template [versionado]
```

---

*Documento gerado em 2026-06-25 a partir dos incidentes reais de setup no ambiente Crostini/Debian 12.*
