# Changelog
Todas as mudanças relevantes neste projeto serão documentadas aqui.

O formato segue as recomendações do **Keep a Changelog** e o versionamento segue **Semantic Versioning**.

---

## [Unreleased]

### SEDUC ON (Rebranding)
- **[RENOMEADO]** Projeto renomeado de "AEE" para "SEDUC ON".
- **[RENOMEADO]** Script de inicialização `start_aee.sh` para `start_seduc_on.sh`.
- **[ATUALIZADO]** Documentação e descrições do projeto.

### Backend
#### Added
- **[NOVO]** Endpoint `/alunos/stats` para estatísticas agrupadas por escola e tipo de ensino.
- **[NOVO]** Script `import_students.js` para migração e distribuição de dados do CSV.
- **[NOVO]** Tabelas no Prisma: `alunos_integracao_all`, `alunos_regular_ei_ef9`, `alunos_aee`, `alunos_eja`.
- **[NOVO]** Pasta `backend/prisma/sql/` para organizar scripts SQL.

#### Changed
- **[CONCLUÍDO]** Movido `backend/prisma/client.js` para `backend/src/config/prisma.js` para padronizar a camada de configuração.
- **[REMOVIDO]** Arquivos redundantes na raiz (`client.js`, `prisma.js`).
- **[REMOVIDO]** Arquivos CSS não utilizados (`Sidebar.module.css`, `TopBar.module.css`).

### Frontend
#### Added
- **[NOVO]** Página `Alunos` com dashboard de estatísticas e listagem filtrável.
- **[NOVO]** Componentes de tabela e cards de estatísticas.

#### Changed
- Atualização do `Sidebar` para incluir link funcional para a página de Alunos.

### Scripts
#### Changed
- **[ORGANIZAÇÃO]** Criada pasta `scripts/` na raiz.
- **[MOVIDO]** `audit_all.sh` e `clean_csv.js` movidos para `scripts/`.

### Documentação
#### Added
- **[NOVO]** `MANUAL_ATUALIZACAO.md` na raiz com instruções para atualização de dados via CSV.

---

## Estrutura Atual (Resumo)
- Backend bem organizado seguindo padrão Controllers → Services → Routes.
- Frontend estruturado em módulos e páginas claras.
- Conjunto de scripts auxiliares funcionando para ambiente Debian/Crostini.
- Uso de CSVs padronizados para importação de dados da Secretaria.

---

## Observações Gerais
O monorepo apresenta boa organização e separação entre frontend, backend, scripts e testes. Há oportunidades de melhoria relacionadas à padronização, documentação e testes.

---
