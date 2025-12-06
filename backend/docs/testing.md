# Estratégia de Testes

**Data da Última Atualização:** Dezembro 2025

A qualidade do código no SEDUC ON é garantida através de uma pirâmide de testes abrangente, cobrindo desde unidades isoladas até fluxos de usuário completos.

## 🧪 Níveis de Teste

### 1. Testes Unitários (Unit Tests)
Focam em testar a lógica de regras de negócio e utilitários de forma isolada, sem dependências externas (banco de dados, rede).
*   **Ferramenta:** Jest
*   **Localização:** `backend/tests/utils`, `backend/tests/services`
*   **Exemplo:** Validar se a função `sanitizarTexto` remove espaços corretamente.

### 2. Testes de Integração
Verificam se os componentes funcionam bem juntos, incluindo a interação com o Banco de Dados (Prisma).
*   **Ferramenta:** Jest + Supertest
*   **Localização:** `backend/tests/integration`
*   **Foco:** Rotas da API e integridade do Banco de Dados.

### 3. Testes Ponta-a-Ponta (E2E)
Simulam o comportamento real do usuário navegando no sistema.
*   **Ferramenta:** Playwright (Frontend)
*   **Foco:** Login via Google, navegação no Dashboard, fluxos críticos de cadastro.

## 🚀 Como Executar os Testes

### Backend (Jest)
```bash
# Executar todos os testes
npm test

# Modo Watch (Desenvolvimento)
npm test -- --watch

# Gerar relatório de cobertura
npm run test:coverage
```

### Frontend (E2E)
```bash
# Executar testes Playwright (headless)
npx playwright test

# Executar com interface gráfica
npx playwright test --ui
```

## 📏 Padrões de Qualidade
*   **Nomes em Português:** Todos os testes (`describe`, `test`) devem ser descritos em Português Brasileiro.
*   **AAA:** Arrange, Act, Assert. Organize o código do teste nestas três seções claras.
*   **Mocking:** Use mocks para serviços externos (como Google Auth) para evitar dependência de rede nos testes unitários.
