// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Game Setup and Initialization', () => {
  test('Change Player Count - Increase Players', async ({ page }) => {
    await page.goto('/');
    
    // 1. On the game setup screen, verify 2 players is initially selected
    await expect(page.getByRole('button', { name: '2 players' })).toBeVisible();
    
    // 2. Click on "3" player count button
    await page.getByRole('button', { name: '3 players' }).click();
    
    // 3. Observe the name input fields - verify 3 empty name input fields appear
    await expect(page.getByRole('textbox', { name: 'Player 1 name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Player 2 name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Player 3 name' })).toBeVisible();
    
    // Verify "4" and "5" buttons remain available
    await expect(page.getByRole('button', { name: '4 players' })).toBeVisible();
    await expect(page.getByRole('button', { name: '5 players' })).toBeVisible();
  });
});
