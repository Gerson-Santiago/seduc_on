# SEDUC ON - Backend - API de Dados da Educação

API RESTful para processamento e fornecimento de dados educacionais da rede de Bertioga.

## Funcionalidades Principais

*   **API de Dados**: Endpoints otimizados para alimentar dashboards e relatórios.
*   **Gestão de Alunos**:
    *   Processamento de dados de matrículas (Infantil, Fundamental, EJA, AEE).
    *   Cálculo de estatísticas e indicadores por unidade escolar.
    *   Importação e tratamento de dados via CSV.
*   **Autenticação e Segurança**: Integração com Google OAuth e controle de acesso.
*   **Documentação**:
    *   [Visão Geral Técnica](docs/OVERVIEW.md)
    *   [API Reference](docs/API_REFERENCE.md)
    *   [Guia de Testes](docs/TESTING.md)
    *   [Política de Segurança](docs/SECURITY.md)
    *   [Arquitetura de Banco de Dados](docs/DATABASE.md)
    *   [Variáveis de Ambiente](../ENV_VARS.md)

## Pré-requisitos

Certifique-se de ter o ambiente configurado com as versões homologadas:

*   **Node.js:** v24.12.0
*   **NPM:** v11.6.4
*   **PostgreSQL:** v18.1

## Como Contribuir


1.  Clone o repositório.
2.  Instale as dependências: `npm install`.
3.  Configure o `.env` (use `.env.example` como base).
4.  Rode os testes: `npm test`.
5.  Inicie o servidor: `npm run dev`.

### Instalação
```bash
npm install
```

### Migração de Banco de Dados
```bash
npx prisma migrate dev
```

### Importação de Dados (CSV)
```bash
node --env-file=.env prisma/import_students.js
```

## Estrutura de Pastas
*   `src/controllers`: Lógica de tratamento das requisições e resposta de dados.
*   `src/services`: Regras de negócio, processamento de estatísticas e acesso ao banco.
*   `src/routes`: Definição dos endpoints da API.
*   `prisma/`: Esquema do banco de dados e scripts de migração/importação.