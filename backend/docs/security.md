# Segurança de Dados e LGPD

> Análise de riscos, conformidade LGPD e melhores práticas de segurança para o projeto.

## Índice
- [1. Análise de Risco (LGPD)](#1-análise-de-risco-lgpd)
- [2. Vulnerabilidades e Soluções](#2-vulnerabilidades-e-soluções)
- [3. Plano de Ação](#3-plano-de-ação)
- [4. Checklist de Conformidade](#4-checklist-de-conformidade)

---

## 1. Análise de Risco (LGPD)

O sistema manipula **Dados Pessoais Sensíveis** de alunos (menores de idade), exigindo conformidade estrita com a LGPD (Lei Geral de Proteção de Dados).

### Dados Armazenados
*   ✅ Nome, Endereço, Telefone (Identificação)
*   🔴 **Dados Sensíveis:** Deficiência, Etnia (Art. 5º, II LGPD)

**Impacto:** Vazamento desses dados pode acarretar multas severas e danos reputacionais críticos.

---

## 2. Vulnerabilidades e Soluções

### A. Repouso e Trânsito
| Risco | Nível | Solução Técnica |
| :--- | :--- | :--- |
| **Sem Criptografia em Repouso** | Crítico | Ativar criptografia transparente no PostgreSQL (TDE) ou no disco. |
| **Conexão Sem SSL** | Alto | Forçar `sslmode=require` na string de conexão do PostgreSQL em produção. |
| **Backups Expostos** | Alto | Criptografar dumps de banco (`gpg`) antes de armazenar. |

### B. Código e Acesso
| Risco | Nível | Solução Técnica |
| :--- | :--- | :--- |
| **Senhas no Histórico** | Crítico | Remover credenciais hardcoded e usar variáveis de ambiente. |
| **Logs Verborrágicos** | Médio | Implementar sanitização em `console.log` para não gravar objetos de alunos inteiros. |

### C. Auditoria
*   **Problema:** Falta de rastreabilidade de quem acessou os dados.
*   **Mitigação:** Criar tabela `audit_log` para registrar leituras e escritas em dados sensíveis.

---

## 3. Plano de Ação

### Imediato (Esta Semana)
1.  [ ] Remover quaisquer senhas hardcoded do código.
2.  [ ] Configurar `DATABASE_URL` com SSL (`?sslmode=require`).
3.  [ ] Garantir que backups rotineiros sejam criptografados.

### Médio Prazo
1.  [ ] Implementar middleware de Auditoria (`audit_log`).
2.  [ ] Sanitizar logs de aplicação (remover PII).
3.  [ ] Criar usuário de banco `readonly` para scripts de relatório.

---

## 4. Checklist de Conformidade

- [x] **Autenticação Segura:** Uso de OAuth2 (Google) e JWT.
- [x] **Segregação de Admins:** Tabela de usuários separada de alunos.
- [x] **Validação de Input:** Uso de `Zod` para evitar injeção de dados inválidos.
- [x] **Proteção HTTP:** `Helmet` configurado.
- [ ] **Auditoria (Art. 46):** Pendente implementação.
- [ ] **Política de Privacidade (Art. 6):** Pendente documentação formal.

---

> _Para detalhes técnicos da análise original, consulte o histórico do git._
