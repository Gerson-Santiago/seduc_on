#!/bin/bash
# scripts/setup_env.sh
# ============================================================
# Configura os arquivos .env do projeto SEDUC ON interativamente
# Gera: backend/.env.dev, backend/.env.preview, frontend/.env.dev,
#        frontend/.env.preview a partir dos .env.example
#
# Uso:
#   ./scripts/setup_env.sh          → modo interativo (pergunta cada valor)
#   ./scripts/setup_env.sh --silent → usa só os defaults dos .env.example
# ============================================================

set -e

# ── Cores ────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

# ── Diretórios ───────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$BASE_DIR/backend"
FRONTEND_DIR="$BASE_DIR/frontend"
SILENT=${1:-""}

echo -e "${BOLD}${CYAN}"
echo "╔══════════════════════════════════════════╗"
echo "║     🔧 SEDUC ON — Setup de Ambiente      ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# ── Funções utilitárias ──────────────────────────────────────

# Lê uma variável de um arquivo .env
get_env_value() {
    local file="$1" key="$2"
    grep -E "^${key}=" "$file" 2>/dev/null | cut -d'=' -f2- | tr -d '"' || echo ""
}

# Pergunta ao usuário e usa o default se vazio
ask() {
    local label="$1" default="$2" varname="$3"
    if [ "$SILENT" = "--silent" ]; then
        eval "$varname='$default'"
        return
    fi
    echo -ne "${YELLOW}  ${label}${NC} [${default}]: "
    read -r input
    eval "$varname='${input:-$default}'"
}

# Gera um arquivo .env a partir de um template + substituições
generate_env() {
    local template="$1" output="$2"
    if [ -f "$output" ]; then
        echo -e "  ${YELLOW}⚠️  $output já existe. Sobrescrever? (s/N)${NC}"
        read -r overwrite
        if [[ "$overwrite" != "s" && "$overwrite" != "S" ]]; then
            echo -e "  ${CYAN}↩ Mantido sem alteração.${NC}"
            return 1
        fi
    fi
    return 0
}

# ── Coleta valores compartilhados ────────────────────────────
echo -e "${BOLD}📋 Valores compartilhados entre todos os ambientes:${NC}\n"

BACKEND_EXAMPLE="$BACKEND_DIR/.env.example"
FRONTEND_EXAMPLE="$FRONTEND_DIR/.env.example"

DEFAULT_CLIENT_ID=$(get_env_value "$BACKEND_EXAMPLE" "GOOGLE_CLIENT_ID")
DEFAULT_DB_USER="aee_user"
DEFAULT_DB_PASS="MinhaSenhaSegura123"
DEFAULT_DB_NAME="aee_db"
DEFAULT_JWT="ulunonaredeMinhaSenhaSegura123"
DEFAULT_ADMIN_EMAIL=$(get_env_value "$BACKEND_EXAMPLE" "SUPERADMIN_EMAIL")
DEFAULT_ADMIN_NAME=$(get_env_value "$BACKEND_EXAMPLE" "SUPERADMIN_NAME")
DEFAULT_DOMAIN=$(get_env_value "$FRONTEND_EXAMPLE" "VITE_INSTITUTION_DOMAIN")
DEFAULT_URL_SED=$(get_env_value "$BACKEND_EXAMPLE" "URL_VALIDASED")

ask "Google Client ID" "$DEFAULT_CLIENT_ID" GOOGLE_CLIENT_ID
ask "DB Usuário PostgreSQL" "$DEFAULT_DB_USER" DB_USER
ask "DB Senha PostgreSQL" "$DEFAULT_DB_PASS" DB_PASS
ask "DB Nome do banco" "$DEFAULT_DB_NAME" DB_NAME
ask "JWT Secret" "$DEFAULT_JWT" JWT_SECRET
ask "SuperAdmin Email" "$DEFAULT_ADMIN_EMAIL" SUPERADMIN_EMAIL
ask "SuperAdmin Nome" "$DEFAULT_ADMIN_NAME" SUPERADMIN_NAME
ask "Domínio institucional (emails)" "$DEFAULT_DOMAIN" INSTITUTION_DOMAIN
ask "URL base da API SED" "$DEFAULT_URL_SED" URL_VALIDASED

DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5433/${DB_NAME}"

echo ""

