# Requisitos de Infraestrutura
> Especificações de software, versões e rede para o ambiente de produção.

## Índice
- [1. Software Essencial](#1-software-versões-exatas)
- [2. Configurações de Rede](#2-configurações-de-rede)
- [3. Checklist de Variáveis](#3-variáveis-de-ambiente-env)
- [4. Resumo para Solicitação](#resumo-para-a-ti-copie-e-cole-isso)

---

## 1. Software (Versões EXATAS)

Para garantir compatibilidade total e evitar problemas de deploy, instale **exatamente** estas versões:

### Essenciais
1.  **Node.js**: Versão **24.11.1**
    ```bash
    node -v
    ```
2.  **NPM**: Versão **11.6.4**
    ```bash
    npm -v
    ```
3.  **PostgreSQL**: Versão **18.1**
    ```bash
    psql --version
    ```

### Sistema Operacional
*   **Linux**: Ubuntu 24.04 LTS (Noble Numbat)
    *   *Recomendado por compatibilidade nativa com as versões acima.*

### Gerenciamento de Processos
4.  **PM2**: Versão **5.4.x** (ou superior estável)
    ```bash
    npm install -g pm2
    ```
5.  **Git**: Versão **2.43.0** (ou superior)

---

## 2. Configurações de Rede

Para o servidor de produção (VPS/VM):

*   **Portas de Entrada (Firewall):**
    *   `80` (HTTP) - Para redirecionamento ou proxy reverso.
    *   `443` (HTTPS) - Tráfego seguro obrigatório.
    *   `22` (SSH) - Acesso remoto administrativo.

> [!WARNING]
> As portas `3000` ou `3001` (Node.js) **NÃO** devem ser expostas publicamente. Use um Proxy Reverso (Nginx/Apache) para encaminhar o tráfego da porta 80/443 para a aplicação.

---

## 3. Variáveis de Ambiente (.env)

O sistema **NÃO INICIA** sem estas chaves configuradas. Consulte o arquivo [ENV_VARS.md](./ENV_VARS.md) para detalhes completos.

*   `DATABASE_URL`
*   `JWT_SECRET`
*   `GOOGLE_CLIENT_ID`
*   `NODE_ENV=production`

---

## Resumo para a TI (Copie e cole isso)

> **Solicitação de Provisionamento de Servidor - Projeto SEDUC ON**
>
> **Software (Versões Exatas):**
> *   OS: Ubuntu 24.04 LTS
> *   Node.js: **v24.11.1**
> *   NPM: **v11.6.4**
> *   PostgreSQL: **v18.1**
> *   PM2: Latest Stable
>
> **Rede:**
> *   Liberar entrada: 80, 443, 22.
> *   Bloquear externa: 3000, 3001, 5432 (Banco deve aceitar conexão apenas local ou de IP confiável).
