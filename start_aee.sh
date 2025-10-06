#!/bin/bash
# =====================================
# Script de inicialização do projeto AEE
# =====================================
# Autor: Gerson Santiago
# Data: 2025-10-06
# Função: Iniciar PostgreSQL, backend e frontend do sistema AEE
# =====================================

# Diretórios base (ajuste se necessário)
BASE_DIR="/mnt/c/Users/gerson_6061/Desktop/PROJETOS/aee"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend-aee-vite"

# Função para exibir cabeçalho bonito
echo "====================================="
echo " 🚀 Iniciando ambiente do projeto AEE "
echo "====================================="

# 1️⃣ Subir PostgreSQL
echo "🟡 Verificando status do PostgreSQL..."
sudo service postgresql status | grep "online" > /dev/null
if [ $? -eq 0 ]; then
  echo "✅ PostgreSQL já está online."
else
  echo "🔵 Iniciando PostgreSQL..."
  sudo service postgresql start
  sleep 2
  sudo service postgresql status
fi

# 2️⃣ Iniciar backend
echo
echo "🟡 Iniciando BACKEND..."
cd "$BACKEND_DIR" || { echo "❌ Erro: pasta backend não encontrada!"; exit 1; }

# Garante que estamos na branch de desenvolvimento
# git checkout dev

# Executa o servidor backend em modo preview
echo "🚀 Rodando backend em http://localhost:3000 ..."
npm run preview &

# Espera alguns segundos para garantir inicialização
sleep 5

# 3️⃣ Iniciar frontend
echo
echo "🟡 Iniciando FRONTEND..."
cd "$FRONTEND_DIR" || { echo "❌ Erro: pasta frontend não encontrada!"; exit 1; }

# Garante que estamos na branch de desenvolvimento
# git checkout dev

echo "🚀 Rodando frontend em http://localhost:4173/aee ..."
npm run preview &

echo
echo "====================================="
echo "✅ Sistema AEE em execução!"
echo "Backend:  http://localhost:3000"
echo "Frontend: http://localhost:4173/aee/"
echo "====================================="
