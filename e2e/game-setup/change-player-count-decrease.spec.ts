// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Game Setup and Initialization', () => {
  test('Change Player Count - Decrease Players', async ({ page }) => {
    await page.goto('/');
    
    // 1. On the game setup screen, select 5 players
    await page.getByRole('button', { name: '5 players' }).click();
    
    // 2. Click on "3" player count button
    await page.getByRole('button', { name: '3 players' }).click();
    
    // Verify only 3 name input fields are displayed
    await expect(page.getByRole('textbox', { name: 'Player 1 name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Player 2 name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Player 3 name' })).toBeVisible();
    
    // Verify remaining player count buttons are accessible
    await expect(page.getByRole('button', { name: '2 players' })).toBeVisible();
    await expect(page.getByRole('button', { name: '4 players' })).toBeVisible();
    await expect(page.getByRole('button', { name: '5 players' })).toBeVisible();
  });
});
