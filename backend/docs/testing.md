# Estratégia de Testes

> Guia completo para execução e manutenção dos testes automatizados (Backend e Frontend).

## Índice
- [1. Visão Geral](#1-visão-geral)
- [2. Backend (Jest)](#2-backend-jest)
- [3. Frontend (Playwright)](#3-frontend-playwright)
- [4. Testes Manuais](#4-testes-manuais)

---

## 1. Visão Geral

O projeto adota uma estratégia de testes em múltiplas camadas:
*   **Unitários/Integração (Backend):** Foco em regras de negócio, Controllers e Services.
*   **End-to-End (Frontend):** Testes de fluxo do usuário no navegador.

---

## 2. Backend (Jest)

Ferramenta: **Jest**  
Diretório: `backend/tests/`

### Execução
```bash
cd backend

# Rodar todos os testes
npm test

# Modo Watch (Desenvolvimento)
npm test -- --watch

# Relatório de Cobertura
npm run test:coverage
```

### Estrutura dos Testes
Os arquivos seguem o padrão `*.test.js`.

*   **`autenticacao/`**: Fluxos de login (Google Auth, JWT).
*   **`controllers/`**: Validação de endpoints e respostas da API.
*   **`funcionalidades/`**: Regras específicas (ex: Estatísticas).
*   **`middlewares/`**: Segurança e validação de requisição.

### Padrões de Código
Utilizamos `jest.unstable_mockModule` para lidar com dependências ESM (ECMAScript Modules).

**Exemplo de Mock em Controller:**
```javascript
import { jest } from '@jest/globals';

// 1. Mock antes do import
jest.unstable_mockModule('../src/services/exemplo.service.js', () => ({
  metodo: jest.fn()
}));

// 2. Import dinâmico
const { controller } = await import('../src/controllers/exemplo.controller.js');
```

---

## 3. Frontend (Playwright)

Ferramenta: **Playwright**  
Diretório: `frontend/tests/e2e/`

### Execução
```bash
cd frontend

# Rodar testes em "headless mode" (sem abrir navegador)
npx playwright test

# Rodar com interface visual (GUI)
npx playwright test --ui
```

### Principais Cenários
*   **`login.spec.js`**: Verifica carregamento da tela de login e tratamento de erro na autenticação.

---

## 4. Testes Manuais

Localizados em `backend/tests/manual/`, são scripts para validações que exigem interação externa complexa.

*   `test_sed_integration.js`: Validação com sistema externo SED.
*   `test_sed_route_security.js`: Auditoria de rotas protegidas.
