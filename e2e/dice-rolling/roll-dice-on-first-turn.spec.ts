// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Dice Rolling and Turn Flow', () => {
  test('Roll Dice on First Turn', async ({ page }) => {
    // 1. Start a new game with 2 players (Alice, Bob)
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Player 1 name' }).fill('Alice');
    await page.getByRole('textbox', { name: 'Player 2 name' }).fill('Bob');
    await page.getByRole('button', { name: 'Start game with entered' }).click();
    
    // 2. Observe the game board - skip tutorial to see game board
    await page.getByRole('button', { name: 'Skip tutorial' }).click();
    
    // Verify "Roll Dice" button is clickable on first turn
    await expect(page.getByRole('button', { name: '🎲 Roll Dice' })).toBeVisible();
    
    // 3. Click the "Roll Dice" button
    await page.getByRole('button', { name: '🎲 Roll Dice' }).click();
    
    // Verify dice display updates with random values
    // Verify white dice sum is displayed (e.g., "= 8")
    await expect(page.getByText(/= \d+/)).toBeVisible();
    
    // Verify "Pass Turn" button becomes available (shown as "Finish White Dice")
    await expect(page.getByRole('button', { name: 'Finish White Dice' })).toBeVisible();
  });
});
