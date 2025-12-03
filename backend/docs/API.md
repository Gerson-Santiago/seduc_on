# Documentação da API - SEDUC ON

Esta documentação descreve os principais endpoints da API do sistema SEDUC ON.

## Autenticação

A API utiliza autenticação via Google OAuth 2.0. O token JWT gerado deve ser enviado no header `Authorization` em todas as requisições protegidas.

**Header:**
`Authorization: Bearer <token>`

### Login
`POST /api/auth/google`

Recebe o token do Google e retorna um JWT da aplicação.

**Body:**
```json
{
  "token": "google_id_token"
}
```

**Response (200):**
```json
{
  "token": "app_jwt_token",
  "user": {
    "id": 1,
    "email": "usuario@seducbertioga.com.br",
    "nome": "Nome do Usuário",
    "role": "USER"
  }
}
```

---

## Escolas

Endpoints para consulta de dados das escolas.

### Listar Escolas
`GET /api/escolas`

Retorna a lista de todas as escolas cadastradas.

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "EM EMEIF BORACEIA",
    "bairro": "BORACEIA"
  },
  ...
]
```

### Estatísticas da Escola
`GET /api/escolas/:id/stats`

Retorna estatísticas detalhadas de uma escola específica.

**Response (200):**
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

## Alunos

### Estatísticas Globais
`GET /api/alunos/stats`

Retorna estatísticas consolidadas de toda a rede.

**Response (200):**
```json
{
  "global": {
    "total": 5000,
    "ano_1": 500,
    ...
  }
}
```

---

## Gestão de Usuários

Endpoints para gerenciamento de usuários (Requer permissão ADMIN).

### Listar Usuários
`GET /api/usuarios`

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "Admin",
    "email": "admin@seducbertioga.com.br",
    "role": "ADMIN"
  }
]
```

### Criar Usuário
`POST /api/usuarios`

**Body:**
```json
{
  "email": "novo@seducbertioga.com.br",
  "nome": "Novo Usuário",
  "role": "USER" // Opcional (Default: USER)
}
```

### Atualizar Usuário
`PUT /api/usuarios/:id`

**Body:**
```json
{
  "nome": "Nome Atualizado",
  "role": "GESTOR"
}
```

---

## Tratamento de Erros

A API retorna erros no seguinte formato padrão:

**Erro Genérico (4xx/5xx):**
```json
{
  "error": "Mensagem de erro descritiva"
}
```

**Erro de Validação (400):**
```json
{
  "error": "Validation Error",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```
