// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Game Setup and Initialization', () => {
  test('Error: Duplicate Player Names', async ({ page }) => {
    // 1. On the game setup screen with 2 players
    await page.goto('/');
    
    // 2. Enter "Alice" for both player 1 and player 2
    await page.getByRole('textbox', { name: 'Player 1 name' }).fill('Alice');
    await page.getByRole('textbox', { name: 'Player 2 name' }).fill('Alice');
    
    // 3. Click "Start Game" button
    await page.getByRole('button', { name: 'Start game with entered' }).click();
    
    // Verify error message appears
    await expect(page.getByText('Player names must be unique')).toBeVisible();
    
    // Verify both names remain in the input fields
    await expect(page.getByRole('textbox', { name: 'Player 1 name' })).toHaveValue('Alice');
    await expect(page.getByRole('textbox', { name: 'Player 2 name' })).toHaveValue('Alice');
  });
});
