# Análise de Segurança de Dados - SEDUC ON

**Data:** 01/12/2025  
**Objetivo:** Avaliar segurança de dados pessoais de alunos (LGPD compliance)

---

## 🔒 ANÁLISE DE SEGURANÇA ATUAL

### 1. Dados Sensíveis Armazenados

**Informações Pessoais Identificáveis (PII):**
- ✅ Nome completo do aluno
- ✅ RA (registro acadêmico único)
- ✅ Data de nascimento
- ✅ Endereço residencial
- ✅ Telefone
- ✅ Email do aluno
- ✅ Nome do responsável
- ✅ Dados de deficiência
- ✅ Etnia

**Classificação:** 🔴 **DADOS SENSÍVEIS** (Art. 5º, II LGPD)

---

## ⚠️ PROBLEMAS DE SEGURANÇA IDENTIFICADOS

### 1. **Sem Criptografia em Repouso** (CRÍTICO)

**Problema:**
```prisma
model alunos_regular_ei_ef9 {
  nome_aluno String?         // ❌ Texto puro
  endereco String?           // ❌ Texto puro
  telefone String?           // ❌ Texto puro
  deficiencia String?        // ❌ SENSÍVEL, texto puro
}
```

**Risco:**
- Backup do banco = dados expostos
- Logs do PostgreSQL = dados expostos
- Acesso ao servidor = dados expostos

**Solução:**
```sql
-- Habilitar criptografia transparente no PostgreSQL
-- Opção 1: pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Opção 2: Criptografia de disco (LUKS no Linux)
-- Opção 3: PostgreSQL TDE (Transparent Data Encryption)
```

---

### 2. **Conexão Banco Sem SSL** (ALTO)

**Verificar em `.env.dev`:**
```bash
DATABASE_URL="postgresql://aee_user:Ma165081735@localhost:5432/aee_db"
#                                                      ↑ Sem ?sslmode=require
```

**Problema:**
- Senha em texto puro na string de conexão
- Dados trafegam sem criptografia

**Solução:**
```env
# .env.dev
DATABASE_URL="postgresql://aee_user:SENHA@localhost:5432/aee_db?sslmode=require"

# .env.production
DATABASE_URL="postgresql://aee_user:SENHA@db.servidor:5432/aee_db?sslmode=verify-full&sslcert=/path/to/client-cert.pem&sslkey=/path/to/client-key.pem&sslrootcert=/path/to/ca-cert.pem"
```

---

### 3. **Senha no Código** (CRÍTICO)

**Encontrado em:**
```javascript
// Senha exposta em comandos
PGPASSWORD=Ma165081735 psql -h localhost ...
```

**Solução:**
```bash
# ~/.pgpass (permissão 0600)
localhost:5432:aee_db:aee_user:SENHA_SEGURA

# Ou usar variáveis de ambiente
export PGPASSWORD="$(cat /secure/path/db_password)"
```

---

### 4. **Logs Podem Expor Dados** (MÉDIO)

**Problema:**
```javascript
console.log(aluno);  // ❌ Pode logar dados pessoais
console.error(error); // ❌ Pode conter queries com dados
```

**Solução:**
```javascript
// Sanitizar logs
const sanitizeLog = (obj) => {
  const { nome_aluno, endereco, telefone, ...safe } = obj;
  return { ...safe, nome_aluno: '[REDACTED]' };
};

console.log(sanitizeLog(aluno));
```

---

### 5. **Sem Auditoria de Acesso** (MÉDIO)

**Problema:**
- Não há log de quem acessou dados de qual aluno
- Não há rastreabilidade (LGPD Art. 46)

**Solução:**
```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL,
  acao VARCHAR(50),        -- 'READ', 'UPDATE', 'DELETE'
  tabela VARCHAR(100),
  registro_id VARCHAR(50), -- RA do aluno, por exemplo
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address INET
);
```

---

### 6. **Backup Sem Criptografia** (ALTO)

**Problema:**
```bash
pg_dump seduc_on > backup.sql  # ❌ Arquivo não criptografado
```

**Solução:**
```bash
# Backup criptografado
pg_dump seduc_on | gpg --encrypt --recipient admin@escola.com > backup.sql.gpg

# Ou usar ferramentas de backup com criptografia
pg_dump seduc_on | gzip | openssl enc -aes-256-cbc -salt -out backup.sql.gz.enc
```

---

## ✅ PONTOS POSITIVOS DE SEGURANÇA

### 1. **Autenticação Implementada** ✅
- Google OAuth via Passport.js
- Controle de perfis (superadmin, admin, comum)

### 2. **Middleware de Autenticação** ✅
```javascript
// Rotas protegidas
router.use(authMiddleware);
```

### 3. **Tabela de Usuários Segregada** ✅
- Usuários não estão misturados com alunos
- Senhas não armazenadas (OAuth)

### 4. **Melhorias Recentes (03/12/2025)** ✅
- **Validação de Dados:** Implementado `Zod` para sanitização e validação de inputs.
- **Proteção HTTP:** `Helmet` configurado com HSTS e remoção de headers sensíveis.
- **Rate Limiting:** Proteção contra força bruta e DoS.
- **Tratamento de Erros:** `asyncHandler` centraliza erros e evita vazamento de stack traces em produção.

