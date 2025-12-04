# Estratégia de Testes - SEDUC ON

Este documento descreve a organização e execução dos testes automatizados e manuais do projeto.

## 1. Backend (Node.js/Jest)

Os testes do backend utilizam **Jest** e estão localizados em `backend/tests/`.

### Estrutura
*   **`autenticacao/`**: Testes de login (Google Auth, JWT).
*   **`controllers/`**: Testes unitários dos controladores (regras de negócio).
*   **`funcionalidades/`**: Testes de funcionalidades específicas (Estatísticas, Solicitações).
*   **`middlewares/`**: Testes de validação e segurança (Rate Limit).
*   **`manual/`**: Scripts para testes manuais e verificações pontuais.

### Execução
Para rodar todos os testes automatizados:
```bash
cd backend
npm test
```

Para rodar com relatório de cobertura:
```bash
cd backend
npm run test:coverage
```

### Testes Manuais (`backend/tests/manual/`)
Scripts auxiliares para validações que requerem interação externa ou verificação de ambiente.
*   `test_sed_integration.js`: Valida a integração com o sistema SED.
*   `test_sed_route_security.js`: Verifica a segurança das rotas protegidas.

---

## 2. Frontend (React/Playwright)

Os testes do frontend utilizam **Playwright** para testes End-to-End (E2E).

### Estrutura
*   **`tests/e2e/`**: Contém os cenários de teste completos.
    *   `login.spec.js`: Valida o carregamento da página de login e simula falhas de autenticação.

### Execução
Para rodar os testes E2E (headless):
```bash
cd frontend
npx playwright test
```

Para rodar com interface visual:
```bash
cd frontend
npx playwright test --ui
```

---

## 3. Boas Práticas
*   **Nomes de Arquivo**: Testes automatizados devem terminar com `.test.js` (Backend) ou `.spec.js` (Frontend).
*   **Ambiente**: Certifique-se de que as variáveis de ambiente de teste (`.env.test` ou mocks) estejam configuradas corretamente antes de rodar os testes de integração.
