# Sistema de Visualização de Dados da Educação - Bertioga

Plataforma de inteligência de dados para a Secretaria de Educação de Bertioga.

O projeto tem como objetivo centralizar, organizar e visualizar dados educacionais da rede municipal, oferecendo dashboards intuitivos e relatórios detalhados para apoiar a tomada de decisão.

A ferramenta permite que gestores e educadores acompanhem indicadores chave, visualizem a distribuição de alunos por escola e modalidade (Infantil, Fundamental, EJA, AEE) e gerem relatórios personalizados para monitoramento da rede.

O intuito é promover uma gestão baseada em dados, garantindo transparência e eficiência no planejamento educacional.

---

## 📂 Estrutura do Projeto

*   **`backend/`**: API Node.js/Express para processamento de dados e regras de negócio.
*   **`frontend-aee-vite/`**: Interface interativa em React para visualização de dashboards e relatórios.
*   **`csv/`**: Diretório para carga de dados brutos (importação de alunos).
*   **`scripts/`**: Scripts para processamento de dados e manutenção do sistema.
*   **`MANUAL_ATUALIZACAO.md`**: Guia para atualização da base de dados.

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
Acessar o link da porta 4173 para visualizar o preview.


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
Acessar o link da porta 5173 para o ambiente de desenvolvimento.