---

## 🎯 PLANO DE AÇÃO DE SEGURANÇA

### PRIORIDADE CRÍTICA (Esta Semana)

1. **Remover senhas do código**
   ```bash
   git log | grep -i password  # Verificar histórico
   git filter-branch           # Limpar histórico se necessário
   ```

2. **Habilitar SSL na conexão do banco**
   ```env
   DATABASE_URL="...?sslmode=require"
   ```

3. **Criptografar backups existentes**
   ```bash
   for f in *.sql; do
     gpg --encrypt --recipient admin@escola.com "$f"
     rm "$f"  # Após verificar backup.gpg
   done
   ```

### PRIORIDADE ALTA (Próximas 2 Semanas)

4. **Implementar auditoria de acesso**
   - Tabela `audit_log`
   - Middleware para logar acessos

5. **Sanitizar logs**
   - Criar função `sanitizeLog()`
   - Aplicar em todos os console.log

6. **Revisar permissões PostgreSQL**
   ```sql
   -- Usuário de leitura para relatórios
   CREATE USER app_readonly WITH PASSWORD 'senha_forte';
   GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
   ```

### PRIORIDADE MÉDIA (Mês 2)

7. **Criptografia de campos sensíveis**
   ```javascript
   // Usar biblioteca crypto do Node.js
   const crypto = require('crypto');
   
   function encrypt(text) {
     const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
     return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
   }
   ```

8. **Política de retenção de dados**
   ```sql
   -- Anonimizar dados de alunos inativos após 5 anos
   UPDATE alunos_regular_ei_ef9
   SET nome_aluno = 'ANONIMIZADO',
       endereco = NULL,
       telefone = NULL,
       email_aluno = NULL
   WHERE situacao = 'INATIVO'
     AND data_fim < NOW() - INTERVAL '5 years';
   ```

---

## 📋 CHECKLIST DE CONFORMIDADE LGPD

### Requisitos Básicos

- [ ] **Art. 6º - Finalidade:** Documentar uso dos dados (matrícula, frequência)
- [x] **Art. 7º - Consentimento:** Implícito (matrícula escolar)
- [ ] **Art. 46 - Segurança:** ⚠️ Parcial (faltam itens críticos)
- [ ] **Art. 48 - Notificação:** Processo para notificar vazamentos
- [ ] **Art. 18 - Direitos do titular:**
  - [ ] Acesso aos dados (API de consulta)
  - [ ] Correção de dados (API de update)
  - [ ] Eliminação de dados (soft delete/anonimização)

### Medidas Técnicas Necessárias

- [ ] Criptografia em repouso
- [ ] Criptografia em trânsito (SSL)
- [ ] Controle de acesso (autenticação/autorização)
- [ ] Auditoria (logs de acesso)
- [ ] Backup seguro (criptografado)
- [ ] Política de retenção
- [ ] Processo de anonimização

---

## 🚨 RISCOS E IMPACTOS

### Se Houver Vazamento de Dados

**Impacto Legal:**
- Multa ANPD: até 2% do faturamento (máx R$ 50 milhões)
- Processo judicial por danos morais
- Responsabilização penal (Art. 154-A CP)

**Impacto Reputacional:**
- Perda de confiança dos pais/responsáveis
- Exposição na mídia
- Dano institucional

**Dados em Risco:**
- 10.000 alunos × dados pessoais
- Endereços de menores
- Informações de deficiência (dados sensíveis)

---

## 💡 RECOMENDAÇÕES IMEDIATAS

### Para Equipe de 2 Desenvolvedores

**Semana 1:**
1. ✅ Remover senhas do código
2. ✅ Habilitar SSL no banco
3. ✅ Criptografar backups

**Semana 2-3:**
4. ✅ Implementar auditoria básica
5. ✅ Sanitizar logs
6. ✅ Documentar política de dados

**Mês 2:**
7. ✅ Criptografia de campos sensíveis (opcional)
8. ✅ Política de retenção/anonimização

---

## 📚 Documentação Necessária

### Para Conformidade LGPD

1. **Política de Privacidade**
   - Como dados são coletados
   - Finalidade do tratamento
   - Tempo de retenção

2. **Termo de Consentimento**
   - Autorização dos pais/responsáveis
   - Uso de imagem (se aplicável)

3. **Manual de Segurança**
   - Procedimentos de backup
   - Política de senhas
   - Resposta a incidentes

4. **Registro de Atividades de Tratamento**
   - Quais dados são tratados
   - Finalidade
   - Base legal

---

## ✅ PRÓXIMOS PASSOS

**Decisão necessária:**
1. Contratar DPO (Data Protection Officer)?
2. Auditar código existente para vazamentos?
3. Implementar criptografia agora ou depois?

**Orçamento estimado:**
- Implementar SSL: 0 horas (configuração)
- Audit log: 8-16 horas
- Criptografia: 16-32 horas
- Documentação LGPD: 16-24 horas

---

**Status:** Segurança parcial - melhorias críticas necessárias 🔒
