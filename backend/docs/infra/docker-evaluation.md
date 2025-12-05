# Avaliação de Docker/Containerização - SEDUC ON

**Status:** 📌 Avaliação Exploratória (NÃO é migração)  
**Data:** _A ser preenchido_

---

## 📋 Objetivo

Avaliar se a adoção de Docker/containerização simplificaria ou complicaria o desenvolvimento e deploy do sistema, considerando o contexto de uma equipe pequena (2 desenvolvedores) trabalhando em Debian 12 / Crostini.

---

## ⚠️ Importante

> **Esta NÃO é uma proposta de migração imediata. É apenas uma avaliação para entender se faz sentido adotar Docker no futuro.**

---

## 1. Contexto Atual

### 1.1 Stack de Desenvolvimento

| Componente | Tecnologia | Instalação Atual |
|------------|------------|------------------|
| Backend | Node.js 20.x | Manual (nvm) |
| Database | PostgreSQL | Manual (apt) |
| Frontend | React + Vite | Manual (npm) |
| ORM | Prisma | npm package |

### 1.2 Processo Atual de Setup

**Para novo desenvolvedor:**

```bash
# 1. Instalar Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# 2. Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 3. Configurar banco
sudo -u postgres createdb seduc_on
sudo -u postgres createuser seduc_user

# 4. Clonar projeto
git clone <repo>
cd seduc_on/backend
npm install

# 5. Configurar .env
cp .env.example .env
# Editar .env manualmente

# 6. Rodar migrações
npx prisma migrate dev

# 7. Iniciar servidor
npm run dev
```

**Tempo estimado:** 30-60 minutos (se sem problemas)

**Problemas comuns:**
- Versão errada do Node.js
- PostgreSQL não inicia
- Credenciais do banco incorretas
- Dependências do sistema faltando

---

## 2. Proposta com Docker

### 2.1 Estrutura com Docker Compose

**Arquivo `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  # Banco de dados
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: seduc_user
      POSTGRES_PASSWORD: seduc_password
      POSTGRES_DB: seduc_on
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U seduc_user"]
      interval: 5s
      timeout: 5s
      retries: 5

  # API Backend
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://seduc_user:seduc_password@postgres:5432/seduc_on
      PORT: 3000
    ports:
      - "3000:3000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev

  # Frontend (opcional - pode rodar fora do container)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    command: npm run dev

volumes:
  postgres_data:
```

**Dockerfile do Backend:**

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm ci

# Copiar código
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 2.2 Processo de Setup com Docker

```bash
# 1. Clonar projeto
git clone <repo>
cd seduc_on

# 2. Iniciar tudo
docker-compose up -d

# 3. Rodar migrações (primeira vez)
docker-compose exec api npx prisma migrate deploy

# PRONTO!
```

**Tempo estimado:** 5-10 minutos (primeiro build), 1 minuto (subsequentes)

---

## 3. Comparação: Manual vs Docker

### 3.1 Setup Inicial

| Critério | Manual | Docker |
|----------|--------|--------|
| Tempo de setup (primeiro dev) | 30-60 min | 5-10 min |
| Tempo de setup (novo dev) | 20-40 min | 1-2 min |
| Chance de erro | Média-Alta | Baixa |
| Conhecimento necessário | PostgreSQL, Node.js | Docker basics |

### 3.2 Desenvolvimento Diário

| Aspecto | Manual | Docker |
|---------|--------|--------|
| Iniciar projeto | `npm run dev` em 2 terminais | `docker-compose up` |
| Parar projeto | Ctrl+C em 2 terminais | `docker-compose down` |
| Limpar tudo | Manual (dropdb, etc) | `docker-compose down -v` |
| Ver logs | 2 terminais separados | `docker-compose logs -f` |
| Performance | Nativa | Pequeno overhead (5-10%) |

### 3.3 Deploy/Produção

| Critério | Manual | Docker |
|----------|--------|--------|
| Consistência | Depende do servidor | Garantida |
| Portabilidade | Média | Alta |
| Rollback | Manual | `docker-compose up <versão>` |
| Isolamento | Baixo | Alto |

---

## 4. Vantagens do Docker

### 4.1 Para Desenvolvimento

✅ **Setup rápido:** Novo desenvolvedor funciona em minutos  
✅ **Consistência:** "Funciona na minha máquina" = funciona em todas  
✅ **Isolamento:** Não interfere com outras instalações locais  
✅ **Versões fixas:** Garantia de mesma versão PostgreSQL/Node para todos  
✅ **Limpeza fácil:** `docker-compose down -v` remove tudo  

### 4.2 Para Deploy

✅ **Portabilidade:** Roda igual em qualquer servidor  
✅ **Escalabilidade:** Fácil adicionar replicas  
✅ **Rollback:** Voltar versão anterior rapidamente  

### 4.3 Para Equipe Pequena

✅ **Menos tempo de setup:** Foco em desenvolvimento  
✅ **Menos problemas de ambiente:** Reduz "funciona aqui, não funciona lá"  
✅ **Documentação simplificada:** `docker-compose up` é auto-explicativo  

---

## 5. Desvantagens do Docker

### 5.1 Complexidade Adicional

❌ **Curva de aprendizado:** Equipe precisa aprender Docker  
❌ **Debugging:** Pode ser mais difícil debugar dentro de container  
❌ **Recursos:** Crostini (Linux no ChromeOS) pode ter limitações  

### 5.2 Performance

