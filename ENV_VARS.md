# Matriz de Variáveis de Ambiente

**Classificação:** Configuration Management
**Escopo:** Backend & Frontend (Vite)

Este documento define a taxonomia das variáveis de configuração do sistema. A separação estrita entre segredos de servidor e chaves públicas de cliente é mandatória.

## 1. Backend Runtime Configuration
**Arquivo:** `backend/.env`
**Carregamento:** Node.js native (`--env-file`)

### 1.1 Identidade e Segurança (Critical Secrets)

| Chave | Obrigatoriedade | Descrição Técnica |
| :--- | :---: | :--- |
| `JWT_SECRET` | **CRÍTICO** | Chave simétrica (HMAC) para assinatura de Tokens de Sessão. Mínimo 256 bits de entropia. |
| `GOOGLE_CLIENT_ID` | **MANDATÓRIO** | Credencial de Identidade (OIDC) do Provedor (GCP). |
| `GOOGLE_REDIRECT_URI`| **MANDATÓRIO** | Callback URI autorizada na console do GCP. Deve corresponder exatamente à rota de callback. |

### 1.2 Persistência e Rede

| Chave | Padrão | Descrição Técnica |
| :--- | :--- | :--- |
| `DATABASE_URL` | N/A | DSN de conexão PostgreSQL. Formato: `postgresql://user:pass@host:port/db?schema=public` |
| `PORT` | `3001` | Porta de escuta do Servidor HTTP (Express). |
| `NODE_ENV` | `development` | Define otimizações de runtime. Valores: `production` | `development` | `test`. |

### 1.3 Política de Cross-Origin (CORS)

| Chave | Descrição Técnica |
| :--- | :--- |
| `ALLOWED_ORIGINS` | Lista de origens permitidas (Comma-Separated). Ex: `https://app.seduc.sp.gov.br,http://localhost:5173` |
| `FRONTEND_URL` | Origem canônica do Frontend para redirecionamentos de Auth. |

---

## 2. Frontend Build Configuration
**Arquivo:** `frontend/.env.*`
**Injeção:** Build-time (Vite Static Replacement)

> [!CAUTION]
> Variáveis prefixadas com `VITE_` são expostas publicamente no bundle JavaScript. **NUNCA** inclua chaves privadas aqui.

| Chave | Descrição Técnica |
| :--- | :--- |
| `VITE_API_BASE_URL` | Endpoint raiz da API REST (Gateway). |
| `VITE_GOOGLE_CLIENT_ID` | Public Client ID para inicialização do SDK Google Identity. |
| `VITE_GOOGLE_REDIRECT_URI` | Deve coincidir com a configuração do Backend para evitar `redirect_uri_mismatch`. |
| `VITE_APP_URL` | Canônico público da aplicação SPA. |

## 3. Diagnóstico de Configuração

### Erro: `Google Auth Error: redirect_uri_mismatch`
**Causa:** Discrepância entre a URI enviada pelo Frontend (`VITE_GOOGLE_REDIRECT_URI`) e a registrada no Backend/GCP.
**Resolução:** Garantir integridade referencial entre as variáveis de ambiente e o console do Google Cloud.

### Erro: Variável não definida no Frontend
**Causa:** Ausência do prefixo `VITE_` ou cache de build.
**Resolução:** Reiniciar processo de build (`npm run dev`) após alterações em `.env`.
