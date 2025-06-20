#!/bin/bash
# Script para criar 6 issues automatizadas no GitHub usando GitHub CLI
# Requisitos: gh CLI instalado e autenticado (gh auth login)

# 1. Issue 1: Persistência de sessão do usuário
gh issue create \
  --title "Persistência de autenticação do usuário após recarregamento" \
  --body "**Descrição:**\nAo recarregar a página, o usuário é desconectado por falta de persistência eficaz do login no localStorage.\n\n**Tarefas:**\n- [ ] Em AuthContext.jsx, ao inicializar, buscar em localStorage (token, email, nome).\n- [ ] Se existir, definir o usuário no estado do contexto antes de qualquer redirecionamento.\n- [ ] Após login, serializar e gravar no localStorage as informações de usuário.\n- [ ] Ajustar AppRoutes.jsx / main.jsx para aguardar o carregamento do contexto antes de renderizar as rotas." \
  --assignee "Gerson-Santiago" \
  --label "auth,bug,persistência"

# 2. Issue 2: Restringir login para e‑mails autorizados
gh issue create \
  --title "Verificar domínio e permissão no login Google" \
  --body "**Descrição:**\nPermitir acesso apenas a usuários com e‑mails do domínio @seducbertioga.com.br e que possuam permissão ativa no banco.\n\n**Tarefas:**\n- [ ] Em auth.jsx, extrair domínio do e‑mail retornado pelo Google OAuth.\n- [ ] Rejeitar autenticação se domínio ≠ seducbertioga.com.br.\n- [ ] Em AuthContext.jsx, chamar endpoint /auth/verify (via Prisma) para checar permissão ativa.\n- [ ] No backend, em usuario.controller.js, criar rota /auth/verify que consulta o banco e retorna status de permissão." \
  --assignee "Gerson-Santiago" \
  --label "auth,security,backend"

# 3. Issue 3: Criar MainContextBase reutilizável
gh issue create \
  --title "Estruturar layout base com MainContext" \
  --body "**Descrição:**\nConstruir um componente base que una TopBar, Sidebar e MainContent, permitindo fácil criação de novas páginas.\n\n**Tarefas:**\n- [ ] Criar MainContextBase.jsx em src/components/.\n- [ ] Definir slots (props.children) para conteúdo dinâmico.\n- [ ] Adicionar controle de visibilidade de botões por perfil (superadmin/admin/comum).\n- [ ] Documentar uso no README.md." \
  --assignee "Gerson-Santiago" \
  --label "refactor,layout,acesso"

# 4. Issue 4: Atualizar página /dashboard2
gh issue create \
  --title "Ajustar /dashboard2 para usar o layout padrão" \
  --body "**Descrição:**\nAdaptar a página /dashboard2 para o novo padrão de layout com o MainContextBase.\n\n**Tarefas:**\n- [ ] Substituir JSX em pages/Dashboard2.jsx para usar MainContextBase.\n- [ ] Passar cabeçalho e conteúdo específicos como children.\n- [ ] Ajustar espaçamentos em components/Sidebar.jsx e MainContent.jsx.\n- [ ] Testar responsividade (<768px e >1200px)." \
  --assignee "Gerson-Santiago" \
  --label "enhancement,layout,UX"

# 5. Issue 5: Aprimorar navegação da Sidebar
gh issue create \
  --title "Reorganizar e melhorar botões da Sidebar" \
  --body "**Descrição:**\nMelhorar a usabilidade da Sidebar, ajustando ícones, labels e posição do campo de busca.\n\n**Tarefas:**\n- [ ] Decidir se o campo de busca fica em Sidebar.jsx ou MainContextBase.\n- [ ] Adicionar botão Escolas (ícone storefront).\n- [ ] Atualizar ícones e labels: 🔍 Buscar…, 📊 Dashboard, 🏫 Escolas, 🕘 Recentes, ⭐ Favoritos, 📅 Calendário, 👥 Usuários, ⚙️ Configurações.\n- [ ] Testar colapso/expansão mantendo usabilidade." \
  --assignee "Gerson-Santiago" \
  --label "UX,sidebar,layout"

# 6. Issue 6: Tela de consulta de aluno via API
gh issue create \
  --title "Criar tela protegida para busca de aluno" \
  --body "**Descrição:**\nImplementar uma tela dentro do MainContextBase para consultar alunos por RA via API.\n\n**Tarefas:**\n- [ ] Em pages/AlunoPage.jsx, usar MainContextBase.\n- [ ] Criar features/alunos/components/BuscaAluno.jsx com input de RA e botão “Buscar”.\n- [ ] Em src/api/index.jsx, implementar fetchAlunoByRA(ra).\n- [ ] Exibir resultados em AlunoCard.jsx, tratando loading e erros.\n- [ ] Estilizar com grid responsivo." \
  --assignee "Gerson-Santiago" \
  --label "feature,API,alunos"

# Fim do script
echo "Todas as 6 issues foram criadas com sucesso."
