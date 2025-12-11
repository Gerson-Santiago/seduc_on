# Configuração de Autenticação Blindada (Google OAuth & Cookies)

Este documento define o padrão **obrigatório** de configuração para a autenticação do SEDUC ON.

## 1. Variáveis de Ambiente Obrigatórias
O backend **não iniciará** se qualquer uma destas variáveis estiver faltando.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `GOOGLE_CLIENT_ID` | Credencial pública do GCP | `123...apps.googleusercontent.com` |
| `JWT_SECRET` | Chave secreta para assinar tokens | `segredo_super_forte_v1` |
| `DATABASE_URL` | Conexão PostgreSQL (Prisma) | `postgresql://user:pass@localhost:5432/db` |
| `FRONTEND_URL` | URL exata do Frontend (CORS) | `http://localhost:5173` |

## 2. Política de Cookies (Segurança)
A aplicação aplica automaticamente flags de segurança nos cookies dependendo do ambiente (`NODE_ENV`).

| Ambiente | HTTPS | Secure | SameSite |
| :--- | :--- | :--- | :--- |
| `development` | Não | `false` | `Lax` |
| `production` | **Sim** | **`true`** | `Lax` |

> **PERIGO:** Em produção, se você rodar sem HTTPS, o login **falhará silenciosamente** porque o navegador rejeitará o cookie `Secure`.

## 3. Contrato Frontend
Para o login funcionar, toda requisição autenticada do frontend deve incluir:
```javascript
fetch(url, {
  credentials: 'include' // OBRIGATÓRIO para enviar o cookie HttpOnly
})
```

## 4. Diagnóstico de Falhas Comuns
**Sintoma:** "Faço login, o Google redireciona, mas volto para a tela de login."
**Causa:** Backend gerou o cookie, mas o endpoint `/me` não conseguiu lê-lo.
**Solução:**
1. Verifique se o `getMe` no controller está usando `req.user.id`.
2. Verifique se o frontend está enviando `credentials: 'include'`.
3. Se for produção, verifique se está usando HTTPS.
