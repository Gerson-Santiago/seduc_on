# Análise de Arquitetura de Variáveis de Ambiente - SEDUC ON

**Data:** 03/12/2025
**Solicitante:** CTO / Lead Developer
**Contexto:** Avaliação da estratégia de múltiplos arquivos `.env` (Frontend/Backend) vs Arquivo Único na raiz.

---

## 1. Estado Atual (Mapeamento)

Atualmente, o projeto utiliza uma estratégia de **Configuração Distribuída**:

### 📂 Backend (`/backend/.env*`)
*   **Arquivos:** `.env`, `.env.dev` (usado no script `dev`), `.env.preview`, `.env.example`
*   **Conteúdo Típico:** Segredos de banco (`DATABASE_URL`), chaves de API (`GOOGLE_CLIENT_ID`), segredos de sessão (`JWT_SECRET`).
*   **Carregamento:** Nativo do Node.js via flag `--env-file` nos scripts do `package.json`.

### 📂 Frontend (`/frontend/.env*`)
*   **Arquivos:** `.env`, `.env.development` (Padrão Vite), `.env.preview`, `.env.example`
*   **Conteúdo Típico:** URLs públicas (`VITE_API_URL`), flags de feature (`VITE_ENABLE_DASHBOARD`).
*   **Carregamento:** Automático pelo **Vite** baseado no `--mode`.

---

## 2. Análise Técnica (Engenharia de Software)

### 2.1 Princípio "The Twelve-Factor App"
A metodologia *12-Factor* (padrão ouro para apps modernos) dita que **"A configuração deve ser armazenada no ambiente"**.
*   Os arquivos `.env` não são a configuração em si, mas uma facilidade para *carregar* o ambiente em desenvolvimento.
*   **Separação de Responsabilidades:** O Frontend e o Backend são aplicações distintas, com ciclos de vida e requisitos de segurança diferentes.

### 2.2 Comparativo de Estratégias

| Critério | Estratégia Atual (Separados) | Estratégia Unificada (Raiz) |
| :--- | :--- | :--- |
| **Segurança** | ✅ **Alta**. Segredos do backend ficam isolados fisicamente do frontend. | ⚠️ **Risco Médio**. Mistura segredos de banco com variáveis públicas. Risco de vazamento se o bundler (Vite) for mal configurado. |
| **Acoplamento** | ✅ **Baixo**. Backend pode ser movido para outro repo sem quebrar config. | ❌ **Alto**. Cria dependência de um arquivo externo à pasta do serviço. |
| **DX (Dev Experience)** | 😐 **Médio**. Precisa configurar 2 arquivos. | ✅ **Alta**. Um único lugar para editar portas e URLs. |
| **CI/CD (Deploy)** | ✅ **Padrão**. Pipelines de deploy costumam injetar vars por serviço. | ⚠️ **Complexo**. Precisa de scripts para "fatiar" o env único para cada serviço no deploy. |

---

### 2.3 Validação Específica do Frontend (Vite Modes)

O usuário questionou a necessidade de arquivos como `.env.dev`, `.env.preview` no Frontend.
**Análise:** Esta prática é **CORRETA e NECESSÁRIA** para o Vite.

No `package.json` do frontend, temos scripts explícitos:
*   `"dev": "vite --mode development"` -> Carrega `.env.development`
*   `"build:preview": "vite build --mode preview"` -> Carrega `.env.preview`

**Por que isso é bom?**
*   Permite apontar para backends diferentes (Local vs Staging vs Produção) sem mudar código.
*   O Vite "assa" (bakes) essas variáveis no código HTML/JS final durante o build.
*   **Veredito:** Manter esses arquivos é essencial para o fluxo de build atual.

---

## 3. Impactos de uma Migração (Para Arquivo Único)

Se decidirmos migrar para um único `.env` na raiz, os seguintes impactos ocorrerão:

### 🔧 Impactos no Código
1.  **Backend (`server.js`):**
    *   Alterar `dotenv.config()` para apontar para `path.resolve(__dirname, '../.env')`.
2.  **Frontend (`vite.config.js`):**
    *   Configurar `envDir: '../'` para o Vite ler da raiz.
3.  **Scripts (`package.json`):**
    *   Scripts que dependem de variáveis (como Prisma) precisariam carregar explicitamente o arquivo da raiz (`dotenv -e ../.env -- prisma ...`).

### 🛡️ Riscos de Segurança (Crítico)
*   O Vite expõe automaticamente variáveis `VITE_`. Se, por erro humano, alguém nomear a senha do banco como `VITE_DB_PASSWORD`, ela será **exposta publicamente no navegador** de todos os usuários.
*   Manter arquivos separados previne esse erro categoricamente (o Vite nem tem acesso ao arquivo do backend).

---

