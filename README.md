# Sistema de Acompanhamento AEE

Sistema de Acompanhamento de Alunos em Processo de Avaliação Educacional Especializada.

O projeto tem como objetivo centralizar, organizar e acompanhar o processo de observação, intervenção e encaminhamento de alunos da rede municipal de ensino que apresentam indícios de necessidades educacionais especiais.

A plataforma será utilizada por professores, gestores escolares e equipes multiprofissionais (como psicólogos, fonoaudiólogos e psicopedagogos), permitindo o registro de observações pedagógicas, histórico de encaminhamentos, ações realizadas e datas importantes. O sistema também ajuda a monitorar prazos e evitar que casos fiquem sem acompanhamento por longos períodos.

O intuito é garantir um processo mais eficiente, transparente e colaborativo entre escola, família e equipe técnica, promovendo um atendimento mais ágil e eficaz às necessidades de cada aluno.

---

## 🔧 1. Frontend em modo `preview`

```bash
cd ~/aee/frontend-aee-vite
rm -rf dist
npm run build:preview
npm run preview
```

## 🔧 2. Backend em modo `preview`

```bash
cd ~/aee
npm run preview
````
Console esperado:

```bash
NODE_ENV: preview
ALLOWED_ORIGINS: [ 'http://localhost:4173' ],
```
Acessar o link da port 4173 vc está no preview


---

## ⚙️ Para `development`

### Frontend

```bash
cd ~/aee/frontend-aee-vite
npm run dev
```


### Backend

```bash
cd ~/aee
npm run dev
```

Console esperado:

```bash
NODE_ENV: dev
ALLOWED_ORIGINS: [ 'http://localhost:5173' ],
```
Acessar o link da port 5173 vc está no preview