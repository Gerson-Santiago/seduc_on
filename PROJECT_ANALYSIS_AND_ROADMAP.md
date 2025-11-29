# Análise do Projeto e Roadmap de Segurança

Este documento consolida a análise da arquitetura atual, auditoria de segurança e o roadmap para o futuro do projeto **Sistema de Visualização de Dados da Educação - Bertioga**.

---

## 1. 🏗️ Análise da Arquitetura (CTO View)

O projeto segue uma arquitetura **Monorepo** bem estruturada, separando claramente as responsabilidades.

### Estrutura Atual
*   **Frontend (`frontend`)**: SPA moderna construída com **React** e **Vite**.
    *   **Pontos Fortes**: Uso de Context API para estado global (Auth), separação de rotas e componentes, e agora integração com **Chart.js** para visualização de dados.
    *   **Oportunidades**: Padronização de estilos (CSS Modules vs Vanilla CSS) e tipagem estática (TypeScript) para maior robustez.
*   **Backend (`backend`)**: API RESTful com **Node.js**, **Express** e **Prisma ORM**.
    *   **Pontos Fortes**: Arquitetura em camadas (Routes -> Controllers -> Services), uso de `helmet` para segurança básica, e `prisma` para interação segura com o banco.
    *   **Oportunidades**: Falta de validação de entrada robusta (ex: Zod/Joi) e Rate Limiting.
*   **Dados (`csv/`)**: Scripts e arquivos para ETL (Extração, Transformação e Carga) de dados da prefeitura.

### Veredito
A arquitetura é **sólida e escalável** para o propósito de visualização de dados. A separação entre front e back permite evoluções independentes.

---

## 2. 🛡️ Auditoria de Segurança (Pentester View)

Análise de riscos e vulnerabilidades potenciais.

### ✅ Pontos Seguros Identificados
*   **Helmet**: O middleware `helmet` está ativo no backend, protegendo contra headers HTTP inseguros conhecidos.
*   **CORS**: Configurado para permitir apenas origens específicas (`ALLOWED_ORIGINS`), prevenindo acesso não autorizado de outros domínios.
*   **ORM**: O uso do Prisma previne a maioria das injeções de SQL (SQL Injection).

### ⚠️ Riscos e Vulnerabilidades (Atenção Imediata)

1.  **Scripts de Debug em Produção**:
    *   A pasta `backend/scripts/debug` contém scripts como `restore_users.js` e `check_users.js`.
    *   **Risco**: Se esses scripts forem acessíveis ou executados indevidamente em produção, podem expor dados sensíveis ou alterar o estado do banco.
    *   **Ação**: Garantir que esses scripts não sejam incluídos no build de produção ou movê-los para uma pasta `admin-tools` restrita e ignorada pelo git se contiverem segredos.

2.  **Arquivos Gitignored (`scripts/audit_all.sh`)**:
    *   O script `audit_all.sh` está no `.gitignore`.
    *   **Risco**: Falta de versionamento pode levar a "drift" (diferenças não rastreadas) e perda de conhecimento. Se contiver credenciais hardcoded, é um risco de vazamento se o arquivo for compartilhado manualmente.
    *   **Ação**: Verificar conteúdo. Se tiver segredos, usar variáveis de ambiente. Se não, remover do `.gitignore`.

3.  **Ausência de Rate Limiting**:
    *   Não foi identificado middleware de `express-rate-limit` no `app.js`.
    *   **Risco**: A API está vulnerável a ataques de força bruta (Brute Force) e negação de serviço (DDoS).
    *   **Ação**: Implementar limitação de requisições, especialmente nas rotas de login.

4.  **Validação de Dados**:
    *   Dependência apenas da validação do frontend ou do banco de dados.
    *   **Risco**: Dados maliciosos podem passar se a requisição for feita diretamente à API (bypassing frontend).
    *   **Ação**: Implementar validação de schema (ex: Zod) na entrada dos Controllers.

---

## 3. 🚀 Roadmap e Consolidação (CHANGELOG & SUGESTÕES)

Fusão das sugestões anteriores com o novo foco em **Dados e Segurança**.

### Curto Prazo (Prioridade Alta)
- [ ] **Segurança**: Implementar `express-rate-limit` no backend.
- [ ] **Segurança**: Revisar e proteger a pasta `backend/scripts/debug`.
- [ ] **Dados**: Criar os primeiros gráficos com Chart.js no Dashboard (Total de Alunos, Distribuição por Escola).
- [ ] **Infra**: Configurar variáveis de ambiente para todos os segredos (nunca commitar `.env`).

### Médio Prazo
- [ ] **Backend**: Adicionar validação de dados com `zod` ou `joi` nos endpoints de criação/edição.
- [ ] **Frontend**: Migrar componentes chave para TypeScript para evitar erros de tipo.
- [ ] **Funcionalidade**: Implementar exportação de relatórios (PDF/CSV) a partir dos dashboards.

### Longo Prazo
- [ ] **Auditoria**: Criar logs de auditoria (quem acessou o que e quando) salvos no banco.
- [ ] **Performance**: Implementar cache (Redis) para rotas de estatísticas pesadas.

---

Este documento serve como a "Fonte da Verdade" para a evolução segura do projeto AEE.
