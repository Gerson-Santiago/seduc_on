# Segurança e Proteção de Dados

**Data da Última Atualização:** Dezembro 2025

Este documento descreve as políticas e implementações de segurança do SEDUC ON, garantindo a proteção dos dados sensíveis dos alunos e o controle de acesso ao sistema.

## 🛡 Autenticação e Autorização

### Google OAuth 2.0
O sistema utiliza autenticação delegada via Google para garantir identidade segura sem armazenar senhas no banco de dados.

*   **Fluxo:** O token JWT (`credential`) gerado pelo Google no frontend é enviado para o backend.
*   **Validação:** O backend utiliza a biblioteca oficial `google-auth-library` para verificar a assinatura e expiração do token.
*   **Controle de Domínio:** Apenas e-mails institucionais autorizados (configuráveis) podem acessar o sistema.

### RBAC (Role-Based Access Control)
O controle de acesso é baseado em perfis de usuário (atualmente simplificado para administradores e usuários padrão).

## 🔒 Proteção da API (Hardening)

### Helmet
Utilizamos o middleware `helmet` para configurar headers HTTP de segurança padrão, protegendo contra vulnerabilidades comuns como XSS (Cross-Site Scripting) e Sniffing.

### Rate Limiting
Para evitar ataques de força bruta ou DDoS, implementamos limites de requisição:
*   **Geral:** Limite conservador para rotas públicas.
*   **Autenticado:** Limite mais permissivo para usuários logados.

### Sanitização de Dados
Todas as entradas de dados, especialmente via ETL, passam por higienização rigorosa (`sanitizarTexto`) para prevenir injeção de dados maliciosos ou corrompidos.

## 📝 Auditoria
O sistema mantem logs de operações críticas e importações falhas na tabela `inconsistencias_importacao`, permitindo rastreabilidade de problemas na carga de dados.
