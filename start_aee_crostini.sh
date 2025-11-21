#!/bin/bash
# =====================================
# Script de inicialização do projeto AEE para Crostini (Debian 12)
# =====================================
# Autor: Gerson Santiago
# Data: 2025-11-21
# Função: Iniciar PostgreSQL 18, backend e frontend, garantindo o build do Vite com BASE '/aee/'.
# =====================================

# ⚠️ AJUSTE CRUCIAL 1: Diretórios Base
# Define o caminho absoluto da pasta onde o script está sendo executado.
BASE_DIR=$(cd "$(dirname "$0")" && pwd) 
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend-aee-vite"

# Definição do Cluster PostgreSQL
PG_CLUSTER_VERSION="18"
PG_CLUSTER_NAME="main"

# =====================================
# Funções de Gerenciamento
# =====================================

# Função para limpar processos antigos do backend e frontend antes de iniciar.
cleanup() {
    echo "🧹 Parando processos ativos do projeto (Node/Nodemon/Vite)..."
    # Tenta matar processos Node/Nodemon/Vite associados aos arquivos do projeto
    pkill -f "node server.js"
    pkill -f "vite preview"
    # Aguarda um momento para a porta ser liberada
    sleep 1
}

# Função para exibir cabeçalho bonito
echo "====================================="
echo " 🚀 Iniciando ambiente do projeto AEE (Crostini/Debian) "
echo "====================================="

# Chama a limpeza
cleanup

# 1️⃣ Subir PostgreSQL (USANDO pg_ctlcluster)
echo "🟡 Verificando status do PostgreSQL ${PG_CLUSTER_VERSION}..."

# Verifica o status usando pg_ctlcluster
sudo pg_ctlcluster ${PG_CLUSTER_VERSION} ${PG_CLUSTER_NAME} status > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ PostgreSQL ${PG_CLUSTER_VERSION} já está online."
else
    echo "🔵 Iniciando PostgreSQL ${PG_CLUSTER_VERSION}..."
    sudo pg_ctlcluster ${PG_CLUSTER_VERSION} ${PG_CLUSTER_NAME} start
    sleep 3
    sudo pg_ctlcluster ${PG_CLUSTER_VERSION} ${PG_CLUSTER_NAME} status
fi

# 2️⃣ Iniciar backend
echo
echo "🟡 Iniciando BACKEND..."
# Navega para o diretório backend
cd "$BACKEND_DIR" || { echo "❌ Erro: pasta backend não encontrada! Verifique o caminho."; exit 1; }

echo "🚀 Rodando backend em http://localhost:3000 ..."
npm run preview &

# Espera alguns segundos para garantir inicialização
sleep 5

# 3️⃣ Iniciar frontend
echo
echo "🟡 Iniciando FRONTEND..."

# AJUSTE CRUCIAL: Volta para o diretório base
cd "$BASE_DIR"

# Navega para o diretório frontend
cd "$FRONTEND_DIR" || { echo "❌ Erro: pasta frontend não encontrada! Verifique o caminho."; exit 1; }

# NOVO PASSO: Rodar o build com o modo 'preview' para garantir a base '/aee/' correta.
echo "🛠️ Rodando Build do Frontend no modo 'preview'..."
npm run build:preview || { echo "❌ Erro: Build do Frontend falhou! Verifique logs e dependências."; exit 1; }

echo "🚀 Rodando frontend em http://localhost:4173/aee ..."
npm run preview &

# 4️⃣ Finalização
# Volta para o diretório inicial
cd "$BASE_DIR"

echo
echo "====================================="
echo "✅ Sistema AEE em execução!"
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:4173/aee/"

# Exibir PIDs
echo "Para parar os processos, use 'kill [PID]' ou rode 'cleanup' no terminal."
echo "Processos em segundo plano:"
pgrep -f "node server.js" | xargs -r echo "  Backend PID(s):"
pgrep -f "vite preview" | xargs -r echo "  Frontend PID(s):"
echo "====================================="