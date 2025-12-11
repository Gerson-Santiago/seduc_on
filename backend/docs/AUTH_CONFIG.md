# Especificação de Autenticação e Gestão de Identidade

**Classificação:** Technical Specification
**Protocolo:** OAuth 2.0 + OIDC
**Sessão:** Stateful HttpOnly Cookies

Este documento define os padrões mandatórios para a configuração do subsistema de autenticação do módulo backend.

## 1. Configuração de Ambiente (Environment)

O runtime de segurança exige a definição estrita das seguintes variáveis de ambiente. A ausência de qualquer chave resultará em *Startup Failure*.

| Variável | Classificação | Descrição Técnica | Exemplo |
| :--- | :--- | :--- | :--- |
| `GOOGLE_CLIENT_ID` | Identidade | Credencial pública do Authorization Server (GCP) | `123...apps.googleusercontent.com` |
| `JWT_SECRET` | Criptografia | Chave simétrica (HMAC SHA256) para assinatura de tokens | `hash_256_bits_complexo` |
| `DATABASE_URL` | Conectividade | Connection String JDBC-like para PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `FRONTEND_URL` | Segurança | Origem confiável para Política CORS | `http://localhost:5173` |

## 2. Política de Segurança de Sessão (Session Policy)

A gestão de sessão utiliza cookies seguros para evitar vetores de ataque comuns (XSS/CSRF). A aplicação aplica flags de segurança condicionalmente ao ambiente (`NODE_ENV`).

| Ambiente | Flag `Secure` (HTTPS) | Atributo `SameSite` | Comportamento |
| :--- | :---: | :---: | :--- |
| `development` | `false` | `Lax` | Permite testes locais via HTTP. |
| `production` | **`true`** | `Lax` | **Exige HTTPS**. Cookies são rejeitados silenciosamente em HTTP. |

> [!WARNING]
> Em produção, a terminação SSL/TLS (Load Balancer ou Reverse Proxy) é **obrigatória**. Sem HTTPS, a autenticação falhará.

## 3. Contrato de Integração (Frontend Consumer)

Para garantir a persistência da sessão, o cliente HTTP (Browser/Frontend) deve ser configurado para incluir credenciais em requisições Cross-Origin.

**Exemplo de Implementação (Fetch API):**
```javascript
const response = await fetch(API_URL, {
  method: 'GET',
  credentials: 'include', // Mandatório para transporte de Cookies HttpOnly
  headers: {
    'Content-Type': 'application/json'
  }
});
```

## 4. Troubleshooting e Diagnóstico

### Cenário: Loop de Redirecionamento (Auth Loop)
**Sintoma:** Usuário autentica no Google, retorna à aplicação, mas permanece deslogado.
**Causa Raiz:** O backend emitiu o cookie `Set-Cookie`, mas o Frontend não o retransmitiu na chamada subsequente (`/me`).

**Checklist de Resolução:**
1.  **Backend:** Verificar se o Controller `getMe` acessa `req.user` corretamente.
2.  **Frontend:** Confirmar flag `credentials: 'include'`.
3.  **Infraestrutura:** Verificar se o domínio do Backend e Frontend compartilham o mesmo eTLD+1 ou se as políticas de `SameSite` permitem a troca.
