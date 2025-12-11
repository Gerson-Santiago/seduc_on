# Segurança e Proteção de Dados

**Data da Última Atualização:** Dezembro 2025

Este documento descreve as políticas e implementações de segurança do SEDUC ON, garantindo a proteção dos dados sensíveis dos alunos e o controle de acesso ao sistema.

## 🛡 Autenticação e Autorização

### Google OAuth 2.0 & Cookies Seguros
O sistema utiliza autenticação delegada via Google para garantir identidade segura.
*   **Fluxo Segura:** Diferente de armazenar JWT no `localStorage`, o token de sessão agora é gerenciado unicamente via **Cookies HTTP-Only, Secure e SameSite**.
*   **Mitigação XSS:** Como o JavaScript do frontend não tem acesso aos cookies, eliminamos o vetor de ataque de roubo de token via XSS.
*   **Fluxo:** O backend emite e valida os cookies automaticamente.

### RBAC (Role-Based Access Control)
O controle de acesso é baseado em perfis de usuário (atualmente simplificado para administradores e usuários padrão).

## 🔒 Proteção da API (Hardening)

### Helmet
Utilizamos o middleware `helmet` para configurar headers HTTP de segurança padrão, protegendo contra vulnerabilidades comuns como XSS (Cross-Site Scripting) e Sniffing.

### Rate Limiting
Para evitar ataques de força bruta ou DDoS, implementamos limites de requisição:
*   **Geral:** Limite conservador para rotas públicas.
*   **Autenticado:** Limite mais permissivo para usuários logados.

### Observabilidade e Monitoramento (Novo)
Implementamos um sistema de logging robusto para auditoria e debug, com foco em privacidade:
*   **Redação de Dados Sensíveis:** Utilização de formatadores customizados (Winston) para ofuscar automaticamente campos como `password`, `token`, `authorization` em todos os logs.
*   **JSON Estruturado:** Logs em formato JSON para facilitar a ingestão por ferramentas de monitoramento.
*   **HTTP Logs:** Todas as requisições são registradas sem expor corpos sensíveis.

### Sanitização de Dados
Todas as entradas de dados, especialmente via ETL, passam por higienização rigorosa (`sanitizarTexto`) para prevenir injeção de dados maliciosos ou corrompidos.

## 📝 Auditoria
O sistema mantem logs de operações críticas e importações falhas na tabela `inconsistencias_importacao`, permitindo rastreabilidade de problemas na carga de dados.
