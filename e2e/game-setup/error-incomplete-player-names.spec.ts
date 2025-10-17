// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Game Setup and Initialization', () => {
  test('Error: Incomplete Player Names', async ({ page }) => {
    await page.goto('/');
    
    // 1. On the game setup screen with 3 players selected
    await page.getByRole('button', { name: '3 players' }).click();
    
    // 2. Enter "Alice", "Bob" (leaving third player empty)
    await page.getByRole('textbox', { name: 'Player 1 name' }).fill('Alice');
    await page.getByRole('textbox', { name: 'Player 2 name' }).fill('Bob');
    
    // 3. Click "Start Game" button
    await page.getByRole('button', { name: 'Start game with entered' }).click();
    
    // Verify error message appears
    await expect(page.getByText('Please enter names for all 3 players')).toBeVisible();
    
    // Verify setup screen remains visible
    await expect(page.getByRole('heading', { name: 'Qwixx' })).toBeVisible();
  });
});
