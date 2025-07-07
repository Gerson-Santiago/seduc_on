#!/usr/bin/env bash
set -e

# 1) Verifica se estamos na raiz do projeto (onde estão as pastas backend e frontend-aee-vite)
ROOT_DIR="$(pwd)"
echo "Iniciando auditoria a partir de: $ROOT_DIR"
echo

# 2) Backend
echo "== Auditoria: BACKEND =="
cd "$ROOT_DIR/backend" || { echo "Pasta backend não encontrada em $ROOT_DIR"; exit 1; }
echo "--> Mudando para branch dev"
git checkout dev
echo "--> Diretório atual: $(pwd)"
echo "--> Listando node-domexception (se houver)"
npm ls node-domexception || true
echo "--> Executando npm audit"
npm audit
echo

# 3) Frontend
echo "== Auditoria: FRONTEND =="
cd "$ROOT_DIR/frontend-aee-vite" || { echo "Pasta frontend-aee-vite não encontrada em $ROOT_DIR"; exit 1; }
echo "--> Mudando para branch dev"
git checkout dev
echo "--> Diretório atual: $(pwd)"
echo "--> Listando node-domexception (se houver)"
npm ls node-domexception || true
echo "--> Executando npm audit"
npm audit
echo

# 4) Retorna à raiz
cd "$ROOT_DIR"
echo "Auditoria concluída. Voltando para: $ROOT_DIR"
