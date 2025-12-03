# Análise de Arquitetura de Variáveis de Ambiente - SEDUC ON

**Data:** 03/12/2025
**Solicitante:** CTO / Lead Developer
**Contexto:** Avaliação da estratégia de múltiplos arquivos `.env` (Frontend/Backend) vs Arquivo Único na raiz.

---

## 1. Estado Atual (Mapeamento)

Atualmente, o projeto utiliza uma estratégia de **Configuração Distribuída**:

### 📂 Backend (`/backend/.env*`)
*   **Arquivos:** `.env`, `.env.dev`, `.env.preview`, `.env.example`
*   **Conteúdo Típico:** Segredos de banco (`DATABASE_URL`), chaves de API (`GOOGLE_CLIENT_ID`), segredos de sessão (`JWT_SECRET`).
*   **Carregamento:** Via biblioteca `dotenv` no `server.js` ou scripts de inicialização.

### 📂 Frontend (`/frontend/.env*`)
*   **Arquivos:** `.env`, `.env.development`, `.env.preview`, `.env.example`
*   **Conteúdo Típico:** URLs públicas (`VITE_API_URL`), flags de feature (`VITE_ENABLE_DASHBOARD`).
*   **Carregamento:** Nativo do **Vite**, que injeta no build apenas variáveis iniciadas com `VITE_`.

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

**Conclusão:** Mudar para um `.env` único traria conveniência marginal em troca de **riscos de segurança significativos** e **dívida técnica** no deploy. **Não recomendo a migração.**
