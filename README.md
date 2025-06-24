# Sistema de Acompanhamento AEE
Sistema de Acompanhamento de Alunos em Processo de Avaliação Educacional Especializada
O projeto tem como objetivo centralizar, organizar e acompanhar o processo de observação, intervenção e encaminhamento de alunos da rede municipal de ensino que apresentam indícios de necessidades educacionais especiais.

A plataforma será utilizada por professores, gestores escolares e equipes multiprofissionais (como psicólogos, fonoaudiólogos e psicopedagogos), permitindo o registro de observações pedagógicas, histórico de encaminhamentos, ações realizadas e datas importantes. O sistema também ajuda a monitorar prazos e evitar que casos fiquem sem acompanhamento por longos períodos.

O intuito é garantir um processo mais eficiente, transparente e colaborativo entre escola, família e equipe técnica, promovendo um atendimento mais ágil e eficaz às necessidades de cada aluno.




## 🔧 1. Backend em modo `preview`

1. Abra um terminal na raiz do seu backend (`~/aee`):
   cd ~/aee
   npm run preview
2. Console -->  NODE_ENV: preview
                ALLOWED_ORIGINS: [ 'http://localhost:4173' ],


## 🔧 2. Frontend em modo `preview`

1. Abra um terminal na pasta frontend-aee-vite
   cd ~/aee/frontend-aee-vite
   rm -rf dist
   npm run build:preview 
   npm run preview

## Para `development`
   cd ~/aee
   npm run dev
   Console -->  NODE_ENV: preview
                ALLOWED_ORIGINS: [ 'http://localhost:5173' ],
   
   cd ~/aee/frontend-aee-vite
   npm run dev