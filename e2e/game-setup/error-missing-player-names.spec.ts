// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Game Setup and Initialization', () => {
  test('Error: Missing Player Names', async ({ page }) => {
    // 1. On the game setup screen
    await page.goto('/');
    
    // 2. Leave the first player name field empty
    // 3. Enter only "Bob" for player 2
    await page.getByRole('textbox', { name: 'Player 2 name' }).fill('Bob');
    
    // 4. Click "Start Game" button
    await page.getByRole('button', { name: 'Start game with entered' }).click();
    
    // Verify error message appears
    await expect(page.getByText('Please enter names for at least 2 players')).toBeVisible();
    
    // Verify user remains on setup screen
    await expect(page.getByRole('heading', { name: 'Qwixx' })).toBeVisible();
  });
});
