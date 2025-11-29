# 📌 Banco de Dados – Projeto AEE (Manual de Operação)

**Versão Engine:** PostgreSQL 18  
**Data de Atualização:** 29/11/2025

Este documento unifica as instruções de infraestrutura (setup/reset) e de operação de dados (importação/atualização de alunos).

---

# PARTE 1: Infraestrutura e Manutenção

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

Para alterar a senha do banco de dados:
```bash
sudo -u postgres psql
ALTER USER aee_user WITH PASSWORD 'NOVA_SENHA_SEGURA';
\q
```

---

## 3. Testar Conexão via Terminal

Teste se o usuário consegue entrar no banco usando a senha configurada.

```bash
psql "postgresql://aee_user:SUA_SENHA_AQUI@localhost:5432/aee_db"

# Dica: Use \dt para listar tabelas ou \q para sair
# Se entrou em aee_db=# indica que a senha esta ok
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

## 6. Popular Dados Iniciais (Seed)

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

# PARTE 2: Importação e Atualização de Dados (CSV)

Esta seção guia a manutenção e atualização periódica dos dados dos alunos no sistema, a partir do arquivo CSV.

## 1. Arquivos Necessários

Para que o processo de atualização funcione, os seguintes arquivos são essenciais:

1.  **`csv/ALUNOS.csv`**: O arquivo de dados brutos. É aqui que você deve colocar a nova versão da planilha.
2.  **`backend/prisma/import_students.js`**: O script principal que lê o CSV, limpa os dados e os distribui nas tabelas.
3.  **`backend/prisma/verify_migration.js`**: Script auxiliar para conferir os números após a atualização.

## 2. Procedimento de Atualização (Passo a Passo)

Quando receber uma nova planilha `ALUNOS.csv` atualizada:

### Passo 1: Atualizar o Arquivo CSV
Substitua o arquivo antigo pelo novo na pasta `csv/`.
*   **Nome do arquivo**: Deve ser exatamente `ALUNOS.csv`.
*   **Local**: Pasta `csv` na raiz do projeto (`/home/sant/aee/csv/`).

### Passo 2: Executar o Script de Importação
Abra o terminal, navegue até a pasta `backend` e rode o comando:

```bash
cd backend
node --env-file=.env prisma/import_students.js
```

**O que este comando faz?**
*   Limpa as tabelas atuais (`alunos_integracao_all`, `alunos_regular...`, `alunos_aee`, `alunos_eja`).
*   Lê o novo `ALUNOS.csv`.
*   Insere tudo na tabela de integração.
*   Redistribui os alunos para as tabelas corretas.

### Passo 3: Verificar os Resultados
Para confirmar que tudo correu bem:

```bash
node --env-file=.env prisma/verify_migration.js
```

Verifique se os números fazem sentido (ex: total de alunos importados vs total no CSV).

## 3. Solução de Problemas Comuns

*   **Erro de Data (`Invalid Date`)**: Verifique se o formato no CSV mudou (esperado `DD/MM/AAAA`).
*   **Erro de Conexão (`DATABASE_URL`)**: Certifique-se de que o arquivo `.env` está correto.
*   **Tabelas Vazias**: Se a importação rodar mas as tabelas ficarem vazias, verifique se os nomes dos "Tipos de Ensino" no CSV mudaram.

---

## 📝 Observações Importantes Gerais

- **Senha com barra (`/`)**: No SQL use `/` normal, mas na URL do `.env` use `%2F`.
- **Porta padrão**: PostgreSQL 18 deve estar na porta 5432.
- **Ambiente DEV**: O usuário tem privilégios de SUPERUSER para facilitar desenvolvimento.
- **Backup**: Sempre faça backup antes de executar comandos DROP.