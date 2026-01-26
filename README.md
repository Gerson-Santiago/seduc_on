# SEDUC ON - Plataforma de Gestão Educacional

> **Enterprise Data Management System** para a Secretaria de Educação de Bertioga.

O **SEDUC ON** é uma plataforma de alta performance projetada para centralização, processamento e visualização de dados educacionais. O sistema implementa uma arquitetura robusta para suportar ingestão massiva de dados (ETL) e entrega de informações em tempo real.

| Componente | Stack Tecnológica | Arquitetura |
| :--- | :--- | :--- |
| **Backend** | Node.js (v24.11.1), Express 5.x, Prisma 6.x | Three-Tier Layered Modular |
| **Frontend** | React 18, Vite, TailwindCSS | SPA (Single Page Application) |
| **Database** | PostgreSQL 18.1 | Relational Data Warehouse |
| **Container** | Docker Compose | Isolated Services (App + DB) |

---

## 📚 Documentação Técnica Corporativa

A documentação do projeto foi estruturada para refletir os padrões de engenharia de software adotados.

### 🏛️ Arquitetura e Engenharia
*   **[Relatório de Segurança e Arquitetura](backend/docs/RELATORIO_SEGURANCA_ARQUITETURA.md)**: (⭐ **Start Here**) Documento definitivo sobre o design solution, auditoria de segurança e padrões arquiteturais.
*   **[Visão Geral do Sistema](backend/docs/overview.md)**: Roadmap estratégico e análise funcional.
*   **[Especificação de Infraestrutura](INFRA_REQUIREMENTS.md)**: Matriz de compatibilidade e requisitos de ambiente.

### 🔐 Segurança e Autenticação
*   **[Políticas de Segurança](backend/docs/security.md)**: Detalhamento de protocolos de defesa, sanitização e conformidade.
*   **[Manual de Autenticação](backend/docs/AUTH_CONFIG.md)**: Implementação do fluxo OAuth2 com Cookies Seguros.

### 🛠️ Operacional e Desenvolvimento
*   **[Referência da API](backend/docs/api-reference.md)**: Catálogo de endpoints RESTful.
*   **[Engenharia de Dados (ETL/DB)](backend/docs/database.md)**: Modelagem de dados e pipelines de ingestão.
*   **[Guia de Testes](backend/docs/testing.md)**: Estratégias de Quality Assurance (QA).

---

## 🚀 Quickstart (Ambiente de Desenvolvimento)

### Pré-requisitos
Consulte [INFRA_REQUIREMENTS.md](INFRA_REQUIREMENTS.md) para garantir conformidade de ambiente.


### 🐳 Docker Quickstart (Recomendado)

A maneira mais rápida e limpa de rodar o projeto.

```bash
# Inicia Backend, Frontend e Banco de Dados
docker compose up --build
```
- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:5173
- **Banco:** Isolado no container `seduc_db`

### Inicialização Manual (Legado)
O projeto utiliza scripts de automação para orquestrar os serviços localmente sem Docker.

```bash
# Iniciar todo o ecossistema (Backend + Frontend)
./start_seduc_on.sh dev
```

### Configuração Manual
Para execução granular dos serviços:

**Backend (API & Workers)**
```bash
cd backend
npm install
npm run dev # Porta 3001
```

**Frontend (Dashboard)**
```bash
cd frontend
npm install
npm run dev # Porta 5173
```

---

## 📦 Estrutura de Diretórios (Source Tree)

*   `/backend`: Núcleo da aplicação baseada em **Modular Pattern**.
*   `/frontend`: Interface de usuário reativa.
*   `/csv`: Staging area para ingestão de dados legados.
*   `/docs`: Repositório central de conhecimento técnico.

---

> **Status do Projeto:** Ativo e em Evolução Contínua.