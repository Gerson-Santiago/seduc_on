# Debugging: Google Login

> Guia de solução de problemas para erros de autenticação "Credencial Inválida".

## Índice
- [1. O Problema](#1-descrição-do-problema)
- [2. Causa Raiz](#3-a-causa-raiz)
- [3. Correção](#4-a-correção)
- [4. Scripts de Validação](#5-validação-e-testes)

---

## 1. Descrição do Problema
**Sintoma:** Usuários recebem erro `401 - Credencial inválida` ao tentar logar, mesmo com e-mail cadastrado.

**Diagnóstico:** Incompatibilidade entre o `CLIENT_ID` gerado no Frontend e o esperado pelo Backend.

---

## 2. A Causa Raiz
Foi identificado que o `VITE_GOOGLE_CLIENT_ID` no `.env` do frontend continha um caractere extra (ex: um 'K' no início) ou diferia do `GOOGLE_CLIENT_ID` do backend.

*   Backend espera: `123456...`
*   Frontend enviava: `K123456...`

Isso invalida a assinatura do token JWT do Google.

---

## 3. A Correção
Certifique-se de que as chaves sejam **IDÊNTICAS** em ambos os arquivos `.env`:

`backend/.env`:
```env
GOOGLE_CLIENT_ID=109416...
```

`frontend/.env`:
```env
VITE_GOOGLE_CLIENT_ID=109416...
```

---

## 4. Scripts de Validação

Foi criado um script para automatizar essa verificação:

```bash
node scripts/validate_google_env.js
```

### Verificar Usuário no Banco
Para confirmar se o email existe e tem a role correta:

```bash
cd backend
node scripts/check_user.js
```

---

## 5. Tabela de Erros Comuns

| Código | Erro | Solução |
| :--- | :--- | :--- |
| **400** | Token obrigatório | Frontend não enviou o JWT. Verifique `AuthContext`. |
| **403** | Domínio não autorizado | E-mail não pertence ao domínio da instituição. |
| **401** | Token inválido | `CLIENT_ID` não confere (ver acima). |
| **401** | Usuário não encontrado | Cadastrar usuário no banco (tabela `usuarios`). |