# ── backend/.env.dev ─────────────────────────────────────────
TARGET="$BACKEND_DIR/.env.dev"
echo -e "${BOLD}1️⃣  Gerando ${TARGET}...${NC}"
if generate_env "$BACKEND_EXAMPLE" "$TARGET"; then
cat > "$TARGET" << EOF
# backend/.env.dev — Desenvolvimento (porta 3001)
NODE_ENV=development
PORT=3001

FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173

GOOGLE_REDIRECT_URI=http://localhost:5173/aee/auth/callback
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

DATABASE_URL="${DATABASE_URL}"

SUPERADMIN_EMAIL=${SUPERADMIN_EMAIL}
SUPERADMIN_NAME="${SUPERADMIN_NAME}"
JWT_SECRET=${JWT_SECRET}

# SED — Secretaria de Educação do Estado
LOGIN_AUTH_SED=login
SED_AUTH=auth
URL_VALIDASED=${URL_VALIDASED}
EOF
echo -e "  ${GREEN}✅ Criado.${NC}"
fi

# ── backend/.env.preview ─────────────────────────────────────
TARGET="$BACKEND_DIR/.env.preview"
echo -e "${BOLD}2️⃣  Gerando ${TARGET}...${NC}"
if generate_env "$BACKEND_EXAMPLE" "$TARGET"; then
cat > "$TARGET" << EOF
# backend/.env.preview — Preview (porta 3000)
NODE_ENV=preview
PORT=3000

FRONTEND_URL=http://localhost:4173
ALLOWED_ORIGINS=http://localhost:4173

GOOGLE_REDIRECT_URI=http://localhost:4173/aee/auth/callback
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}

DATABASE_URL="${DATABASE_URL}"

SUPERADMIN_EMAIL=${SUPERADMIN_EMAIL}
SUPERADMIN_NAME="${SUPERADMIN_NAME}"
JWT_SECRET=${JWT_SECRET}

# SED — Secretaria de Educação do Estado
LOGIN_AUTH_SED=login
SED_AUTH=auth
URL_VALIDASED=${URL_VALIDASED}
EOF
echo -e "  ${GREEN}✅ Criado.${NC}"
fi

# ── frontend/.env.dev ────────────────────────────────────────
TARGET="$FRONTEND_DIR/.env.dev"
echo -e "${BOLD}3️⃣  Gerando ${TARGET}...${NC}"
if generate_env "$FRONTEND_EXAMPLE" "$TARGET"; then
cat > "$TARGET" << EOF
# frontend/.env.dev — Desenvolvimento (porta 5173)
VITE_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
VITE_APP_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_LOGIN_PATH=/login
VITE_DASHBOARD_PATH=/dashboard
VITE_BASE_URL=/
VITE_INSTITUTION_DOMAIN=${INSTITUTION_DOMAIN}
VITE_APP_PORT=5173
VITE_APP_PORT_PREVIEW=4173
VITE_APP_MODE=development
EOF
echo -e "  ${GREEN}✅ Criado.${NC}"
fi

# ── frontend/.env.preview ────────────────────────────────────
TARGET="$FRONTEND_DIR/.env.preview"
echo -e "${BOLD}4️⃣  Gerando ${TARGET}...${NC}"
if generate_env "$FRONTEND_EXAMPLE" "$TARGET"; then
cat > "$TARGET" << EOF
# frontend/.env.preview — Preview (porta 4173)
VITE_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
VITE_APP_URL=http://localhost:4173
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_REDIRECT_URI=http://localhost:4173/auth/callback
VITE_LOGIN_PATH=/login
VITE_DASHBOARD_PATH=/dashboard
VITE_BASE_URL=/
VITE_INSTITUTION_DOMAIN=${INSTITUTION_DOMAIN}
VITE_APP_PORT=4173
VITE_APP_PORT_PREVIEW=4173
VITE_APP_MODE=preview
EOF
echo -e "  ${GREEN}✅ Criado.${NC}"
fi

# ── Resumo final ─────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════╗"
echo "║     ✅ Ambiente configurado com sucesso! ║"
echo "╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${CYAN}Próximos passos:${NC}"
echo "  1. Criar banco de dados:"
echo "     sudo -u postgres psql -c \"CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';\""
echo "     sudo -u postgres psql -c \"CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};\""
echo ""
echo "  2. Rodar migrations:"
echo "     cd backend && pnpm dlx prisma migrate deploy"
echo ""
echo "  3. Iniciar o projeto:"
echo "     ./start_seduc_on.sh dev"
echo ""