## 4. Veredito e Recomendação Profissional

Baseado em práticas de segurança (OWASP) e arquitetura de microsserviços/monorepo:

### 🏆 Recomendação: MANTER ESTRUTURA ATUAL (Separada)

**Justificativa:**
1.  **Segurança em Primeiro Lugar:** O isolamento de contextos (Cliente vs Servidor) é a barreira de segurança mais eficaz contra vazamento de credenciais.
2.  **Padrão da Indústria:** Frameworks modernos (Next.js, NestJS, Vite) encorajam arquivos `.env` na raiz *de cada aplicação*, não do monorepo.
3.  **Escalabilidade:** Se amanhã o Backend for para um servidor AWS e o Frontend para Vercel, a estrutura separada já está pronta. A unificada exigiria refatoração.

### Sugestão de Melhoria (Sem mudar a estrutura)
Para mitigar a "dor" de gerenciar dois arquivos, podemos criar um script de **validação** (`scripts/check_env.js`) que garante que as variáveis necessárias (como portas compartilhadas) estejam sincronizadas, sem misturar os arquivos.

---

---

## 5. Padrões de Indústria e Soluções de Mercado

### 5.1 O Padrão Vite (Frontend) 🌟
O Vite possui um sistema de "Modos" nativo que é considerado o **Padrão de Indústria** para SPAs (Single Page Applications).

**Como funciona:**
Ao contrário do Backend, o Frontend não tem acesso a variáveis de sistema no navegador do usuário. As variáveis precisam ser "embutidas" (baked) no código HTML/JS durante a construção (build).

**Estrutura Padrão Vite:**
*   `.env` (Carregado em todos os casos)
*   `.env.local` (Ignorado pelo Git, sobreposições locais)
*   `.env.[mode]` (Carregado apenas no modo específico)

**Por que ter vários arquivos no Frontend?**
É a única forma de gerar builds diferentes para ambientes diferentes sem mudar o código:
1.  **`npm run dev`** (Mode: `development`) -> Lê `.env.development` -> Aponta para `localhost:3001`
2.  **`npm run build:preview`** (Mode: `preview`) -> Lê `.env.preview` -> Aponta para `staging-api.seduc.com`
3.  **`npm run build`** (Mode: `production`) -> Lê `.env.production` -> Aponta para `api.seduc.com`

**Veredito:** A estrutura atual do projeto (`.env.preview`, `.env.development`) segue **exatamente** a documentação oficial do Vite.

### 5.2 O Padrão Node.js (Backend) 🛡️
No Backend, a história é diferente. O servidor lê variáveis em tempo de execução.

**Cenários Comuns:**
1.  **Desenvolvimento Local:** Uso de `.env` e `.env.test` é padrão para facilitar a troca de bancos de dados.
2.  **Produção (Cloud/Docker):** O padrão de ouro é **NÃO TER ARQUIVO .ENV**.
    *   As variáveis são injetadas pela plataforma (AWS Secrets, Kubernetes, Heroku).
    *   No nosso caso (VPS/VM), o uso de um arquivo `.env` protegido (chmod 600) é aceitável e comum.

### 5.3 Comparativo de Soluções para Monorepos

| Solução | Descrição | Prós | Contras | Adequação ao Projeto |
| :--- | :--- | :--- | :--- | :--- |
| **1. Isolada (Atual)** | Cada pasta (`frontend`, `backend`) tem seus próprios `.env`. | Segurança máxima, desacoplamento, padrão nativo das ferramentas. | Repetição de variáveis comuns (ex: PORT). | ⭐⭐⭐⭐⭐ (Ideal) |
| **2. Centralizada (Root)** | Um único `.env` na raiz do projeto. | Fácil de editar, sem duplicação. | Mistura segredos (Backend) com públicos (Frontend). Risco de vazamento. Requer scripts extras. | ⭐⭐ (Arriscado) |
| **3. Workspace Config** | Um pacote compartilhado (`packages/config`) que exporta constantes. | Tipagem forte, validação centralizada. | Alta complexidade de setup (npm workspaces, TS references). Overkill para 2 serviços. | ⭐ (Exagero) |
| **4. Env Vault** | Uso de ferramentas como Doppler ou Vault. | Segurança nível bancário, rotação de chaves. | Custo e complexidade de infraestrutura. | ⭐ (Desnecessário) |

---

## 6. Conclusão Final

A estrutura atual do projeto **SEDUC ON** não é apenas "aceitável", ela é a **Recomendada** para a escala e tecnologias utilizadas.

*   **Frontend:** Segue o padrão Vite de Modes (`.env.[mode]`).
*   **Backend:** Segue o padrão Node.js de isolamento (`dotenv`).

**Ação Recomendada:** Manter como está. Não há ganho técnico em alterar essa estrutura, apenas riscos.
