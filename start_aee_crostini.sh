#!/bin/bash
# =====================================
# Script de inicialização do projeto AEE para Crostini (Debian 12)
# Suporta: dev (porta 3001/5173) e preview (porta 3000/4173)
# Modo padrão: dev
# Função adicional: stop
# =====================================
# Autor: Gerson Santiago
# Data: 2025-11-23
# =====================================

# 📂 Diretórios Base
BASE_DIR=$(cd "$(dirname "$0")" && pwd)
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend-aee-vite"

# Cluster PostgreSQL
PG_CLUSTER_VERSION="18"
PG_CLUSTER_NAME="main"

# Parâmetro: dev | preview | stop
ENV_MODE=${1:-dev}

# =====================================
# Funções
# =====================================
cleanup() {
    echo "🧹 Parando processos ativos (Node/Nodemon/Vite)..."
    pkill -f "node server.js"
    pkill -f "vite"
    sleep 1
}

start_postgres() {
    echo "🟡 Verificando PostgreSQL $PG_CLUSTER_VERSION..."
    sudo pg_ctlcluster $PG_CLUSTER_VERSION $PG_CLUSTER_NAME status > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ PostgreSQL já está online."
    else
        echo "🔵 Iniciando PostgreSQL..."
        sudo pg_ctlcluster $PG_CLUSTER_VERSION $PG_CLUSTER_NAME start
        sleep 3
        sudo pg_ctlcluster $PG_CLUSTER_VERSION $PG_CLUSTER_NAME status
    fi
}

start_backend() {
    echo "🟡 Iniciando BACKEND ($ENV_MODE)..."
    cd "$BACKEND_DIR" || { echo "❌ Pasta backend não encontrada!"; exit 1; }
    if [ "$ENV_MODE" = "dev" ]; then
        npm run dev &
    else
        npm run preview &
    fi
}

start_frontend() {
    echo "🟡 Iniciando FRONTEND ($ENV_MODE)..."
    cd "$FRONTEND_DIR" || { echo "❌ Pasta frontend não encontrada!"; exit 1; }
    if [ "$ENV_MODE" = "dev" ]; then
        npm run dev &
    else
        npm run build:preview || { echo "❌ Build do frontend falhou!"; exit 1; }
        npm run preview &
        # ADIÇÃO IMPORTANTE: Espera por 10 segundos no modo preview
        if [ "$ENV_MODE" = "preview" ]; then
            echo "Aguardando 10s para estabilização do servidor preview..."
            sleep 10
        fi
    fi
}

# =====================================
# Execução
# =====================================
case "$ENV_MODE" in
    stop)
        cleanup

        echo "Processos em segundo plano:"
        # pgrep -f "node server.js" for vazio escreve "Nenhum processo NODE encontrado."
        pgrep -f "node server.js" || echo "Nenhum processo NODE encontrado."
        pgrep -f "vite" || echo "Nenhum processo VITE encontrado."
        #pgrep -f "node server.js" | xargs -r echo "  Backend PID(s):"
        #pgrep -f "vite" | xargs -r echo "  Frontend PID(s):"
        echo "✅ Todos os processos foram encerrados."
        exit 0
        ;;
    dev|preview)
        echo "====================================="
        echo " 🚀 Inicializando projeto AEE ($ENV_MODE)"
        echo "====================================="
        cleanup
        start_postgres
        start_backend
        sleep 5
        start_frontend
        ;;
    *)
        echo "❌ Parâmetro inválido. Use: dev | preview | stop"
        exit 1
        ;;
esac

# 4️⃣ Finalização
cd "$BASE_DIR"
BACKEND_PORT=$([ "$ENV_MODE" = "dev" ] && echo 3001 || echo 3000)
FRONTEND_PORT=$([ "$ENV_MODE" = "dev" ] && echo 5173 || echo 4173)

echo
echo "====================================="
echo "✅ Sistema AEE em execução!"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo "Frontend: http://localhost:$FRONTEND_PORT/aee/"
echo "Para parar processos: ./start_aee_crostini.sh stop"
echo "Processos em segundo plano:"
pgrep -f "node server.js" | xargs -r echo "  Backend PID(s):"
pgrep -f "vite" | xargs -r echo "  Frontend PID(s):"
echo "====================================="
