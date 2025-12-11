# Arquitetura de Persistência e Modelagem de Dados

**Classificação:** Data Engineering & Schema Documentation
**Tecnologia:** PostgreSQL 15+ & Prisma ORM

Este documento detalha a estratégia de persistência de dados, incluindo pipelines de ingestão (ETL) e modelagem relacional.

## 1. Estratégia de Ingestão de Dados (ETL Strategy)

O sistema adota uma arquitetura de "Staging Area" para processar cargas massivas de dados legados sem impactar a performance de leitura das tabelas principais.

### 1.1 Tabelas de Integração (Staging Architecture)
Tabelas otimizadas para **High-Throughput Write Operations** (Bulk Insert).
*   **Recurso:** `alunos_integracao_all`
*   **Design Pattern:** Tabela Temporária Persistente.
*   **Restrições:** Baixa complexidade de constraints (FKs relaxadas) para maximizar velocidade de ingestão.
*   **Ciclo de Vida:** `TRUNCATE` -> `COPY/INSERT` -> `VALIDATE` -> `MIGRATE`.

### 1.2 Auditoria de Qualidade de Dados
Registros rejeitados durante a validação de regras de negócio são segregados para análise posterior.
*   **Recurso:** `inconsistencias_importacao`
*   **Schema:** Armazena o payload original (`dados_json`) e o motivo da rejeição.
*   **Uso:** Análise de causa raiz e correção na fonte (CSV).

### 1.3 Tabelas de Domínio (Normalized Schema)
Tabelas finais em 3ª Forma Normal (3NF), otimizadas para leitura (`SELECT`) pela aplicação.
*   `alunos_regular_ei_ef9`: Ensino Fundamental e Infantil.
*   `alunos_aee`: Atendimento Educacional Especializado.
*   `alunos_eja`: Educação de Jovens e Adultos.

## 2. Camada de Acesso a Dados (Data Access Layer)

O acesso ao banco de dados é abstraído estritamente através do **Prisma ORM Client**.

### 2.1 Schema Management (Single Source of Truth)
O arquivo `schema.prisma` é a definição canônica da estrutura do banco.

### 2.2 Operações de Engenharia
```bash
# Synchronization: Aplica estado do schema ao banco de desenvolvimento
npx prisma db push

# Client Generation: Atualiza tipagem estática (TypeScript/JSDoc)
npx prisma generate

# Data Explorer: Interface GUI para inspeção de dados
npx prisma studio
```

## 3. Otimização e Indexação

*   **Índices Compostos (Composite Indices):** Estratégia aplicada em tabelas de grande volume para cobrir queries frequentes (`ra`, `nome_escola`).
*   **Atomicidade:** Operações de escrita complexas são envelopadas em transações (`$transaction`) para garantir propriedades ACID.
