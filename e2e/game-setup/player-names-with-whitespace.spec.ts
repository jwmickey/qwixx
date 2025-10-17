// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Game Setup and Initialization', () => {
  test('Player Names with Whitespace', async ({ page }) => {
    // 1. On the game setup screen
    await page.goto('/');
    
    // 2. Enter "  Alice  " for player 1
    await page.getByRole('textbox', { name: 'Player 1 name' }).fill('  Alice  ');
    
    // 3. Enter "  Bob  " for player 2
    await page.getByRole('textbox', { name: 'Player 2 name' }).fill('  Bob  ');
    
    // 4. Click "Start Game" button
    await page.getByRole('button', { name: 'Start game with entered' }).click();
    
    // Verify game starts successfully
    await expect(page.getByRole('button', { name: '🎲 Roll Dice' })).toBeVisible();
    
    // Verify names are trimmed - Players display as "Alice" and "Bob" (without extra spaces)
    await expect(page.getByText('Alice\'s Turn')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bob' })).toBeVisible();
  });
});
