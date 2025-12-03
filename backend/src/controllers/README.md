# Controllers

Esta pasta contém os **controllers** da aplicação SEDUC ON. Os controllers são responsáveis por gerenciar as requisições HTTP, validar entradas, chamar os serviços de negócio apropriados e retornar as respostas formatadas aos clientes.

## 📋 Visão Geral

Os controllers seguem o padrão **MVC (Model-View-Controller)** e atuam como camada de interface entre as rotas HTTP e a camada de serviços/negócio. Cada controller é responsável por um domínio específico da aplicação.

## 📁 Estrutura de Arquivos

```
controllers/
├── aluno.controller.js       # Gerenciamento de alunos (CRUD, busca, estatísticas)
├── escola.controller.js       # Gerenciamento de escolas e estatísticas por série
├── matricula.controller.js    # Gerenciamento de matrículas
└── usuario.controller.js      # Autenticação e gerenciamento de usuários
```

## 🎯 Responsabilidades

Cada controller é responsável por:

1. **Receber requisições HTTP** - Processar parâmetros de rota, query strings e body
2. **Validar entradas** - Garantir que os dados recebidos estão no formato correto
3. **Chamar serviços** - Delegar a lógica de negócio para a camada de serviços
4. **Tratar erros** - Capturar exceções e retornar respostas HTTP apropriadas
5. **Formatar respostas** - Retornar dados em formato JSON com códigos de status corretos

## 📚 Controllers Disponíveis

### [aluno.controller.js](file:///home/sant/seduc_on/backend/src/controllers/aluno.controller.js)

Gerencia todas as operações relacionadas a alunos.

**Funções exportadas:**
- `getEstatisticas(req, res)` - Retorna estatísticas gerais de alunos
- `listarAlunos(req, res)` - Lista alunos com filtros e paginação
- `buscarAluno(req, res)` - Busca aluno específico por RA
- `criarAluno(req, res)` - Cria novo aluno
- `atualizarAluno(req, res)` - Atualiza dados de um aluno
- `removerAluno(req, res)` - Remove aluno do sistema

**Principais recursos:**
- Busca por RA (Registro do Aluno)
- Filtros por nome, escola e série
- Paginação de resultados
- Tratamento de erros Prisma (P2025)

### [escola.controller.js](file:///home/seduc_on/backend/src/controllers/escola.controller.js)

Gerencia operações relacionadas a escolas e estatísticas educacionais.

**Funções exportadas:**
- `listarEscolas(req, res)` - Lista todas as escolas cadastradas
- `getStats(req, res)` - Retorna estatísticas otimizadas por série/modalidade

**Principais recursos:**
- Query otimizada com `CASE` para estatísticas (1 query ao invés de 12)
- Agregação de dados por categorias educacionais:
  - Educação Infantil: berçário, maternal, pré-escola
  - Ensino Fundamental: 1º ao 5º ano
  - EJA: EJA1 e EJA2
  - Educação Especial: AEE e Educação Exclusiva

### [matricula.controller.js](file:///home/sant/seduc_on/backend/src/controllers/matricula.controller.js)

Gerencia operações relacionadas a matrículas de alunos.

**Principais recursos:**
- CRUD de matrículas
- Consultas de matrícula por aluno
- Histórico escolar

### [usuario.controller.js](file:///home/seduc_on/backend/src/controllers/usuario.controller.js)

Gerencia autenticação e operações de usuários.

**Funções exportadas:**
- `loginUsuario(req, res)` - Autenticação via Google OAuth
- `getMe(req, res)` - Retorna dados do usuário autenticado

**Principais recursos:**
- Integração com Google OAuth 2.0
- Validação de domínio (`seducbertioga.com.br`)
- Geração e validação de JWT
- Sincronização de foto de perfil do Google
- Proteção de rotas com middleware de autenticação

## 🔧 Padrões e Convenções

### 1. Tratamento de Erros

Todos os controllers implementam tratamento de erros consistente:

```javascript
try {
  // Lógica do controller
} catch (err) {
  handleError(res, err);
}
```

**Códigos de status HTTP utilizados:**
- `200` - Sucesso (GET, PUT)
- `201` - Recurso criado (POST)
- `204` - Sem conteúdo (DELETE)
- `400` - Requisição inválida
- `401` - Não autenticado
- `403` - Não autorizado (domínio incorreto)
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

### 2. Estrutura de Resposta

**Sucesso:**
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

**Erro:**
```json
{
  "error": "Descrição do erro",
  "details": "Detalhes técnicos (apenas em desenvolvimento)"
}
```

