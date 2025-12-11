# Estratégia de Qualidade e Testes (QA Strategy)

**Classificação:** Quality Assurance Standard
**Frameworks:** Jest (Unit/Integration), Playwright (E2E)

A garantia de qualidade no SEDUC ON baseia-se no modelo **Test Pyramid** invertido para modernidade, priorizando testes de integração rápidos e E2E críticos.

## 1. Níveis de Teste (Test Layers)

### 1.1 Testes Unitários (Unit Testing)
Validam a lógica de negócio pura ("Domain Logic") em isolamento.
*   **Escopo:** `src/services`, `src/utils`.
*   **Estratégia:** Mocking de dependências externas (Prisma, Google API).
*   **Localização:** `backend/tests/unit`.
*   **Comando:** `npm test -- unit`

### 1.2 Testes de Integração (Integration Testing)
Validam o contrato da API e a persistência de dados.
*   **Escopo:** `src/controllers`, `src/routes`, `Database`.
*   **Estratégia:** Uso de banco de dados de teste (Dockerized ou SQLite in-memory) e `supertest` para chamadas HTTP.
*   **Localização:** `backend/tests/integration`.
*   **Comando:** `npm test -- integration`

### 1.3 Testes Ponta-a-Ponta (E2E Testing)
Validam fluxos críticos de usuário na interface real.
*   **Escopo:** Login Flow, Dashboard Rendering, CRUD Critical Path.
*   **Ferramenta:** Playwright.
*   **Comando:** `npx playwright test`

## 2. Métricas de Cobertura (Code Coverage)

A aplicação persegue métricas de cobertura utilitária (não apenas percentual cego).

```bash
# Geração de Relatório de Cobertura
npm run test:coverage
```

**Alvos de Qualidade:**
*   **Services:** > 80% (Foco em Regras de Negócio).
*   **Utils:** 100% (Funções Puras).
*   **Controllers:** Cobertura via Testes de Integração.

## 3. Padrões de Escrita (Authoring Standards)

### 3.1 Nomenclatura e Idioma
Testes devem ser descritivos e escritos em **Português Brasileiro**.

```javascript
describe('Serviço de Aluno', () => {
  test('deve rejeitar cadastro com RA duplicado', async () => {
    // ...
  });
});
```

### 3.2 Padrão AAA
Todo teste deve seguir estritamente o padrão Arrange-Act-Assert.

*   **Arrange:** Preparar o mock ou estado do banco.
*   **Act:** Executar a função alvo.
*   **Assert:** Verificar o resultado esperado (Expectations).
