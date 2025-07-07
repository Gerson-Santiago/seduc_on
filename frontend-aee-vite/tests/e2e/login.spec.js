import { test, expect } from '@playwright/test';

test('Página de login carrega corretamente', async ({ page }) => {
  await page.goto('http://localhost:4173/login');

  // Verifica o título da aba
  await expect(page).toHaveTitle(/Sistema AEE \| SME Bertioga - São Paulo, Brasil/i);

  // Verifica visibilidade do botão pela classe
  const botaoGoogle = page.locator('button.google-login-button');
  await expect(botaoGoogle).toBeVisible();

  // Verifica se contém o texto correto dentro
  await expect(botaoGoogle).toContainText(/Entrar com Google/i);
});
