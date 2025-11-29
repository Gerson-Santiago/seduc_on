# Backend - API de Dados da Educação

API RESTful para processamento e fornecimento de dados educacionais da rede de Bertioga.

## Funcionalidades Principais

*   **API de Dados**: Endpoints otimizados para alimentar dashboards e relatórios.
*   **Gestão de Alunos**:
    *   Processamento de dados de matrículas (Infantil, Fundamental, EJA, AEE).
    *   Cálculo de estatísticas e indicadores por unidade escolar.
    *   Importação e tratamento de dados via CSV.
*   **Autenticação e Segurança**: Integração com Google OAuth e controle de acesso.

## Comandos Úteis

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