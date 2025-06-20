# Sistema de Acompanhamento AEE
Atualizado em 20 de jun 2025
Sistema de Acompanhamento de Alunos em Processo de Avaliação Educacional Especializada.

O projeto tem como objetivo centralizar, organizar e acompanhar o processo de observação, intervenção e encaminhamento de alunos da rede municipal de ensino que apresentam indícios de necessidades educacionais especiais.

A plataforma será utilizada por professores, gestores escolares e equipes multiprofissionais (como psicólogos, fonoaudiólogos e psicopedagogos), permitindo o registro de observações pedagógicas, histórico de encaminhamentos, ações realizadas e datas importantes. O sistema também ajuda a monitorar prazos e evitar que casos fiquem sem acompanhamento por longos períodos.

O intuito é garantir um processo mais eficiente, transparente e colaborativo entre escola, família e equipe técnica, promovendo um atendimento mais ágil e eficaz às necessidades de cada aluno.

---

## Tecnologias usadas

### Backend (Node.js)

- express@5.1.0
- prisma@6.9.0 (ORM para PostgreSQL)
- @prisma/client@6.9.0
- cors@2.8.5
- dotenv@16.5.0
- helmet@8.1.0
- jsonwebtoken@9.0.2
- morgan@1.10.0
- nodemon@3.1.10
- google-auth-library@10.1.0
- uuid@11.1.0
- gh-pages@6.3.0

### Frontend (React + Vite)

- react@19.1.0
- react-dom@19.1.0
- react-router-dom@7.6.2
- vite@6.3.5
- @vitejs/plugin-react@4.5.2
- @react-oauth/google@0.12.2
- eslint@9.29.0 e plugins relacionados

---

## Estrutura do projeto

- `/src`: código backend em Node.js (routes, controllers, services, utils)
- `/prisma`: schema e seed do banco PostgreSQL
- `/frontend-aee-vite`: frontend React com Vite
- `/csv`: arquivos CSV para importação inicial de dados
- `/credentials`: credenciais sensíveis (não versionadas)

---

## Como rodar

1. Instalar dependências backend e frontend em suas respectivas pastas.
2. Configurar variáveis de ambiente em `.env`.
3. Rodar banco PostgreSQL (usando Prisma).
4. Iniciar backend: `npm run dev` (ou conforme script configurado).
5. Iniciar frontend: `npm run dev` dentro da pasta `frontend-aee-vite`.
