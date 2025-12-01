# Documentação de Importação de CSV

Este diretório contém os arquivos CSV utilizados para popular o banco de dados do sistema SEDUC ON.

## Arquivos Principais

- **ALUNOS.csv**: Contém a lista completa de alunos a serem importados.
- **ALUNOS_headers.csv**: Cabeçalhos do arquivo de alunos (para referência).

## Como Importar os Dados

Para importar os dados do `ALUNOS.csv` para o banco de dados, utilize o script localizado no backend.

**Atenção**: Este processo apaga os dados existentes nas tabelas de alunos antes de importar os novos.

### Passo a Passo

1.  Navegue até o diretório do backend:
    ```bash
    cd ../backend
    ```

2.  Execute o script de importação:
    ```bash
    node prisma/import_students.js
    ```

### O que o script faz

1.  Limpa a tabela de integração (`alunos_integracao_all`).
2.  Lê o arquivo `csv/ALUNOS.csv`.
3.  Insere os dados na tabela de integração.
4.  Distribui os dados para as tabelas específicas:
    - `alunos_regular_ei_ef9` (Ensino Fundamental e Infantil)
    - `alunos_aee` (Atendimento Educacional Especializado)
    - `alunos_eja` (Educação de Jovens e Adultos)

## Verificação

Após a importação, você pode verificar os dados rodando:

```bash
npx prisma studio
```
