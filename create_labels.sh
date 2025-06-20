#!/bin/bash
# Script para criar labels no GitHub usando gh CLI
# Requisitos: gh CLI instalado e autenticado

# 1. auth
gh label create auth --color d73a4a --description "Autenticação e sessão de usuário"

# 2. bug
gh label create bug --color eb6420 --description "Erros e correções"

# 3. persistência
gh label create persistência --color 0e8a16 --description "Persistência de dados/localStorage"

# 4. security
gh label create security --color b60205 --description "Questões de segurança e permissão"

# 5. backend
gh label create backend --color 006b75 --description "Funcionalidades e lógica de servidor"

# 6. refactor
gh label create refactor --color cfd3d7 --description "Refatoração de código"

# 7. layout
gh label create layout --color a2eeef --description "Ajustes de layout e UI"

# 8. acesso
gh label create acesso --color 5319e7 --description "Controle de acesso por perfil"

# 9. enhancement
gh label create enhancement --color a2eeef --description "Melhorias e novas funcionalidades"

# 10. UX
gh label create UX --color f9d0c4 --description "Melhorias de experiência do usuário"

# 11. sidebar
gh label create sidebar --color 0366d6 --description "Tarefas da Sidebar"

# 12. feature
gh label create feature --color 0052cc --description "Novas funcionalidades"

# 13. API
gh label create API --color 84b6eb --description "Integrações e chamadas de API"

# 14. alunos
gh label create alunos --color d4c5f9 --description "Funcionalidades relacionadas a alunos"

echo "Todas as labels foram criadas com sucesso!"
