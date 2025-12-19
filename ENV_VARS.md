# Matriz de Variáveis de Ambiente e Segurança

**Classificação:** Configuration Management
**Escopo:** Backend & Frontend (Vite)

Este documento define a taxonomia das variáveis de configuração do sistema. A separação estrita entre segredos de servidor e chaves públicas de cliente é mandatória.

## 📂 Estratégia de Arquivos (.env)

O projeto utiliza diferentes arquivos para isolar configurações por contexto:

| Arquivo | Contexto | Descrição |
| :--- | :--- | :--- |
| **`.env.dev`** | **Desenvolvimento** | Usado localmente (Backend). Contém senhas de teste. **Pode ser versionado** (cuidado!). |
| **`.env`** | **Produção** | Usado no servidor real. **NUNCA versionado**. Contém as chaves reais e seguras. |
| **`.env.example`** | **Modelo** | Serve de template. Lista todas as variáveis necessárias sem valores reais. |
| **`frontend/.env`** | **Frontend** | Configurações públicas do React/Vite. |

---

## 1. Backend Runtime Configuration
**Arquivo:** `backend/.env` / `.env.dev`
**Carregamento:** Node.js native (`--env-file`)

### 1.1 Identidade e Segurança (Critical Secrets)

| Chave | Obrigatoriedade | Descrição Técnica |
| :--- | :---: | :--- |
| **`JWT_SECRET`** | **CRÍTICO** | Assinatura digital dos tokens de sessão. <br> **Como Gerar:** `openssl rand -base64 64` <br> **Risco:** Se vazada, permite falsificação de usuários (Admin spoofing). |
| `GOOGLE_CLIENT_ID` | MANDATÓRIO | Credencial de Identidade (OIDC) do Provedor (GCP). |
| `GOOGLE_REDIRECT_URI`| MANDATÓRIO | Callback URI autorizada. Deve ser `http://.../auth/callback`. |

### 1.2 Persistência e Rede

| Chave | Padrão | Descrição Técnica |
| :--- | :--- | :--- |
| `DATABASE_URL` | N/A | DSN PostgreSQL: `postgresql://user:pass@host:port/db`. |
| `PORT` | `3001` | Porta do Servidor HTTP (Express). |
| `NODE_ENV` | `development` | `production` / `development` / `test`. |

### 1.3 Integrações Governamentais (SED)

| Chave | Descrição |
| :--- | :--- |
| `LOGIN_AUTH_SED` | Usuário de serviço para API SED. |
| `SED_AUTH` | Senha de serviço para API SED. |
| `URL_VALIDASED` | Endpoint base da API do governo. |

### 1.4 Política de Cross-Origin (CORS)

| Chave | Descrição Técnica |
| :--- | :--- |
| `ALLOWED_ORIGINS` | Lista de origens permitidas (ex: `http://localhost:5173`). |
| `FRONTEND_URL` | Origem canônica do Frontend para redirecionamentos. |

---

## 2. Frontend Build Configuration
**Arquivo:** `frontend/.env`
**Injeção:** Build-time (Vite Static Replacement)

> [!CAUTION]
> Variáveis prefixadas com `VITE_` são expostas publicamente no bundle JavaScript. **NUNCA** inclua chaves privadas aqui.

| Chave | Descrição Técnica |
| :--- | :--- |
| `VITE_API_BASE_URL` | Endpoint raiz da API REST (Gateway). |
| `VITE_GOOGLE_CLIENT_ID` | Public Client ID para inicialização do SDK Google Identity. |
| `VITE_GOOGLE_REDIRECT_URI` | Deve coincidir com a configuração do Backend. |
| `VITE_APP_URL` | Canônico público da aplicação SPA. |

---

## 3. Guia de Segurança do JWT

### O que é e por que precisa de Configuração?
O `JWT_SECRET` é a chave mestra que o backend usa para garantir que um token não foi alterado. 
*   **Quem gere:** DevOps/Tech Lead.
*   **Onde fica:** Apenas no servidor de produção (`.env`).
*   **Rotação:** Recomenda-se trocar essa chave periodicamente para invalidar sessões antigas.

---

## 4. Diagnóstico de Configuração

### Erro: `Google Auth Error: redirect_uri_mismatch`
**Causa:** Discrepância entre a URI enviada pelo Frontend (`VITE_GOOGLE_REDIRECT_URI`) e a registrada no Backend/GCP.
**Resolução:** Garantir integridade referencial entre as variáveis de ambiente e o console do Google Cloud.

### Erro: `FATAL: JWT_SECRET não definida`
**Causa:** Backend tentando iniciar sem chave de assinatura.
**Resolução:** Adicione `JWT_SECRET` ao `.env.dev` ou `.env`.
