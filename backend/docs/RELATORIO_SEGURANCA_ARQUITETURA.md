# Relatório Técnico de Arquitetura e Auditoria de Segurança

**Versão do Documento:** 1.1
**Status:** Revisado e Mitigado
**Data:** 11/12/2025

| Componente | Classificação | Status |
| :--- | :--- | :--- |
| **Arquitetura** | Layered Modular Architecture | Estável |
| **Paradigma** | Procedural (ESM) | Consistente |
| **Segurança** | Hardened | Em Manutenção |

---

## 1. Análise Arquitetural Detalhada

O sistema adota o padrão **Three-Tier Layered Architecture** (Arquitetura em Três Camadas) implementado sobre um runtime **Node.js** utilizando **Express.js** como framework de servidor. A estrutura de código segue o padrão **Modular Pattern** utilizando ES Modules (ESM).

### 1.1. Decomposição das Camadas

#### A. Camada de Apresentação e Roteamento (Presentation Layer)
-   **Localização:** `src/routes/*`
-   **Responsabilidade:** Atua como *Facade* de entrada para a aplicação. É responsável exclusivamente pelo recebimento de requests HTTP, interrupção de fluxo via middlewares (Auth, Validation, Rate Limiting) e delegação para os Controladores.
-   **Padrão:** RESTful Resource Routing.

#### B. Camada de Controle e Aplicação (Controller Layer)
-   **Localização:** `src/controllers/*`
-   **Responsabilidade:** Implementa a lógica de aplicação ("Application Logic"). Orquestra chamadas para a camada de serviço e define os DTOs (Data Transfer Objects) de resposta para o cliente. Responsável pelo parsing final de corpo e código de status HTTP.
-   **Design:** *Thin Controllers* (Controladores Magros) - evitam conter regra de negócio complexa.

#### C. Camada de Domínio e Serviço (Service Layer)
-   **Localização:** `src/services/*`
-   **Responsabilidade:** Núcleo da lógica de negócio ("Domain Logic"). Encapsula as regras invariantes do sistema. Esta camada é agnóstica ao protocolo HTTP (não consome `req`/`res`), facilitando testes unitários e reutilização em contextos não-web (ex: scripts, CLI).
-   **Padrão:** Transaction Script / Service Object.

#### D. Camada de Persistência (Data Access Layer)
-   **Localização:** Implementada via Prisma ORM (`@prisma/client`) dentro dos Services.
-   **Abstração:** O Prisma atua como um *Data Mapper* e *Query Builder*, abstraindo SQL cru e provendo tipagem estática forte ao acesso a dados.

### 1.2. Paradigma de Programação

O paradigma predominante é **Procedural Modular**, com características funcionais leves:
-   **Modular:** Uso extensivo de `import`/`export` para encapsulamento de escopo.
-   **Stateless:** Funções de serviço são predominantemente stateless, dependendo de injeção de dependência (instância do Prisma) ou contexto passado por argumento.
-   **Não-OO:** Ausência de classes de domínio instanciáveis com comportamento acoplado a estado. O estado é gerenciado externamente (DB) e passado como estruturas de dados simples.

---

## 2. Auditoria e Hardening de Segurança

### 2.1. Mecanismos de Defesa Ativos

A aplicação implementa uma estratégia de **Defense in Depth** (Defesa em Profundidade):

1.  **Proteção de Transporte e Sessão:**
    -   **Session Management:** Autenticação baseada em JWT (JSON Web Token) `HS256`.
    -   **Cookie Security:** Tokens armazenados em cookies `HttpOnly` (mitigação de XSS), `Secure` (apenas HTTPS em prod) e `SameSite=Lax` (mitigação de CSRF).
    -   **Transport Layer:** Tráfego forçado via HTTPS (HSTS configurado via Helmet).

2.  **Proteção de Perímetro e Aplicação:**
    -   **HTTP Security Headers:** Utilização do `Helmet` para configurar headers críticos (`X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`).
    -   **CORS Policy:** Whitelisting estrito de origens permitidas (`ALLOWED_ORIGINS`).
    -   **Input Validation:** Validação de esquema estrito (Strict Schema Validation) utilizando `Zod` na entrada (fail-fast strategy).

### 2.2. Ocorrências e Mitigações Recentes

#### [RESOLVIDO] Vulnerabilidade de Rate Limiting em Autenticação (CWE-307)
**Diagnóstico:** A rota crítica `POST /login` estava compartilhando o rate limiter global da API (100 req/15min), permitindo vetores de ataque de Força Bruta (Brute Force) e Credential Stuffing.
**Ação Corretiva:** Implementação de middleware dedicado `loginLimiter`.
**Configuração Atual:**
-   **Window:** 1 hora
-   **Max Requests:** 5 tentativas
-   **Status:** ✅ MITIGADO em `src/routes/usuario.routes.js`.

#### [OBSERVAÇÃO] Divulgação de Informação em Health Check
**Diagnóstico:** Endpoint `/api/health` retorna status detalhado do banco dados (`database: 'offline'`).
**Risco:** Baixo (Reconnaissance).
**Recomendação Técnica:** Manter como está para observabilidade, a menos que o endpoint seja público. Se público, retornar apenas `200 OK` ou `503 Service Unavailable` sem payload JSON detalhado.

---

## 3. Conclusão Técnica

A arquitetura do **SEDUC ON Backend** demonstra maturidade técnica adequada para sua escala. A separação de responsabilidades (SoC) é clara, facilitando manutenibilidade. A postura de segurança evoluiu de "Reativa" para "Proativa" com a implementação de validação rigorosa e limitação de taxa granular.

**Próximos Passos (Roadmap Técnico):**
-   Considerar implementação de **Refresh Tokens** com rotação para menor tempo de vida de access tokens.
-   Implementar **Structured Logging** (JSON logs) centralizado para melhor observabilidade em produção (Kibana/Grafana).
