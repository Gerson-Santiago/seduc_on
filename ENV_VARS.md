# Variáveis de Ambiente
> Guia de referência e configuração das variáveis de ambiente para Backend e Frontend.

## Índice
- [1. Visão Geral](#visão-geral)
- [2. Configuração do Backend](#configuração-do-backend)
- [3. Configuração do Frontend](#configuração-do-frontend)
- [4. Solução de Problemas](#solução-de-problemas)

---

## Visão Geral

O projeto utiliza uma estratégia de **Configuração Distribuída**, onde Frontend e Backend possuem seus próprios arquivos de configuração. Isso garante segurança (segredos do backend não vazam no build do frontend) e desacoplamento.

*   **Backend:** Usa `dotenv` para carregar variáveis em tempo de execução.
*   **Frontend:** Usa o sistema de `modes` do Vite (`.env`, `.env.development`, `.env.production`).

---

## Configuração do Backend

Arquivo: `backend/.env`

Para iniciar, copie o exemplo:
```bash
cd backend
cp .env.example .env
```

### Referência das Variáveis

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| **AMBIENTE** | | |
| `NODE_ENV` | Define o modo de execução (`development`, `production`, `preview`). | `development` |
| `PORT` | Porta onde o servidor Express irá rodar. | `3001` |
| **CORS & FRONTEND** | | |
| `FRONTEND_URL` | URL base onde o frontend está rodando (usado para redirecionamentos). | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | Lista de origens permitidas no CORS (separadas por vírgula). | `http://localhost:5173` |
| **AUTENTICAÇÃO & GOOGLE** | | |
| `GOOGLE_CLIENT_ID` | ID do Cliente obtido no Google Cloud Console. | `123...apps.googleusercontent.com` |
| `GOOGLE_REDIRECT_URI` | Deve coincidir exatamente com a URI autorizada no Google Cloud. | `/aee/auth/callback` |
| `JWT_SECRET` | Chave secreta para assinar tokens JWT. Use uma string longa e aleatória. | `super-secret-key` |
| **BANCO DE DADOS** | | |
| `DATABASE_URL` | Connection string do PostgreSQL. | `postgresql://user:pass@host:5432/db` |
| **SETUP INICIAL** | | |
| `SUPERADMIN_EMAIL` | Email para o primeiro usuário admin. | `admin@seduc.sp.gov.br` |
| `SUPERADMIN_NAME` | Nome do primeiro usuário admin. | `Admin Seduc` |
| **INTEGRAÇÃO SED** | | |
| `URL_VALIDASED` | Endpoint da API do SED. | `https://.../api` |
| `LOGIN_AUTH_SED` | Rota de login do SED. | `login` |
| `SED_AUTH` | Rota de auth do SED. | `auth` |

---

## Configuração do Frontend

Arquivo: `frontend/.env` (ou `.env.development`, `.env.production`)

As variáveis do frontend são embutidas no código durante o build do Vite. Apenas variáveis iniciadas com `VITE_` são expostas.

### Referência das Variáveis

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_APP_URL` | URL onde o frontend está sendo servido. | `http://localhost:5173` |
| `VITE_API_BASE_URL` | URL base da API do Backend. | `http://localhost:3001/api` |
| `VITE_GOOGLE_CLIENT_ID` | ID do Cliente Google (deve ser o mesmo do backend). | `123...apps.googleusercontent.com` |
| `VITE_GOOGLE_REDIRECT_URI` | URI de callback (deve apontar para o frontend). | `http://localhost:5173/auth/callback` |
| `VITE_LOGIN_PATH` | Caminho interno para a rota de login. | `/login` |
| `VITE_DASHBOARD_PATH` | Caminho interno para o dashboard. | `/dashboard` |
| `VITE_INSTITUTION_DOMAIN` | Domínio da instituição (para personalização). | `seducbertioga.com.br` |

---

## Solução de Problemas

### Erro: `Google Auth Error: redirect_uri_mismatch`
Verifique se `GOOGLE_REDIRECT_URI` (Backend) e `VITE_GOOGLE_REDIRECT_URI` (Frontend) estão idênticos ao configurado no Google Cloud Console. Lembre-se que em produção, `localhost` não funciona.

### Erro: Variável `undefined` no Frontend
Certifique-se de que a variável começa com `VITE_`. Se você alterou o `.env`, reinicie o servidor de desenvolvimento (`npm run dev`), pois o Vite não recarrega variáveis de ambiente "a quente" instantaneamente em todos os casos.
