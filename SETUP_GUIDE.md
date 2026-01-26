# Guia de Configuração e Criação de Usuários

Este guia cobre as credenciais de banco de dados, variáveis de ambiente críticas e como criar o primeiro usuário (Superadmin).

## 1. Banco de Dados e Credenciais

Se você está usando **Docker**, o banco de dados já vem configurado automaticamente.

### Credenciais Padrão (Docker)
Estão definidas no `docker-compose.yml`.
- **Host**: `db` (nome do container)
- **Porta**: `5432`
- **User**: `user`
- **Password**: `password`
- **Database**: `seduc_db`

> **Nota:** Não é necessário criar o banco manualmente; o container do Postgres faz isso ao iniciar pela primeira vez.

---

## 2. Configurando o `.env` (Backend)

Crie/edite o arquivo `backend/.env` com base no `.env.example`. Aqui estão as variáveis essenciais:

### Conexão com Banco (Docker)
Se rodando via Docker, a URL deve apontar para o container `db`:
```ini
DATABASE_URL="postgresql://user:password@db:5432/seduc_db?schema=public"
```

### Segurança (Segredos)
Estas variáveis **não** têm padrão e você deve definir:

1.  **`JWT_SECRET`**:
    *   **O que é**: Senha usada para assinar os tokens de login.
    *   **Como gerar**: Digite no terminal: `openssl rand -base64 32` e cole o resultado.
    *   **Exemplo**: `JWT_SECRET=aB3dE5...`

2.  **`GOOGLE_CLIENT_ID`** & **`GOOGLE_REDIRECT_URI`**:
    *   Obtenha no [Google Cloud Console](https://console.cloud.google.com/).
    *   A URI deve ser: `http://localhost:5173` (ou a URL de produção).

### Usuário Superadmin (Primeiro Acesso)
Defina quem será o primeiro administrador criado automaticamente:
```ini
SUPERADMIN_EMAIL=seu.email@exemplo.com
SUPERADMIN_NAME="Seu Nome"
```

---

## 3. Gerando Usuários (Seeding)

O sistema possui um script que lê as variáveis `SUPERADMIN_...` do arquivo `.env` e cria esse usuário no banco se ele não existir.

### Opção A: Rodando via Docker (Recomendado)
Com o docker compose rodando, execute:

```bash
# 1. Entre no container do backend
docker compose exec backend sh

# 2. Rode o seed (dentro do container)
npm run prisma:seed

# 3. Saia do container
exit
```

### Opção B: Rodando Localmente
Se você tem Node.js e Postgres instalados na sua máquina:

```bash
cd backend
npm run prisma:seed
```

### Resultado
O script irá imprimir:
> `Superadmin criado: seu.email@exemplo.com`

Agora você pode fazer login no Frontend com este email.
