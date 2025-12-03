# Guia de Testes - SEDUC ON Backend

Este projeto utiliza **Jest** como framework de testes.

## Executando Testes

### Rodar todos os testes
```bash
npm test
```

### Rodar testes com watch mode (desenvolvimento)
```bash
npm test -- --watch
```

### Verificar cobertura de testes
```bash
npm run test:coverage
```

## Estrutura dos Testes

Os arquivos de teste estão localizados na pasta `tests/` e seguem o padrão `*.test.js`.

### Padrões Adotados

1.  **Mocks:** Utilizamos `jest.unstable_mockModule` para mockar dependências ESM.
2.  **Isolamento:** Cada teste deve ser independente. Use `beforeEach` para limpar mocks.
3.  **Foco:** Testamos principalmente Controllers e Services.

## Exemplo de Teste (Controller)

```javascript
import { jest } from '@jest/globals';

// 1. Mock das dependências
jest.unstable_mockModule('../src/services/meu.service.js', () => ({
  meuMetodo: jest.fn()
}));

// 2. Import dinâmico do módulo testado (após mocks)
const { meuController } = await import('../src/controllers/meu.controller.js');
const MeuService = await import('../src/services/meu.service.js');

describe('Meu Controller', () => {
  test('Deve retornar 200', async () => {
    MeuService.meuMetodo.mockResolvedValue('dados');
    // ... asserções
  });
});
```

### Testando Controllers com asyncHandler

Nossos controllers agora utilizam `asyncHandler`. Ao testar erros, lembre-se que o `asyncHandler` repassa exceções para o middleware de erro do Express (`next`).

**Exemplo de teste de erro:**

```javascript
test('Deve chamar next com erro', async () => {
  const next = jest.fn(); // Mock do next
  const erro = new Error('Falha');
  MeuService.metodo.mockRejectedValue(erro);

  await meuController(req, res, next); // Passar next

  expect(next).toHaveBeenCalledWith(erro);
});
```
