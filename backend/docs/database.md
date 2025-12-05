# Banco de Dados e Arquitetura

> Guia para operação, manutenção (ETL) e referência arquitetural do banco de dados.

## Índice
- [1. Infraestrutura e Comandos](#1-infraestrutura-e-comandos)
- [2. Carga de Dados (ETL)](#2-carga-de-dados-etl)
- [3. Diagnóstico e Arquitetura](#3-diagnóstico-e-arquitetura)

---

## 1. Infraestrutura e Comandos

**Engine:** PostgreSQL 18  
**Porta Padrão:** 5432

### Verificar Status
```bash
pg_lsclusters
# Se estiver "down":
sudo service postgresql start 18
```

### Configuração (.env)
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_banco"
```

### Comandos Úteis (Desenvolvimento)

**Hard Reset (Recriar Banco):**
```bash
# 1. Acessar postgres
sudo -u postgres psql

# 2. Executar
DROP DATABASE IF EXISTS seduc_on;
CREATE DATABASE seduc_on OWNER seduc_user;
```

**Rodar Migrations e Seed:**
```bash
cd backend
npx prisma migrate dev --name init
node prisma/seed.js
```

**Verificar Dados (GUI):**
```bash
npx prisma studio
```

---

## 2. Carga de Dados (ETL)

O sistema atualiza seus dados processando arquivos CSV fornecidos pela secretaria.

### Arquivos Fonte (`/csv`)
| Arquivo | Destino Principal |
| :--- | :--- |
| `dados_das_escolas.csv` | Tabela `dados_das_escolas` |
| `ALUNOS.csv` | Tabelas de alunos (Regular, AEE, EJA) |
| `consulta_matricula.csv` | Tabela `consulta_matricula` |

### Como Atualizar (Script Unificado)
Para atualizar toda a base com os CSVs mais recentes:

1.  Coloque os novos arquivos na pasta `csv/`.
2.  Execute o script mestre:

```bash
cd backend
node scripts/atualizar_banco.js
```

**O que este script faz:**
1.  Limpa (Truncate) as tabelas alvo.
2.  Importa em lotes (streaming) para evitar estouro de memória.
3.  Distribui alunos para tabelas específicas baseadas na modalidade.

---

## 3. Diagnóstico e Arquitetura

Esta seção resume a análise técnica do schema atual e o plano de evolução.

### Problemas Críticos Atuais
1.  **Sem Foreign Keys Nativas:** O projeto usa `relationMode = "prisma"`, emulando relações no código. Isso impede otimizações do banco e não garante integridade forte.
2.  **Dados Desnormalizados:** Tabelas de alunos repetem `nome_escola`, `turma`, etc.
3.  **Falta de Tabela de Turmas:** Dados de turmas estão espalhados como strings nos alunos.

### Arquitetura Alvo (Futuro)
O objetivo é migrar para um modelo **3NF (Terceira Forma Normal)**.

```mermaid
graph TD
    Escolas[Escolas] -->|1:N| Turmas[Turmas]
    Turmas -->|1:N| Alunos[Alunos Normalizados]
    Turmas -->|1:1| Matriculas[Matrículas]
```

**Ações Planejadas:**
1.  Criar tabela `turmas` centralizada.
2.  Ativar Foreign Keys nativas do PostgreSQL.
3.  Remover campos duplicados das tabelas de alunos.

> Para detalhes da estratégia de migração, consulte [docs/overview.md](./overview.md).