❌ **Overhead:** 5-10% mais lento (geralmente imperceptível)  
❌ **IO de arquivos:** Volume mounts podem ser lentos (dependendo do OS)  

### 5.3 Desvantagens Específicas

❌ **Debian/Crostini:** Pode ter limitações em virtualização aninhada  
❌ **Ferramentas locais:** Prisma Studio, psql precisam rodar via container  

---

## 6. Teste Prático

### 6.1 Criar Setup Docker de Teste

**Passos:**
1. Criar `docker-compose.yml` conforme exemplo acima
2. Criar `Dockerfile` para backend
3. Testar `docker-compose up`
4. Medir tempo de build e inicialização
5. Testar desenvolvimento (hot reload)

### 6.2 Métricas a Coletar

| Métrica | Manual | Docker |
|---------|--------|--------|
| Tempo para build inicial | N/A | _X minutos_ |
| Tempo para iniciar (cold start) | _Y segundos_ | _Z segundos_ |
| Tempo para iniciar (warm start) | _Y segundos_ | _Z segundos_ |
| Hot reload funciona? | Sim | _Sim/Não_ |
| Uso de RAM | _X MB_ | _Y MB_ |
| Uso de disco | _X MB_ | _Y MB_ |

---

## 7. Adequação para Debian 12 / Crostini

### 7.1 Compatibilidade

**Docker no Crostini:**
- ✅ Possível instalar Docker
- ⚠️ Pode ter limitações de performance
- ⚠️ Alguns recursos avançados podem não funcionar

**Teste de compatibilidade:**
```bash
# Verificar se Crostini suporta Docker
sudo apt update
sudo apt install docker.io docker-compose

# Testar
docker run hello-world
```

### 7.2 Alternativas no Crostini

- **Podman:** Alternativa ao Docker, sem daemon
- **LXC/LXD:** Containers mais leves
- **Desenvolvimento local:** Manter manual (se Docker não funcionar bem)

---

## 8. Impacto Para Equipe de 2 Desenvolvedores

### 8.1 Benefícios

1. **Onboarding rápido:** Se um dev novo entrar, setup é instant
2. **Ambiente idêntico:** Reduz "funciona no meu mas não no seu"
3. **Testes locais:** Fácil testar em ambiente limpo

### 8.2 Custos

1. **Aprendizado:** Tempo para aprender Docker
2. **Manutenção:** Manter Dockerfiles atualizados
3. **Debugging:** Pode ser mais complexo

### 8.3 Veredito para Equipe Pequena

> **Para 2 desenvolvedores experientes:** Docker pode ser overkill  
> **Para 2 desenvolvedores + possível crescimento:** Docker facilita onboarding  

---

## 9. Recomendação

### 9.1 Cenários

**Adotar Docker SE:**
- [ ] Equipe vai crescer (novos desenvolvedores)
- [ ] Deploy é complexo ou múltiplos ambientes
- [ ] Problemas frequentes de "funciona aqui, não funciona lá"
- [ ] Crostini suporta Docker bem (testar primeiro)

**NÃO adotar Docker SE:**
- [ ] Equipe permanece pequena (2 devs estáveis)
- [ ] Setup manual já funciona bem
- [ ] Crostini tem problemas com Docker
- [ ] Foco é simplificar, não adicionar layers

### 9.2 Decisão Sugerida

> [!NOTE]
> **Recomendação:** _A preencher após teste prático_
>
> **Justificativa:**
> - _Baseado em teste de compatibilidade no Crostini_
> - _Considerando tamanho da equipe_
> - _Avaliando complexidade vs benefício_

---

## 10. Implementação Gradual (Se Adotar)

### Fase 1: Docker para Desenvolvimento Local

```bash
# Apenas database no Docker
docker run -d \
  -p 5432:5432 \
  -e POSTGRES_USER=seduc_user \
  -e POSTGRES_PASSWORD=seduc_password \
  -e POSTGRES_DB=seduc_on \
  postgres:16-alpine
```

**Vantagem:** Simplifica setup do PostgreSQL, mantém Node.js local

### Fase 2: Docker Compose Completo

```bash
# Backend + database no Docker
docker-compose up
```

### Fase 3: Produção (Opcional)

```bash
# Deploy com Docker em servidor
docker-compose -f docker-compose.prod.yml up -d
```

---

## 11. Alternativa: Scripts de Setup

**Se NÃO adotar Docker, melhorar scripts de setup:**

**`setup.sh`:**
```bash
#!/bin/bash

# Verificar dependências
command -v node >/dev/null 2>&1 || { echo "Node.js não instalado"; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "PostgreSQL não instalado"; exit 1; }

# Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# Setup database
sudo -u postgres psql -c "CREATE DATABASE seduc_on;"
sudo -u postgres psql -c "CREATE USER seduc_user WITH PASSWORD 'password';"

# Rodar migrations
cd backend && npx prisma migrate deploy

echo "✅ Setup concluído! Execute 'npm run dev' para iniciar."
```

**Vantagem:** Simplifica sem adicionar Docker

---

## 12. Conclusão

### Perguntas Finais

1. **Docker funciona bem no Crostini?** _Sim/Não_
2. **Equipe está confortável com Docker?** _Sim/Não_
3. **Setup manual causa problemas frequentes?** _Sim/Não_
4. **Há planos de crescer a equipe?** _Sim/Não_

### Decisão Final

**Se 3+ respostas "Sim":** Considerar adotar Docker  
**Se 2- respostas "Sim":** Manter setup manual + melhorar scripts

---

## Referências

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
