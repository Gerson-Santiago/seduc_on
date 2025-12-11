# Frontend Engineering Handbook

**Classificação:** Client-Side Architecture
**Framework:** React 18 + Vite
**Estilo:** CSS Modules & Utility-First

Este documento serve como guia técnico para o desenvolvimento da interface SPA (Single Page Application) do SEDUC ON.

## 1. Arquitetura de Aplicação

O frontend opera como uma **Lazy-Loaded SPA**, consumindo a API REST do backend via HTTPS. A segurança é delegada ao navegador através de Cookies HttpOnly.

### 1.1 Stack Tecnológica
*   **Runtime:** Vite (ESBuild) - Build tool de alta performance.
*   **Core:** React 18 (Functional Components & Hooks).
*   **Routing:** React Router DOM v6.
*   **State Management:** React Context API (Para Auth Global e Preferências de UI).
*   **Data Fetching:** Axios (Instance configurada com Interceptors).

### 1.2 Integração com Backend
A comunicação segue o padrão **BFF (Backend for Frontend)** implícito, onde a API serve dados formatados para consumo direto.

*   **Auth Flow:**
    1.  User clica em "Entrar com Google".
    2.  Frontend inicia OAuth Popup/Redirect.
    3.  Callback do Google posta credencial para Backend (`/api/auth/google-login`).
    4.  Backend responde com `200 OK` e `Set-Cookie`.
    5.  Frontend redireciona para `/dashboard` (Protegido via `AuthContext`).

## 2. Estrutura de Diretórios (Source Tree)

A organização segue fractal por funcionalidade e tipo técnico.

*   `src/components`: UI Kits puros e reutilizáveis (Stateless).
    *   `src/components/Charts`: Wrapper para Chart.js.
*   `src/pages`: Views de Roteamento (Stateful).
*   `src/context`: Provedores de Estado Global.
    *   `AuthContext.jsx`: Gestão de Sessão e Usuário.
*   `src/services`: Camada de Abstração de API.
    *   `api.js`: Instância Axios Singleton com `credentials: true`.

## 3. Guia de Desenvolvimento

### 3.1 Setup Local
Requer que o Backend esteja rodando na porta `3001` (ou conforme `.env`).

```bash
cd frontend
npm install
npm run dev
```

### 3.2 Variáveis de Ambiente
Consulte [ENV_VARS.md](../ENV_VARS.md) na raiz do projeto. Variáveis devem ser prefixadas com `VITE_`.

### 3.3 Testes E2E
A suíte de testes de interface localiza-se na raiz do projeto (compartilhada ou isolada) e utiliza **Playwright**.

```bash
npx playwright test
```

## 4. Build & Deploy

O processo de build gera ativos estáticos otimizados em `/dist`.

```bash
npm run build
# Output: /dist (index.html, assets/*.js, assets/*.css)
```

**Nota de Deploy:** Em produção, esta pasta deve ser servida por um servidor web (Nginx/Apache) ou CDN, com fallback para `index.html` (SPA Routing).
