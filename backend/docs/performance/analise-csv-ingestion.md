# Análise de Ingestão de CSV - SEDUC ON

**Data:** _A ser preenchido_  
**Sistema:** SEDUC ON - Integração com SED

---

## 📋 Objetivo

Analisar o processo atual de importação de arquivos CSV da Secretaria de Educação (SED), identificar gargalos de performance e propor melhorias mantendo a arquitetura Node.js atual.

---

## 1. Processo Atual de Importação

### 1.1 Fluxo de Dados

```mermaid
graph LR
    A[CSV da SED] --> B[Download/Recebimento]
    B --> C[Node.js - csv-parser]
    C --> D[Processamento em memória]
    D --> E[Prisma - Bulk Insert]
    E --> F[PostgreSQL - alunos_integracao_all]
    F --> G[Processamento para tabelas finais]
```

### 1.2 Scripts de Importação Existentes

**Localização:** _A identificar no repositório_

```bash
# Procurar por scripts de importação
find /home/sant/seduc_on -name "*csv*" -o -name "*import*"
```

**Scripts encontrados:**
- _A listar_

---

## 2. Análise de Performance Atual

### 2.1 Características do CSV

| Métrica | Valor Típico |
|---------|--------------|
| Tamanho do arquivo | _X MB_ |
| Número de linhas | _N alunos_ |
| Número de colunas | ~50 campos |
| Codificação | UTF-8 / ISO-8859-1 |
| Delimitador | `,` ou `;` |

### 2.2 Tempo de Processamento

**Medição:**
```bash
time node scripts/importar-csv.js caminho/para/ALUNOS.csv
```

| Etapa | Tempo (s) |
|-------|-----------|
| Leitura do arquivo | _TBD_ |
| Parsing CSV | _TBD_ |
| Transformação de dados | _TBD_ |
| Inserção no banco | _TBD_ |
| **TOTAL** | _TBD_ |

### 2.3 Impacto no Banco de Dados

**Durante a importação, monitorar:**

```sql
-- Monitorar locks
SELECT * FROM pg_locks WHERE granted = false;

-- Monitorar conexões ativas
SELECT count(*) FROM pg_stat_activity;

-- Monitorar IO
SELECT * FROM pg_stat_database WHERE datname = 'seduc_on';
```

**Resultados observados:**
- Locks de tabela: _Sim/Não_
- CPU do PostgreSQL: _%_
- IO disk: _MB/s_
- Conexões bloqueadas: _N_

---

## 3. Análise do Código de Importação

### 3.1 Biblioteca Usada: csv-parser

```javascript
import csv from 'csv-parser';
import fs from 'fs';

// Código típico
fs.createReadStream('alunos.csv')
  .pipe(csv())
  .on('data', (row) => {
    // Processar linha por linha
  })
  .on('end', () => {
    console.log('CSV processado');
  });
```

**Análise:**
- ✅ Streaming - não carrega tudo em memória
- ⚠️ Processamento linha por linha pode ser lento para inserção

### 3.2 Estratégia de Inserção

**Cenário 1: Inserção linha por linha**
```javascript
for (const row of rows) {
  await prisma.alunos_integracao_all.create({ data: row });
}
```
- ❌ **Muito lento** - 1 query por linha

**Cenário 2: Batch insert**
```javascript
await prisma.alunos_integracao_all.createMany({
  data: rows,
  skipDuplicates: true
});
```
- ✅ **Mais eficiente** - 1 query para múltiplas linhas

**Cenário Atual:** _A identificar_

---

## 4. Gargalos Identificados

### 4.1 Leitura do Arquivo

**Problema potencial:**
- Arquivo muito grande carregado inteiro na memória

**Solução:**
- ✅ Usar streaming (já usando `csv-parser`)

### 4.2 Parsing e Validação

**Problema potencial:**
- Conversão de tipos (datas, números)
- Validação de dados

**Medição:**
```javascript
const start = Date.now();
const parsed = parseRow(row);
const duration = Date.now() - start;
```

**Tempo médio por linha:** _X ms_

### 4.3 Inserção no Banco

**Problema potencial:**
- Inserções individuais vs batch
- Transações grandes travando o banco

**Teste de batch sizes:**

| Batch Size | Tempo Total (s) | Linhas/s |
|------------|-----------------|----------|
| 1 (individual) | _TBD_ | _TBD_ |
| 100 | _TBD_ | _TBD_ |
| 500 | _TBD_ | _TBD_ |
| 1000 | _TBD_ | _TBD_ |
| 5000 | _TBD_ | _TBD_ |

**Batch size ótimo:** _N linhas_

### 4.4 Locks e Concorrência

**Problema potencial:**
- Importação trava a tabela
- Usuários não conseguem acessar sistema durante importação

**Teste:**
1. Iniciar importação
2. Tentar acessar `/api/alunos/stats`
3. Medir tempo de resposta

**Resultado:** _A preencher_

---

## 5. Propostas de Otimização

### 5.1 Otimização de Inserção (Prioridade ALTA)

**Implementar batch insert com tamanho ótimo:**