### 3. Acesso ao Prisma

Todos os controllers recebem a instância do Prisma através de `req.prisma`, injetada por middleware:

```javascript
export async function example(req, res) {
  const data = await req.prisma.model.findMany();
  res.json(data);
}
```

### 4. Funções Assíncronas

Todas as funções de controller são `async` para suportar operações assíncronas do Prisma:

```javascript
export async function functionName(req, res) {
  // await operations
}
```

## 🔗 Integração com Serviços

Os controllers **NÃO** devem conter lógica de negócio complexa. Toda a lógica de negócio deve estar na camada de serviços (`../services/`):

```javascript
// ❌ Evitar - lógica de negócio no controller
export async function criarAluno(req, res) {
  const aluno = await req.prisma.aluno.create({
    data: req.body
  });
  // validações complexas, cálculos, etc.
}

// ✅ Correto - delegar para o serviço
export async function criarAluno(req, res) {
  const aluno = await AlunoService.createAluno(req.prisma, req.body);
  res.status(201).json(aluno);
}
```

## 📝 Documentação JSDoc

Todos os controllers devem ser documentados com JSDoc, incluindo:

- Descrição da função
- Parâmetros (`@param`)
- Tipo de retorno (`@returns`)
- Exemplos de uso (`@example`)
- Exceções/erros (`@throws`)

Exemplo:

```javascript
/**
 * Busca um aluno específico pelo RA.
 *
 * @async
 * @param {Object} req - Objeto de requisição HTTP
 * @param {Object} req.params - Parâmetros da rota
 * @param {string} req.params.ra - RA do aluno
 * @param {Object} res - Objeto de resposta HTTP
 * @returns {Promise<void>}
 * @throws {404} Aluno não encontrado
 */
export async function buscarAluno(req, res) {
  // implementação
}
```

## 🚀 Exemplos de Uso

### Buscar Aluno por RA

```bash
GET /api/alunos/123456
```

```javascript
export async function buscarAluno(req, res) {
  const aluno = await AlunoService.findAlunoByRa(req.prisma, req.params.ra);
  if (!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
  res.json(aluno);
}
```

### Listar com Filtros

```bash
GET /api/alunos?nome=Silva&escola=EM PROF JOÃO&page=1&limit=20
```

```javascript
export async function listarAlunos(req, res) {
  const { nome, escola, page, limit } = req.query;
  const resultado = await AlunoService.findAllAlunos(
    req.prisma, 
    { nome, escola, page, limit }
  );
  res.json(resultado);
}
```

### Autenticação

```bash
POST /api/usuarios/login
Content-Type: application/json

{
  "token": "google-oauth-token-here"
}
```

```javascript
export async function loginUsuario(req, res) {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({ idToken: token });
  const usuario = await UsuarioService.findUsuarioByEmail(prisma, email);
  const jwtToken = gerarToken(usuario);
  res.json({ token: jwtToken, user: usuario });
}
```

## 🔒 Segurança

### Validação de Domínio (Google OAuth)

```javascript
if (hd !== 'seducbertioga.com.br') {
  return res.status(403).json({ error: 'Domínio não autorizado' });
}
```

### Proteção de Dados Sensíveis

```javascript
// Remover senha antes de retornar usuário
const { senha, ...usuarioSemSenha } = usuario;
res.json({ user: usuarioSemSenha });
```

## 🧪 Testes

Para testar os controllers, utilize ferramentas como:

- **Postman** - Testes manuais de API
- **Jest + Supertest** - Testes automatizados
- **Thunder Client** - Extensão do VS Code

Exemplo de teste com Jest:

```javascript
describe('Aluno Controller', () => {
  test('deve retornar aluno por RA', async () => {
    const res = await request(app)
      .get('/api/alunos/123456')
      .expect(200);
    
    expect(res.body).toHaveProperty('ra', '123456');
  });
});
```

## 📖 Recursos Adicionais

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [JSDoc Documentation](https://jsdoc.app/)

## 🤝 Contribuindo

Ao adicionar ou modificar controllers:

1. Siga o padrão de nomenclatura: `entidade.controller.js`
2. Documente com JSDoc completo
3. Implemente tratamento de erros consistente
4. Delegue lógica de negócio para a camada de serviços
5. Adicione exemplos de uso neste README
6. Teste todas as rotas antes de commitar

---

**Última atualização:** 2025-12-02
**Mantido por:** Equipe SEDUC ON
