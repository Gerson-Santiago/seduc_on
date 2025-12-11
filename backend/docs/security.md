# Políticas de Segurança e Proteção de Dados

**Classificação:** Security Policy & Hardening Guide
**Status:** Implementado (Defense in Depth)

Este documento detalha a estratégia de segurança em camadas (**Defense in Depth**) adotada no SEDUC ON para garantir confidencialidade, integridade e disponibilidade (CIA Triad).

## 1. Autenticação e Gestão de Sessão (Identity Management)

### 1.1 Protocolo Google OAuth 2.0
A autenticação é delegada ao Google Identity Platform, eliminando o risco de gerenciamento de credenciais (senhas) no banco de dados local.

### 1.2 Implementação Segura de Sessão (Cookie-Based)
Diferente de abordagens inseguras (localStorage), utilizamos **Stateful Session Cookies**:
*   **HttpOnly:** Impede acesso via JavaScript (Mitigação total de XSS contra roubo de sessão).
*   **Secure:** Trafega apenas via HTTPS (em produção).
*   **SameSite=Lax:** Previne ataques CSRF (Cross-Site Request Forgery).

## 2. Hardening da Aplicação

### 2.1 Proteção de Perímetro (Network & Transport)
*   **Rate Limiting Granular:**
    *   **Global:** Proteção contra DDoS volumétrico.
    *   **Login Endpoint:** Proteção estrita (5 req/hora) contra ataques de Força Bruta e Credential Stuffing (✅ Mitigado).
*   **CORS (Cross-Origin Resource Sharing):** Whitelist estrita permitindo apenas o domínio do frontend oficial.

### 2.2 Proteção de Cabeçalhos (Security Headers)
Utilizamos `Helmet.js` para forçar headers de segurança:
*   `Strict-Transport-Security` (HSTS)
*   `X-Content-Type-Options: nosniff`
*   `X-Frame-Options: DENY`

### 2.3 Validação de Entrada (Input Validation)
Adotamos a estratégia **Zero Trust** na entrada de dados:
*   **Strict Schema Validation:** Todo payload JSON é validado contra schemas `Zod` antes de chegar ao controller.
*   **Sanitização:** Entradas de texto passam por pipelines de limpeza para prevenir Injection Attacks.

## 3. Observabilidade e Auditoria

### 3.1 Logger Seguro (Secure Logging)
Implementação de logging estruturado (JSON) com **Redação Automática de Segredos**.
*   Filtros ativos removem: senhas, tokens, keys e dados pessoais sensíveis dos logs.
*   Registro de todas as falhas de autenticação e erros críticos de sistema.

### 3.2 Rastreabilidade
Ações críticas e processos de ETL geram trilhas de auditoria persistentes no banco de dados (`inconsistencias_importacao`), garantindo accountability.

---
*Referência Técnica: [RELATORIO_SEGURANCA_ARQUITETURA.md](./RELATORIO_SEGURANCA_ARQUITETURA.md)*
