// spec: docs/E2E_TEST_PLAN.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Game Setup and Initialization', () => {
  test('Load Game Home Screen', async ({ page }) => {
    // 1. Navigate to the application root URL
    await page.goto('/');
    
    // 2. Wait for the page to fully load - Verify page displays "Qwixx" title
    await expect(page.getByRole('heading', { name: 'Qwixx' })).toBeVisible();
    
    // Verify "Digital dice game" subtitle is visible
    await expect(page.getByText('Digital dice game')).toBeVisible();
    
    // Verify player count selection buttons (2, 3, 4, 5) are visible
    await expect(page.getByRole('button', { name: '2 players' })).toBeVisible();
    await expect(page.getByRole('button', { name: '3 players' })).toBeVisible();
    await expect(page.getByRole('button', { name: '4 players' })).toBeVisible();
    await expect(page.getByRole('button', { name: '5 players' })).toBeVisible();
    
    // Verify player name input fields are displayed based on selected player count
    await expect(page.getByRole('textbox', { name: 'Player 1 name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Player 2 name' })).toBeVisible();
    
    // Verify "Start Game" button is visible
    await expect(page.getByRole('button', { name: 'Start game with entered player names' })).toBeVisible();
  });
});
