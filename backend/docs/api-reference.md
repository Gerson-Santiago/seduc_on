# Referência da API (Backend)

**Data da Última Atualização:** Dezembro 2025

Documentação dos padrões de comunicação e principais endpoints da API do SEDUC ON.

## 📡 Padrões de Comunicação

### Base URL
Todas as rotas da API são prefixadas com `/api`.
Exemplo: `http://localhost:3000/api/alunos`

### Formato de Resposta
A API utiliza JSON para todas as respostas.

**Sucesso (200 OK):**
```json
{
  "data": { ... }, // Objeto ou Lista
  "meta": {        // Metadados (opcional, p/ paginação)
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

**Erro (4xx/5xx):**
```json
{
  "error": "Descrição do erro",
  "details": "Mensagem técnica (apenas em ambiente de DEV)"
}
```

## 🔐 Autenticação

A segurança é gerenciada via **Google OAuth 2.0**.
*   O frontend envia um `credential` (token JWT do Google).
*   O backend valida o token e cria uma sessão interna.

## 🗺 Principais Endpoints

### Alunos (`/api/alunos`)
*   `GET /`: Lista alunos com filtros (nome, escola, série). Suporta paginação.
*   `GET /:ra`: Busca detalhes de um aluno específico pelo RA.
*   `GET /stats`: Estatísticas agregadas (alunos por escola, série).
*   `POST /`: Cria um novo aluno (Utiliza `AlunoService`).
*   `PUT /:ra`: Atualiza dados de um aluno.
*   `DELETE /:ra`: Remove um aluno.

### Autenticação (`/api/auth`)
*   `POST /google-login`: Valida credenciais do Google e inicia sessão.
*   `POST /logout`: Encerra a sessão.

### Escolas (`/api/escolas`)
*   `GET /`: Lista todas as escolas cadastradas.

## 🧩 Arquitetura MSC na API

Os Controllers (`src/controllers`) **nunca** executam regras de negócio.
1.  **Controller:** Recebe `req`, valida *inputs* básicos.
2.  **Service:** Chamado pelo Controller. Executa a lógica (ex: verificar duplicidade).
3.  **Controller:** Formata o retorno do Service para JSON e envia `res`.
