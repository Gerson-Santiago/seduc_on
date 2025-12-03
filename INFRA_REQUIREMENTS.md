# Requisitos de Sistema - SEDUC ON

Para garantir que o sistema rode "sem B.O." (estável e performático), o ambiente deve atender aos seguintes requisitos de software.

## 1. Software (Versões EXATAS)

Para garantir compatibilidade total, instale **exatamente** estas versões:

### Essenciais
1.  **Node.js**: Versão **24.11.1**
    *   *Comando de verificação:* `node -v`
2.  **NPM**: Versão **11.6.4**
    *   *Comando de verificação:* `npm -v`
3.  **PostgreSQL**: Versão **18.1**
    *   *Comando de verificação:* `psql --version`

### Sistema Operacional
*   **Linux**: Ubuntu 24.04 LTS (Noble Numbat)
    *   *Recomendado por ser a base onde o Postgres 18.1 está rodando.*

### Gerenciamento
4.  **PM2**: Versão **5.4.x** (ou superior estável)
    *   Instalar via: `npm install -g pm2`
5.  **Git**: Versão **2.43.0** (ou superior)

---

## 2. Configurações de Rede

*   **Portas Liberadas (Firewall):**
    *   `80` (HTTP)
    *   `443` (HTTPS)
    *   `22` (SSH - Acesso remoto)
    *   *A porta 3000/3001 do Node não deve ficar aberta para o mundo, apenas localmente.*

---

## 3. Variáveis de Ambiente (.env)

O sistema **NÃO RODA** sem as variáveis configuradas corretamente:

*   `DATABASE_URL`: String de conexão correta com o banco.
*   `JWT_SECRET`: Chave longa e segura para criptografar sessões.
*   `GOOGLE_CLIENT_ID`: Para o login funcionar.
*   `NODE_ENV`: Deve estar como `production` para melhor performance.

---

## Resumo para a TI (Copie e cole isso)

> "Solicitação de Provisionamento de Servidor:
>
> **Software (Versões Exatas):**
> *   OS: Ubuntu 24.04 LTS
> *   Node.js: **v24.11.1**
> *   NPM: **v11.6.4**
> *   PostgreSQL: **v18.1**
> *   PM2: Latest Stable
>
> **Rede:**
> *   Liberar portas: 80, 443, 22."
