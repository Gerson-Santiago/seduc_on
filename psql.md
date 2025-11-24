# 📌 Banco de Dados – Projeto AEE (Manual de Operação)

**Versão Engine:** PostgreSQL 18  
**Data de Atualização:** 24/11/2025

---

## 1. Verificar Status do PostgreSQL

Antes de iniciar, garanta que o cluster versão 18 está rodando na porta padrão (5432).

```bash
# Verificar versão e portas
pg_lsclusters

# Se o 18 estiver "down", inicie:
sudo service postgresql start 18
```

---

## 2. Reset Total e Criação (Comandos SQL)

Caso precise recriar o banco do zero.

### 2.1. Acesse o terminal do Postgres como superusuário

```bash
sudo -u postgres psql
```

### 2.2. Dentro do terminal (postgres=#), cole o bloco abaixo

```sql
/* 1. Derrubar conexões ativas (Segurança para conseguir deletar) */
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE datname = 'aee_db';

/* 2. Limpeza Total (Hard Reset) */
DROP DATABASE IF EXISTS aee_db;
DROP USER IF EXISTS aee_user;

/* 3. Criar Usuário */
/* NOTA: Aqui a senha deve ter a BARRA NORMAL (/) */
CREATE USER aee_user WITH PASSWORD 'SUA_SENHA_AQUI';

/* 4. Permissões de Superadmin (Facilita o ambiente DEV) */
ALTER USER aee_user WITH SUPERUSER;
ALTER USER aee_user CREATEDB;

/* 5. Criar o Banco */
CREATE DATABASE aee_db OWNER aee_user;

/* 6. Sair */
\q
```

---

## 3. Testar Conexão via Terminal

Teste se o usuário consegue entrar no banco usando a senha configurada.

```bash
psql "postgresql://aee_user:SUA_SENHA_AQUI@localhost:5432/aee_db"

# Dica: Use \dt para listar tabelas ou \q para sair
```

---

## 4. Configurar Variáveis de Ambiente (.env)

Conteúdo do arquivo `.env`:

```env
# Conexão com encoding correto (%2F no lugar da barra)
DATABASE_URL="postgresql://aee_user:SUA_SENHA_AQUI@localhost:5432/aee_db"
GOOGLE_CLIENT_ID=TOKEN_AQUI

# Variáveis do Sistema
NODE_ENV=development
PORT=3001


# Configuração do Superadmin (Seed)
SUPERADMIN_EMAIL=email@dominio.com.br
SUPERADMIN_NAME="Admin Name"
```

---

## 5. Sincronizar Prisma (Migrations)

Com o banco criado e o `.env` configurado, aplique a estrutura das tabelas.

```bash
# Entre na pasta do backend
cd backend

# 1. Limpar migrações antigas (se for um reset total)
rm -rf prisma/migrations

# 2. Criar nova migração e aplicar no banco
npx prisma migrate dev --name init_v18
```

---

## 6. Popular Dados (Seed)

Cria o usuário Admin inicial e dados básicos.

```bash
node prisma/seed.js
```

---

## 7. Comandos Úteis do Dia a Dia

### Abrir Interface Visual do Banco

```bash
npx prisma studio
```

### Rodar o Backend

```bash
npm run dev
```

---

## 📝 Observações Importantes

- **Senha com barra (`/`)**: No SQL use `/` normal, mas na URL do `.env` use `%2F`
- **Porta padrão**: PostgreSQL 18 deve estar na porta 5432
- **Ambiente DEV**: O usuário tem privilégios de SUPERUSER para facilitar desenvolvimento
- **Backup**: Sempre faça backup antes de executar comandos DROP