# Controllers e Padrão MSC

**Data da Última Atualização:** Dezembro 2025

Este documento detalha o papel dos Controllers na arquitetura do SEDUC ON e como eles interagem com a camada de Serviço.

## 🎭 O Papel do Controller

Na nossa arquitetura, o Controller é o "Garçom" do restaurante.
*   **Responsabilidade:** Receber o pedido HTTP, verificar se está legível e passar para a cozinha (Service).
*   **O que NÃO faz:** Regras de negócio, cálculos, acesso direto ao banco (Prisma).

### Estrutura Padrão

Todo Controller deve seguir este esqueleto básico:

```javascript
import * as AlunoService from '../services/aluno.service.js';

// 1. Recebe req/res
export async function criarAluno(req, res) {
  try {
    // 2. Chama o Service (passando apenas dados, sem req/res)
    const novoAluno = await AlunoService.createAluno(req.prisma, req.body);
    
    // 3. Responde HTTP 201
    res.status(201).json(novoAluno);
  } catch (err) {
    // 4. Tratamento de erro centralizado
    handleError(res, err);
  }
}
```

## 🤝 Interação com Services

A regra de ouro é: **O Service não conhece o Express.**

*   ✅ **Correto:** `Service.criar(nome, email)`
*   ❌ **Errado:** `Service.criar(req.body)`

Isso garante que podemos reutilizar a mesma função do Service em Scripts CLI, Cron Jobs ou Testes Unitários sem precisar "mockar" objetos de requisição HTTP complexos.

## 📡 Tratamento de Erros

Os controllers utilizam uma função auxiliar `handleError(res, err)` para padronizar as respostas de erro (404, 500, etc) e garantir que detalhes técnicos não vazem para o cliente em produção.
