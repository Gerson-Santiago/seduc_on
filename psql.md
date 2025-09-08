# 📌 Banco de Dados – Projeto AEE (Resumo)

### 1. Verificar PostgreSQL

```bash
psql --version        # Deve ser >=16
sudo service postgresql status
sudo service postgresql start
```

### 2. Criar banco e usuário

```bash
sudo -u postgres psql

CREATE DATABASE aee_db;
CREATE USER aee_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE aee_db TO aee_user;
ALTER USER aee_user CREATEDB;

\q
```

### 3. Testar conexão

```bash
psql -U aee_user -h localhost -d aee_db
\dt    # Lista tabelas
```

### 4. Configurar Prisma

No backend, criar/editar `.env`:

```env
DATABASE_URL="postgresql://aee_user:MinhaSenhaSegura123@localhost:5432/aee_db"

# Superadmin do projeto
SUPERADMIN_EMAIL=monitoramento@seducbertioga.com.br
SUPERADMIN_NAME="Prefeitura de Bertioga"
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

