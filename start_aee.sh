#!/bin/bash
# =====================================
# Script de inicialização do projeto AEE para Crostini (Debian 12)
# Suporta: dev (porta 3001/5173) e preview (porta 3000/4173)
# Blindado contra variáveis de ambiente "fantasmas"
# =====================================
# Autor: Gerson Santiago
# Data: 2025-11-26 (Atualizado)
# =====================================

# 📂 Diretórios Base (Com tratamento de erro para links simbólicos/alias)
# Tenta pegar o diretório real, mesmo se chamado via alias
SOURCE=${BASH_SOURCE[0]}
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )
  SOURCE=$(readlink "$SOURCE")
  [[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
BASE_DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )

BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend"

# Cluster PostgreSQL
PG_CLUSTER_VERSION="18"
PG_CLUSTER_NAME="main"

# Parâmetro: dev | preview | stop
ENV_MODE=${1:-dev}

# =====================================
# Funções
# =====================================

# 🧹 Limpa variáveis da memória para evitar conflitos (O "Exorcismo")
sanitize_env() {
    unset PORT
    unset FRONTEND_URL
    unset ALLOWED_ORIGINS
    unset GOOGLE_REDIRECT_URI
    unset NODE_ENV
    # Não damos unset no PATH ou variáveis do sistema, apenas as do app
}

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
    cd "$BACKEND_DIR" || { echo "❌ Pasta backend não encontrada em $BACKEND_DIR"; exit 1; }
    
    # Garante a limpeza antes de rodar
    sanitize_env
    
    if [ "$ENV_MODE" = "dev" ]; then
        # Força NODE_ENV development
        NODE_ENV=development npm run dev &
    else
        # Força NODE_ENV preview
        NODE_ENV=preview npm run preview &
    fi
}

start_frontend() {
    echo "🟡 Iniciando FRONTEND ($ENV_MODE)..."
    cd "$FRONTEND_DIR" || { echo "❌ Pasta frontend não encontrada em $FRONTEND_DIR"; exit 1; }
    
    # Garante a limpeza antes de rodar
    sanitize_env

    if [ "$ENV_MODE" = "dev" ]; then
        npm run dev &
    else
        npm run build:preview || { echo "❌ Build do frontend falhou!"; exit 1; }
        npm run preview &
    fi
}

# =====================================
# Execução
# =====================================
case "$ENV_MODE" in
    stop)
        cleanup
        echo "Processos em segundo plano:"
        pgrep -f "node server.js" || echo "Nenhum processo NODE encontrado."
        pgrep -f "vite" || echo "Nenhum processo VITE encontrado."
        echo "✅ Todos os processos foram encerrados."
        exit 0
        ;;
    dev|preview)
        echo "====================================="
        echo " 🚀 Inicializando projeto AEE ($ENV_MODE)"
        echo "    Diretório Base: $BASE_DIR"
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

# 4️⃣ Finalização (Apenas informativo)
cd "$BASE_DIR"
BACKEND_PORT=$([ "$ENV_MODE" = "dev" ] && echo 3001 || echo 3000)
FRONTEND_PORT=$([ "$ENV_MODE" = "dev" ] && echo 5173 || echo 4173)

echo
echo "====================================="
echo "✅ Sistema AEE em execução ($ENV_MODE)!"
echo "Backend:  http://localhost:$BACKEND_PORT"
echo "Frontend: http://localhost:$FRONTEND_PORT/aee/"
echo "Para parar processos: ./start_aee_crostini.sh stop"
echo "Processos em segundo plano:"
pgrep -f "node server.js" | xargs -r echo "  Backend PID(s):"
pgrep -f "vite" | xargs -r echo "  Frontend PID(s):"
echo "====================================="