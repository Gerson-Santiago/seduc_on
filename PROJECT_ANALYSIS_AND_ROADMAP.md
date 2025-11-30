# Análise do Projeto e Roadmap - SEDUC ON

Este documento consolida a análise da arquitetura atual, auditoria de segurança e o roadmap para o futuro do projeto **Sistema de Visualização de Dados da Educação - Bertioga**.

**Última Atualização:** 29/11/2025

---

## 1. 🏗️ Análise da Arquitetura (CTO View)

O projeto segue uma arquitetura **Monorepo** bem estruturada, separando claramente as responsabilidades.

### Estrutura Atual
*   **Frontend (`frontend`)**: SPA moderna construída com **React** e **Vite**.
    *   **Pontos Fortes**:
        *   Uso de **Context API** para autenticação (`AuthContext`).
        *   **Rotas Protegidas**: Implementação de `AdminRoute` para áreas restritas.
        *   **Theming**: Suporte a tema claro/escuro via variáveis CSS nativas.
        *   **Nova Área Administrativa**: Módulo de "Solicitações de Acesso" implementado.
    *   **Oportunidades**:
        *   Implementação real dos gráficos no Dashboard (atualmente placeholders).
        *   Padronização de estilos (migração gradual para CSS Modules ou manter Vanilla CSS organizado).
*   **Backend (`backend`)**: API RESTful com **Node.js**, **Express** e **Prisma ORM**.
    *   **Pontos Fortes**:
        *   Arquitetura em camadas (Routes -> Controllers -> Services).
        *   **Segurança**: `helmet`, `cors` e `express-rate-limit` (implementado) ativos.
        *   **Banco de Dados**: Schema Prisma robusto, com recente refatoração do `registro_funcional` (Int) para integridade de dados.
    *   **Oportunidades**:
        *   Validação de entrada com **Zod** ou **Joi** (ainda pendente).
*   **Dados (`csv/`)**: Scripts e arquivos para ETL.

### Veredito
A arquitetura evoluiu significativamente. A camada de segurança foi reforçada e o fluxo de gestão de usuários (solicitação/aprovação) foi automatizado, reduzindo a carga operacional manual.

---

## 2. 🛡️ Auditoria de Segurança (Pentester View)

Análise de riscos e vulnerabilidades potenciais.

### ✅ Pontos Seguros Identificados
*   **Rate Limiting**: Middleware `apiLimiter` implementado no `app.js`, mitigando ataques de força bruta.
*   **Controle de Acesso**: Rotas administrativas (`/admin/solicitacoes`) protegidas tanto no Frontend (`AdminRoute`) quanto no Backend.
*   **Helmet & CORS**: Ativos e configurados corretamente.
*   **ORM**: Prisma previne SQL Injection.

### ⚠️ Riscos e Vulnerabilidades (Atenção)

1.  **Scripts de Manutenção**:
    *   A pasta `backend/scripts/debug` organiza os scripts manuais.
    *   **Risco**: Execução acidental em produção.
    *   **Ação**: Manter restrito. Garantir que não sejam chamados automaticamente pelo CI/CD.

2.  **Validação de Dados (Input Validation)**:
    *   Embora o frontend valide, o backend ainda confia parcialmente nos tipos básicos.
    *   **Risco**: Dados maliciosos complexos podem passar.
    *   **Ação**: Implementar schema validation (Zod) nos Controllers.

---

## 3. 🚀 Roadmap e Consolidação (CHANGELOG & SUGESTÕES)

### ✅ Concluído (Recentemente)
- [x] **Segurança**: Implementar `express-rate-limit` no backend.
- [x] **Funcionalidade**: Sistema de Solicitação de Acesso (Frontend + Backend).
- [x] **Funcionalidade**: Área Administrativa para aprovação de usuários.
- [x] **Dados**: Refatoração do `registro_funcional` (Split em dois campos inteiros).
- [x] **UX**: Link "Solicitações" no Sidebar visível apenas para Admins.
- [x] **UI**: Adaptação da página de Solicitações para Tema Claro/Escuro.

### 📅 Curto Prazo (Prioridade Alta)
- [ ] **Dados**: Implementar gráficos reais no Dashboard (Chart.js) - *Atualmente são placeholders*.
- [ ] **Backend**: Adicionar validação de dados com `zod` nos endpoints de criação/edição.
- [ ] **Testes**: Expandir cobertura de testes para além do módulo de `accessRequests`.

### 📅 Médio Prazo
- [ ] **Funcionalidade**: Exportação de relatórios (PDF/CSV) a partir das tabelas.
- [ ] **Frontend**: Refinar a UX do Dashboard com widgets de resumo (KPIs).
- [ ] **Infra**: Configurar pipeline de CI/CD básico (GitHub Actions).

### 📅 Longo Prazo
- [ ] **Auditoria**: Logs de atividade (quem aprovou quem, quem editou o quê).
- [ ] **Performance**: Cache (Redis) para endpoints de estatísticas pesadas.

---

Este documento serve como a "Fonte da Verdade" para a evolução segura do projeto AEE.
