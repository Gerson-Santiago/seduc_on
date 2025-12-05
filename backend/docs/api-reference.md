# Referência da API
> Documentação dos endpoints, autenticação e formatos de resposta da API do SEDUC ON.

## Índice
- [1. Autenticação](#1-autenticação)
- [2. Escolas](#2-escolas)
- [3. Alunos](#3-alunos)
- [4. Gestão de Usuários](#4-gestão-de-usuários)

---

## 1. Autenticação

A API utiliza **Google OAuth 2.0**.
Todas as requisições protegidas devem enviar o token no header:

`Authorization: Bearer <JWT_TOKEN>`

### Login
`POST /api/auth/google`

Troca o token do Google por um JWT da aplicação.

**Payload:**
```json
{ "token": "google_id_token_xyz" }
```

**Resposta (200):**
```json
{
  "token": "eyJhbG...",
  "user": { "id": 1, "email": "user@example.com", "role": "USER" }
}
```

---

## 2. Escolas

### Listar Escolas
`GET /api/escolas`

Retorna lista simples de escolas.

### Estatísticas da Escola
`GET /api/escolas/:id/stats`

Retorna dados agregados (total de alunos, distribuição por modalidade).

**Resposta (200):**
```json
{
  "totalAlunos": 500,
  "porModalidade": {
    "INFANTIL": 150,
    "FUNDAMENTAL": 350
  }
}
```

---

## 3. Alunos

### Estatísticas Globais
`GET /api/alunos/stats`

Retorna o consolidado da rede municipal inteira. Este endpoint é altamente otimizado (cache + índices).

---

## 4. Gestão de Usuários
> Requer `role: ADMIN`

### Listar Usuários
`GET /api/usuarios`

### Criar/Atualizar Usuário
`POST /api/usuarios` | `PUT /api/usuarios/:id`

**Payload:**
```json
{
  "email": "novo@seduc.sp.gov.br",
  "nome": "Fulano",
  "role": "GESTOR" // Opções: USER, ADMIN, GESTOR
}
```

---

## Tratamento de Erros

**Formato padrão de erro:**
```json
{
  "error": "Descrição do erro",
  "details": [ ... ] // Opcional, para validações
}
```
