# Changelog
Todas as mudanças relevantes neste projeto serão documentadas aqui.

O formato segue as recomendações do **Keep a Changelog** e o versionamento segue **Semantic Versioning**.

---

## [Unreleased]

### Backend
#### Added
- Planejamento para criação de testes unitários para controllers (`aluno`, `usuario`, `escola`, `matricula`).
- Planejamento para criação de pasta de testes isolada em `backend/test/`.

#### Changed
- Sugestão de mover `backend/prisma/client.js` para `backend/src/config/prisma.js`, padronizando a camada de configuração.
- Avaliação para renomear ou dividir `service.js` genérico dentro de `services/`.
- Possível ajuste para tornar `server.js` responsável apenas por iniciar o servidor, deixando configuração completa no `app.js`.

---

### Frontend
#### Changed
- Necessidade de resolver duplicação das estruturas de layout chamadas `MainLayout`:
  - `src/components/layout/MainLayout.jsx`
  - `src/layouts/MainLayout.jsx`
- Planejamento para reorganizar páginas com subpastas de componentes (`pages/Alunos/components/`, etc.).
- Recomenda-se padronizar uso de estilos: trocar CSS global por CSS Modules onde fizer sentido.
- Considerar início de migração gradual para TypeScript.

---

### CSV / Importações
#### Added
- Tarefa para documentar no README o fluxo completo de importação dos arquivos CSV e o uso do script `extract_headers.sh`.

---

### Scripts
#### Changed
- Sugestão de unificar lógica duplicada entre `start_aee.sh` e `start_aee_crostini.sh`.
- Planejamento para adicionar validação prévia nos scripts (checar portas ativas e dependências).

---

### Documentação
#### Added
- Necessidade de criar documentação detalhada da arquitetura geral do monorepo.
- Possibilidade de documentar endpoints da API em Markdown (aluno, matrícula, escola, usuários).

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
