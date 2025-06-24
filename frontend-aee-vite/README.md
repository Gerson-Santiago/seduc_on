# Revisão do Projeto Frontend AEE (React + Vite)

Este documento serve como guia de revisão e checklist para o projeto frontend do Sistema AEE, utilizando React com Vite, autenticação via Google OAuth 2.0, e roteamento dinâmico por ambiente.

---

## ✅ 1. Contexto de Autenticação

**Arquivo:** `src/context/AuthContext.jsx`

* [x] Armazena e restaura sessão via `localStorage` (`aee_user`).
* [x] Faz login via POST para `/usuarios/login` com `id_token`.
* [x] Recupera dados do usuário via `/usuarios/me` usando Bearer Token.
* [x] Função `loginRedirect()` monta a URL de login dinâmica com base no `window.location.origin`.
* [x] `GOOGLE_CLIENT_ID` e `API_BASE_URL` são lidas via `import.meta.env`.

## ✅ 2. Callback de Login

**Arquivo:** `src/components/AuthCallback.jsx`

* [x] Extrai `id_token` da hash da URL.
* [x] Chama `login({ credential: idToken })` do contexto.
* [x] Redireciona para `/dashboard2` após sucesso.
* [x] Se falhar, redireciona para `/login`.

## ✅ 3. Variáveis de Ambiente e Configuração do Vite

**Arquivos:** `vite.config.*.js`

* [x] Configura “`base`" correto em cada ambiente (`/` para local, `/aee/` para GitHub Pages, etc.).
* [x] Scripts no `package.json` permitem rodar com `--mode` correto:

```json
"scripts": {
  "dev": "vite --mode development",
  "preview": "vite preview --mode preview",
  "build:github": "vite build --mode github",
  "serve:prod": "npx serve -s dist -l 5000"
}
```

## ✅ 4. Componentes de UI

* `Sidebar.jsx` com controle de colapso e darkMode.
* `TopBar.jsx` exibe `UserDropdown` com dados do usuário.
* `UserDropdown.jsx` exibe avatar, nome, email, cargo e botão de logout.

## ✅ 5. Navegação com React Router

* [x] `useNavigate()` usado corretamente.
* [x] `navigate(import.meta.env.VITE_LOGIN_PATH)` usado em `Home.jsx`.
* [x] `basename` do router configurado dinamicamente em `main.jsx` (se aplicável).

## ✅ 6. Fluxo de Login

```text
[Usuário clica em Login] ->
[Redireciona para Google] ->
[Google retorna com id_token na hash] ->
[AuthCallback extrai token e faz login na API] ->
[Salva user no localStorage e redireciona para dashboard]
```

---

## 🌐 Sugestões de Melhorias Futuras

* [ ] Tratar erros de login com mensagens amigáveis.
* [ ] Criar componente de loading centralizado (`<LoadingScreen />`).
* [ ] Centralizar lógica de redirecionamento em um `ProtectedRoute.jsx`.
* [ ] Adicionar refresh de token, se o backend suportar.
