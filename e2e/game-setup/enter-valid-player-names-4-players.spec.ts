// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Game Setup and Initialization', () => {
  test('Enter Valid Player Names (4 Players)', async ({ page }) => {
    await page.goto('/');
    
    // 1. Change player count to 4
    await page.getByRole('button', { name: '4 players' }).click();
    
    // 2. Enter names: "Player1", "Player2", "Player3", "Player4"
    await page.getByRole('textbox', { name: 'Player 1 name' }).fill('Player1');
    await page.getByRole('textbox', { name: 'Player 2 name' }).fill('Player2');
    await page.getByRole('textbox', { name: 'Player 3 name' }).fill('Player3');
    await page.getByRole('textbox', { name: 'Player 4 name' }).fill('Player4');
    
    // 3. Click "Start Game" button
    await page.getByRole('button', { name: 'Start game with entered' }).click();
    
    // Verify game initializes with 4 players
    await expect(page.getByText('Player1\'s Turn')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Player2\'s score sheet' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Player3\'s score sheet' })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Player4\'s score sheet' })).toBeVisible();
    
    // Verify dice are ready to roll
    await expect(page.getByRole('button', { name: '🎲 Roll Dice' })).toBeVisible();
  });
});
