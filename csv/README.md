# Documentação de Importação de CSV

Este diretório contém os arquivos CSV utilizados para popular o banco de dados do sistema SEDUC ON.

## Arquivos Principais

- **ALUNOS.csv**: Contém a lista completa de alunos a serem importados.
- **dados_das_escolas.csv**: Dados cadastrais das escolas.
- **consulta_matricula.csv**: Dados de matrícula e turmas.

## Como Importar os Dados

Para importar os dados para o banco de dados, utilize os scripts localizados no backend.

**Atenção**: Este processo apaga os dados existentes nas tabelas correspondentes antes de importar os novos.

### Passo a Passo

1.  Navegue até o diretório do backend:
    ```bash
    cd ../backend
    ```

2.  Execute os scripts de importação conforme a necessidade:

    **Importar Alunos:**
    ```bash
    node prisma/import_students.js
    ```

    **Importar Escolas:**
    ```bash
    node prisma/import_schools.js
    ```

    **Importar Matrículas:**
    ```bash
    node prisma/import_matricula.js
    ```

    **Importar Usuários Administrativos:**
    ```bash
    node prisma/import_users.js
    ```

    **Verificar Consistência:**
    ```bash
    node scripts/check_consistency.js
    ```

### O que os scripts fazem

- **import_students.js**: Limpa e popula as tabelas de alunos (`alunos_integracao_all`, `alunos_regular_ei_ef9`, `alunos_aee`, `alunos_eja`).
- **import_schools.js**: Limpa e popula a tabela `dados_das_escolas`.
- **import_matricula.js**: Limpa e popula a tabela `consulta_matricula`.
- **import_users.js**: Importa ou atualiza usuários administrativos (sem apagar os existentes).
- **check_consistency.js**: Verifica inconsistências nos dados (ex: matrículas órfãs).

## Verificação

Após a importação, você pode verificar os dados rodando:

```bash
npx prisma studio
```
