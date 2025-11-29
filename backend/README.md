# Backend AEE

API RESTful desenvolvida em Node.js com Express e Prisma ORM.

## Funcionalidades Principais

*   **Autenticação**: Integração com Google OAuth e gestão de sessões.
*   **Alunos**:
    *   Listagem com filtros (Nome, Escola, Série).
    *   Estatísticas agrupadas por unidade escolar.
    *   Importação e distribuição de dados via CSV.
*   **Usuários**: Gestão de perfis e permissões.

## Comandos Úteis

### Instalação
```bash
npm install
```

### Migração de Banco de Dados
```bash
npx prisma migrate dev
```

### Importação de Alunos (CSV)
```bash
node --env-file=.env prisma/import_students.js
```

## Estrutura de Pastas
*   `src/controllers`: Lógica de controle das requisições.
*   `src/services`: Regras de negócio e acesso ao banco.
*   `src/routes`: Definição de rotas da API.
*   `prisma/`: Esquema do banco e scripts de migração.