```javascript
import csv from 'csv-parser';
import fs from 'fs';

const BATCH_SIZE = 1000; // Ajustar conforme teste
let batch = [];

fs.createReadStream('alunos.csv')
  .pipe(csv())
  .on('data', async (row) => {
    batch.push(transformRow(row));
    
    if (batch.length >= BATCH_SIZE) {
      await prisma.alunos_integracao_all.createMany({
        data: batch,
        skipDuplicates: true
      });
      batch = [];
    }
  })
  .on('end', async () => {
    // Inserir últimos registros
    if (batch.length > 0) {
      await prisma.alunos_integracao_all.createMany({
        data: batch,
        skipDuplicates: true
      });
    }
  });
```

**Ganho esperado:** 50-80% redução de tempo

### 5.2 Processamento Assíncrono (Prioridade MÉDIA)

**Para CSVs muito grandes:**

```javascript
// Backend expõe rota para iniciar importação
app.post('/api/sed/importar-csv', async (req, res) => {
  // Não espera processar, responde imediatamente
  res.json({ status: 'processando', jobId: '123' });
  
  // Processar em background
  processCSVInBackground(req.file.path);
});

// Rota para verificar status
app.get('/api/sed/import-status/:jobId', (req, res) => {
  res.json({ 
    status: 'concluido' | 'processando' | 'erro',
    progress: '80%'
  });
});
```

**Vantagens:**
- Usuário não precisa esperar
- Sistema continua responsivo

**Desvantagens:**
- Mais complexidade
- Necessita gerenciamento de jobs

### 5.3 Uso de COPY (PostgreSQL Nativo)

**Para performance máxima:**

```javascript
// Usar COPY do PostgreSQL (muito mais rápido)
import { exec } from 'child_process';

exec(`psql -d seduc_on -c "\\COPY alunos_integracao_all FROM 'alunos.csv' CSV HEADER"`)
```

**Prós:**
- ⚡ **Extremamente rápido** (10x mais rápido que inserts)

**Contras:**
- Bypassa ORM (Prisma)
- Menos controle sobre validação
- Requer acesso direto ao PostgreSQL

### 5.4 Paralelização (Prioridade BAIXA)

**Para arquivos muito grandes:**

```javascript
// Dividir CSV em chunks e processar em paralelo
const chunks = splitCSV('alunos.csv', 10000); // 10k linhas por chunk
await Promise.all(chunks.map(chunk => processChunk(chunk)));
```

**Atenção:** Pode sobrecarregar banco de dados

---

## 6. Validação de Dados

### Problemas Comuns em CSVs

- **Datas inválidas:** `00/00/0000`
- **Campos vazios:** Tratar como `NULL`
- **Encoding:** ISO-8859-1 vs UTF-8
- **Delimitador:** `,` vs `;`

### Estratégia de Tratamento

```javascript
function transformRow(row) {
  return {
    nome_aluno: row.nome_aluno || null,
    ra: row.ra,
    data_nasci: parseDate(row.data_nasci), // Validar e converter
    situacao: row.situacao?.toUpperCase(),
    // ... outros campos
  };
}

function parseDate(dateStr) {
  if (!dateStr || dateStr === '00/00/0000') return null;
  // Converter para formato ISO
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}`);
}
```

---

## 7. Monitoramento Durante Importação

### Script de Monitoramento

```javascript
let totalProcessed = 0;
let startTime = Date.now();

setInterval(() => {
  const elapsed = (Date.now() - startTime) / 1000;
  const rate = totalProcessed / elapsed;
  console.log(`Processadas: ${totalProcessed} | Taxa: ${rate.toFixed(0)} linhas/s`);
}, 5000); // Log a cada 5 segundos
```

---

## 8. Decisão e Recomendações

### Implementar Imediatamente

1. ✅ **Batch insert** com tamanho ótimo (1000-5000 linhas)
2. ✅ **Validação e transformação** de dados
3. ✅ **Logging de progresso**

### Implementar se Necessário

4. ⚡ **Processamento assíncrono** (se importação > 2 minutos)
5. ⚡ **COPY nativo PostgreSQL** (se batch insert não for suficiente)

### Não Recomendado no Momento

- ❌ Migração para Python para processamento CSV
- ❌ Paralelização complexa
- ❌ Separação de serviços

### Veredito

> [!NOTE]
> **Recomendação:** _A preencher após testes_
>
> **Justificativa:**
> - _Baseado em tempo de importação medido_
> - _Adequado para equipe de 2 desenvolvedores_

---

## 9. Plano de Implementação

### Fase 1: Medição
- [ ] Medir tempo atual de importação
- [ ] Identificar gargalo principal

### Fase 2: Otimização
- [ ] Implementar batch insert
- [ ] Testar diferentes tamanhos de batch
- [ ] Adicionar validação de dados

### Fase 3: Validação
- [ ] Re-medir tempo de importação
- [ ] Validar dados importados
- [ ] Documentar processo

---

## 10. Como Executar a Análise

```bash
# Localizar scripts de importação
find /home/sant/seduc_on -name "*csv*" -type f

# Executar importação com medição de tempo
time node caminho/para/script-import.js

# Monitorar PostgreSQL durante importação (outro terminal)
watch -n 2 'psql -U <user> -d seduc_on -c "SELECT count(*) FROM alunos_integracao_all"'
```

---

## Referências

- [csv-parser documentation](https://www.npmjs.com/package/csv-parser)
- [Prisma - Batch Operations](https://www.prisma.io/docs/concepts/components/prisma-client/crud#create-multiple-records)
- [PostgreSQL COPY command](https://www.postgresql.org/docs/current/sql-copy.html)
