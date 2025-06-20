#!/bin/bash
# Script para adicionar Issues 1 a 6 na coluna "To do" do seu Project Board no GitHub
# Requisitos:
# - GitHub CLI instalada e autenticada (gh auth login)
# - Número do Project: 1 (conforme URL https://github.com/users/Gerson-Santiago/projects/1/views/1)
# - Coluna alvo: "To do"

PROJECT_NUMBER=1
COLUMN_NAME="To do"

for ISSUE_NUMBER in 1 2 3 4 5 6; do
  echo "Adicionando Issue #$ISSUE_NUMBER à coluna '$COLUMN_NAME' do projeto $PROJECT_NUMBER..."
  gh project card create \
    --project $PROJECT_NUMBER \
    --column "$COLUMN_NAME" \
    --issue $ISSUE_NUMBER
done

echo "✅ Todas as Issues foram adicionadas ao Project com sucesso!"
