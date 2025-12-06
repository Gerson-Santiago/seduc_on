# Infraestrutura (Docker)

**Data da Última Atualização:** Dezembro 2025

Este documento descreve o ambiente de execução containerizado do SEDUC ON.

## 🐳 Docker Compostion

O ambiente é gerenciado via `docker-compose`, orquestrando os seguintes serviços:

### Serviços
1.  **Application (Backend):**
    *   Imagem: Node.js 20 (Alpine)
    *   Comando: `npm start`
    *   Porta: 3000

2.  **Database (PostgreSQL):**
    *   Imagem: Postgres 15+
    *   Porta: 5432
    *   Persistência: Volume Docker (`seduc_pgdata`)

## 🚀 Comandos Úteis

```bash
# Subir todo o ambiente (em background)
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar serviços
docker-compose down

# Resetar banco de dados (Cuidado!)
docker-compose down -v
```

> **Nota de Performance:** Recomenda-se rodar o banco de dados nativamente em produção para IOPS máximo, a menos que se utilize orquestração avançada (Kubernetes).
