# SEDUC ON - Plataforma de Gestão Educacional

> Sistema de visualização de dados e gestão para a Secretaria de Educação de Bertioga.

## 📚 Documentação (Nova Estrutura)

A documentação foi unificada. Utilize os links abaixo para navegar:

### 🚀 Visão Geral e Arquitetura
*   **[Visão Geral & Roadmap](backend/docs/overview.md)**: Diagnóstico, arquitetura atual e planos de evolução.
*   **[Variáveis de Ambiente](ENV_VARS.md)**: Configuração de `.env` (Backend e Frontend).
*   **[Requisitos de Infra](INFRA_REQUIREMENTS.md)**: Versões de software e rede.

### 🛠️ Backend & API
*   **[Referência da API](backend/docs/api-reference.md)**: Endpoints, autenticação e exemplos.
*   **[Banco de Dados & ETL](backend/docs/database.md)**: Schema, comandos Prisma e importação de CSV.
*   **[Segurança & LGPD](backend/docs/security.md)**: Análise de riscos e boas práticas.
*   **[Testes](backend/docs/testing.md)**: Guia de execução de testes (Unitários e E2E).
*   **[Performance](backend/docs/performance/results.md)**: Relatórios de otimização e benchmarks.

### 💻 Frontend
*   **[Documentação Frontend](frontend/README.md)**: Estrutura, componentes e build.

### 📂 Estrutura de Pastas
*   `/backend`: API Node.js/Express + Prisma.
*   `/frontend`: SPA React + Vite.
*   `/csv`: Arquivos de dados brutos para importação.
*   `/docs`: Documentação técnica detalhada.

---

## 🚦 Guia Rápido (Quickstart)

### 1. Configuração Inicial
Certifique-se de configurar as variáveis de ambiente conforme o guia [ENV_VARS.md](ENV_VARS.md).

### 2. Rodar o Projeto (Desenvolvimento)
Utilize o script de conveniência na raiz:

```bash
./start_seduc_on.sh dev
```
Ou manualmente em cada pasta:

```bash
# Backend (Porta 3001)
cd backend && npm run dev

# Frontend (Porta 5173)
cd frontend && npm run dev
```

---

> **Status:** 🚧 Em Refatoração e Otimização