# 📌 Banco de Dados – Projeto AEE (Resumo)

### 1. Verificar PostgreSQL

```bash
psql --version        # Deve ser >=1
sudo service postgresql status
sudo service postgresql start
```

### 2. Criar banco e usuário

```bash
sudo -u postgres psql

CREATE DATABASE banco_db;
CREATE USER criar_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE banco_db TO criar_user;
ALTER USER criar_user CREATEDB;

\q
```

### 3. Testar conexão

```bash
psql -U criar_user -h localhost -d banco_db
\dt    # Lista tabelas
```

### 4. Configurar Prisma

No backend, criar/editar `.env`:

```env
DATABASE_URL="postgresql://criar_user:sua_senha_segura@localhost:PORT/banco_db"

# Superadmin do projeto
SUPERADMIN_EMAIL=email@dominio.com
SUPERADMIN_NAME="Nome do Superadmin"
```

### 5. Rodar migrations e gerar client

```bash
cd backend
npx prisma migrate dev --name init
```

### 6. Popular e visualizar dados

```bash
node prisma/seed.js
npx prisma studio
```

✅ Banco pronto para desenvolvimento do projeto AEE.

