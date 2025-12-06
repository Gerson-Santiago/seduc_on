# Banco de Dados e Estratégia de Dados

**Data da Última Atualização:** Dezembro 2025

Este documento detalha a estrutura do banco de dados (PostgreSQL) e a estratégia de gerenciamento de dados do SEDUC ON, incluindo o uso do Prisma ORM e tabelas de integração.

## 🗄 Arquitetura de Dados

O sistema utiliza uma abordagem híbrida com **Tabelas de Integração (Staging)** e **Tabelas Normalizadas**.

### 1. Tabelas de Integração (Staging)
Tabelas temporárias otimizadas para escrita rápida (Bulk Insert). Recebem os dados brutos dos arquivos CSV antes de serem processados.
*   **Nome:** `alunos_integracao_all`
*   **Propósito:** Buffer de entrada. Não possui chaves estrangeiras restritivas para permitir importação rápida.
*   **Ciclo de Vida:** Truncada (`TRUNCATE`) no início de cada importação.

### 2. Tabela de Inconsistências
Armazena registros que falharam na validação inicial (ETL).
*   **Nome:** `inconsistencias_importacao`
*   **Colunas Chave:** `ra`, `nome_aluno`, `motivo`, `dados_json` (payload original).
*   **Uso:** Auditoria e correção de dados.

### 3. Tabelas Finais (Domínio)
Tabelas otimizadas para leitura e consumo pela aplicação.
*   `alunos_regular_ei_ef9`: Alunos do Ensino Fundamental e Infantil.
*   `alunos_aee`: Alunos de Atendimento Educacional Especializado.
*   `alunos_eja`: Alunos da Educação de Jovens e Adultos.

> **Nota:** A separação em tabelas específicas por modalidade facilita a consulta e relatórios específicos no frontend.

## 🛠 Prisma ORM

O projeto utiliza o Prisma como única fonte de verdade para o schema do banco (`schema.prisma`).

### Comandos Essenciais
```bash
# Sincronizar banco com schema (Dev)
npx prisma db push

# Gerar cliente tipado (após alteração de schema)
npx prisma generate

# Visualizar dados (GUI)
npx prisma studio
```

## 🔒 Integridade e Performance
*   **Índices:** As tabelas finais possuem índices no `ra` (Registro do Aluno) e `nome_escola` para buscas rápidas.
*   **Transações:** Operações críticas utilizam transações do Prisma (`$transaction`) ou SQL Raw quando a performance é prioritária.
