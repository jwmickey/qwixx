// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Game Setup and Initialization', () => {
  test('Enter Valid Player Names (2 Players)', async ({ page }) => {
    // 1. On the game setup screen with 2 players selected
    await page.goto('/');
    
    // 2. Click on the first player name input field
    await page.getByRole('textbox', { name: 'Player 1 name' }).click();
    
    // 3. Type "Alice"
    await page.getByRole('textbox', { name: 'Player 1 name' }).fill('Alice');
    
    // 4. Click on the second player name input field
    await page.getByRole('textbox', { name: 'Player 2 name' }).click();
    
    // 5. Type "Bob"
    await page.getByRole('textbox', { name: 'Player 2 name' }).fill('Bob');
    
    // Verify both names appear in their respective input fields
    await expect(page.getByRole('textbox', { name: 'Player 1 name' })).toHaveValue('Alice');
    await expect(page.getByRole('textbox', { name: 'Player 2 name' })).toHaveValue('Bob');
    
    // 6. Click the "Start Game" button
    await page.getByRole('button', { name: 'Start game with entered' }).click();
    
    // Verify game transitions to the GameBoard screen
    await expect(page.getByRole('button', { name: '🎲 Roll Dice' })).toBeVisible();
    
    // Verify both players are visible in the game
    await expect(page.getByText('Alice\'s Turn')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Bob\'s score sheet' })).toBeVisible();
  });
});
