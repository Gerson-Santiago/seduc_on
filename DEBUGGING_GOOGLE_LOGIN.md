# Depuração de Falha no Login Google (Credencial Inválida)

## 1. Descrição do Problema
Usuários estavam recebendo um erro de "Credencial inválida" ao tentar fazer login com o Google, apesar de seus e-mails existirem no banco de dados.

## 2. Etapas de Análise
1.  **Logs do Backend**: Verificado `backend/src/controllers/usuario.controller.js` para identificar a origem do erro 401. Ele captura erros de `UsuarioService.autenticarGoogle`.
2.  **Lógica do Frontend**: Verificado `frontend/src/context/AuthContext.jsx` para ver como o token é enviado.
3.  **Variáveis de Ambiente**: Comparado o `GOOGLE_CLIENT_ID` usado pelo backend para verificar o token e o `VITE_GOOGLE_CLIENT_ID` usado pelo frontend para gerar o token.

## 3. A Causa Raiz
Foi encontrado um erro de digitação em `frontend/.env`. O `VITE_GOOGLE_CLIENT_ID` tinha um 'K' extra no início, causando uma incompatibilidade com o `GOOGLE_CLIENT_ID` do backend.

- **Backend**: `1094161149479-...`
- **Frontend (Erro)**: `K1094161149479-...`

## 4. A Correção
O erro de digitação foi corrigido usando o seguinte comando `sed`:

```bash
sed -i 's/VITE_GOOGLE_CLIENT_ID=K/VITE_GOOGLE_CLIENT_ID=/' frontend/.env
```

## 5. Validação e Testes


### 5.1 Validação Automática da Configuração
Um script foi criado para validar automaticamente se as chaves de API coincidem entre o frontend e o backend.

**Script**: `scripts/validate_google_env.js`

**Executar a validação:**
```bash
node scripts/validate_google_env.js
```

### 5.2 Verificar Existência do Usuário
Um script foi criado para verificar se os usuários afetados existem no banco de dados com as permissões corretas.

**Script**: `backend/scripts/check_user.js`

```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUser(email) {
  console.log(`Verificando usuário: ${email}`);
  const user = await prisma.usuario.findUnique({
    where: { email },
  });
  console.log(user);
}

async function main() {
  await checkUser('monitoramento@seducbertioga.com.br');
  await checkUser('gerson.santiago@seducbertioga.com.br');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Executar a verificação:**
```bash
cd backend
node scripts/check_user.js
```

### 5.2 Validação Manual
1.  Inicie a aplicação (`./start_seduc_on.sh dev`).
2.  Acesse o frontend.
3.  Clique em "Entrar com Google".
4.  Selecione uma das contas verificadas.
5.  Garanta que o redirecionamento para o painel ocorra sem o erro "Credencial inválida".


## 6. Mapeamento de Erros de Autenticação

Abaixo estão os possíveis erros retornados pela API de login e suas causas:

| Código HTTP | Mensagem de Erro | Causa Provável | Solução |
| :--- | :--- | :--- | :--- |
| **400** | `Token é obrigatório` | O frontend não enviou o token no corpo da requisição. | Verificar `AuthContext.jsx` e a resposta do Google. |
| **403** | `Domínio não autorizado` | O e-mail do usuário não pertence ao domínio `seducbertioga.com.br`. | O usuário deve usar um e-mail institucional. |
| **401** | `Usuário não autorizado` | O e-mail é válido, mas não está cadastrado no banco de dados. | Cadastrar o usuário no banco de dados. |
| **401** | `Token inválido ou expirado` | O token enviado é inválido, expirou ou o `CLIENT_ID` não confere. | Verificar `CLIENT_ID` no `.env` (Frontend e Backend). |




## 7. Testes Automatizados

### 7.1 Backend (Jest)
Os testes do backend estão organizados por responsabilidade em `backend/tests/`:

- **Autenticação**: `tests/autenticacao/` (Login Google)
- **Controladores**: `tests/controllers/` (Lógica de negócios)
- **Middlewares**: `tests/middlewares/` (Validações, Rate Limit)
- **Funcionalidades**: `tests/funcionalidades/` (Estatísticas, Solicitações)

**Executar todos os testes:**
```bash
cd backend
npm test
```

### 7.2 Frontend (Playwright)
Testes E2E para validar fluxos completos.

**Arquivo**: `frontend/tests/e2e/login.spec.js`

**Executar:**
```bash
cd frontend
npx playwright test tests/e2e/login.spec.js
```

## 8. Segurança e Prevenção
- Certifique-se de que `GOOGLE_CLIENT_ID` (Backend) e `VITE_GOOGLE_CLIENT_ID` (Frontend) sejam idênticos.
- Os arquivos de teste estão localizados fora dos diretórios de código-fonte (`src`) e não são incluídos nos builds de produção, garantindo que scripts de teste não sejam expostos.


