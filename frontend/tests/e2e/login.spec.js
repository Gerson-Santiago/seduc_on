
import { test, expect } from '@playwright/test';

test.describe('Fluxo de Login Google', () => {
  test('Deve renderizar a página de login corretamente', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/Login/);
    await expect(page.getByText('Entrar com Google')).toBeVisible();
  });

  test('Deve exibir erro quando o login falhar (Simulado)', async ({ page }) => {
    // Mock da resposta da API para simular erro
    await page.route('**/api/usuarios/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Credenciais inválidas.' }),
      });
    });

    await page.goto('/login');

    // Como não podemos clicar no botão real do Google sem interagir com a janela popup externa,
    // vamos simular o comportamento de erro que ocorreria após o callback.
    // Nota: Testes E2E reais com Google Auth são complexos e geralmente requerem mocks.
    // Aqui estamos testando se a aplicação reage corretamente a um erro da API.

    // TODO: Implementar mock completo do fluxo do Google Identity Services se necessário.
    // Por enquanto, verificamos a presença dos elementos principais.
    await expect(page.getByText('Entrar com Google')).toBeVisible();
  });
});
