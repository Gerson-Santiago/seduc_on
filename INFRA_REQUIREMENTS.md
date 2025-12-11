# Requisitos de Infraestrutura e Provisionamento

**Classificação:** Infrastructure Specification
**Alvo:** Ambiente de Produção (Ubuntu LTS)

Este documento estabelece a *Bill of Materials* (BOM) de software e os requisitos de rede para o deployment do SEDUC ON.

## 1. Runtime Environment (Versões LTS)

A aplicação é homologada estritamente nas versões abaixo. O desvio de versão pode ocasionar incompatibilidade de ABI ou falhas na camada de ORM.

### 1.1 Core Runtime
| Componente | Versão Homologada | Comando de Verificação |
| :--- | :---: | :--- |
| **Node.js** | `v24.11.1` | `node -v` |
| **NPM** | `v11.6.4` | `npm -v` |
| **PostgreSQL** | `v18.1` | `psql --version` |

### 1.2 Process Management & Utility
| Ferramenta | Versão Mínima | Função |
| :--- | :---: | :--- |
| **PM2** | `5.4.x` | Gerenciador de Processos (Daemon, Logs, Restart) |
| **Git** | `2.43.0` | Controle de Versão (Deploy) |

## 2. Topology & Network Security

### 2.1 Perímetro de Rede (Firewall Rules)
O servidor deve operar sob o princípio de **Least Privilege Access**.

| Porta | Protocolo | Direção | Ação | Justificativa |
| :---: | :---: | :---: | :---: | :--- |
| **443** | TCP | Inbound | **ALLOW** | Tráfego HTTPS (TLS 1.2/1.3) para usuários finais. |
| **80** | TCP | Inbound | **ALLOW** | Redirecionamento HTTP -> HTTPS (Certbot/Challenges). |
| **22** | TCP | Inbound | **RESTRICT** | Acesso Administrativo (SSH). Restringir a IPs de gestão (VPN/Bastian). |
| **3001** | TCP | Inbound | **DENY** | Porta da API (Backend). Deve ser acessível apenas via `localhost` (Reverse Proxy). |
| **5432** | TCP | Inbound | **DENY** | Porta do Banco de Dados. Acesso restrito à aplicação local. |

### 2.2 Estratégia de Reverse Proxy
Recomenda-se o uso de **Nginx** ou **Caddy** como Gateway na frente dos processos Node.js para:
1.  Terminação SSL/TLS.
2.  Compressão Gzip/Brotli.
3.  Load Balancing básico.

## 3. Provisioning Checklist

Para a equipe de Infraestrutura/DevOps:

> **Solicitação de Recurso Computacional**
>
> **OS:** Ubuntu 24.04 LTS (Noble Numbat)
> **Compute:** 2 vCPU / 4GB RAM (Mínimo recomendado para ETL + API)
> **Storage:** SSD NVMe (I/O intensivo durante ingestão CSV)
> **Stack:** Node.js v24+, Postgres 18+
> **Network:** Expor apenas 80/443. Bloquear tráfego direto para 3001.
