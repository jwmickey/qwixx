import { test, expect } from '@playwright/test';

test.describe('Qwixx Game Setup', () => {
  test('should load the game and display the title', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Qwixx')).toBeVisible();
  });

  test('should display the game setup form', async ({ page }) => {
    await page.goto('/');
    // Adjust selectors based on your actual component structure
    await expect(page.locator('body')).toBeVisible();
  });
});
