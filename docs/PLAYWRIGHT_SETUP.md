# Playwright E2E Testing Setup

This document describes the Playwright end-to-end (E2E) testing setup for the Qwixx game.

## Overview

Playwright is configured to run E2E tests across multiple browsers (Chromium, Firefox, WebKit) and mobile viewports. Tests automatically start the development server before running.

## Installation

Playwright and its dependencies are already installed:

```bash
npm install --save-dev @playwright/test @types/node
```

## Configuration

The Playwright configuration is defined in `playwright.config.ts` with the following key settings:

### Test Directory
- Tests are located in the `e2e/` directory
- Test files use the `.spec.ts` suffix

### Browsers
Tests run on:
- **Desktop Browsers**: Chromium, Firefox, WebKit
- **Mobile Browsers**: Pixel 5 (Chrome), iPhone 12 (Safari)

### Base URL
- `http://localhost:5173` (development server)

### Reporters
- HTML report stored in `playwright-report/`

### Auto-start Dev Server
- The dev server (`npm run dev`) starts automatically before tests
- Reuses existing server if already running (except in CI)

## Running Tests

### Run all tests
```bash
npm run test:pw
```

### Run tests in headed mode (see browser)
```bash
npm run test:pw:headed
```

### Run tests in watch mode
```bash
npx playwright test --watch
```

### Run specific test file
```bash
npx playwright test e2e/seed.spec.ts
```

### Run tests in a specific browser
```bash
npx playwright test --project=chromium
```

### Run single test
```bash
npx playwright test -g "should load the game"
```

### View HTML report
```bash
npx playwright show-report
```

### Debug tests
```bash
npx playwright test --debug
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Expected Text')).toBeVisible();
  });
});
```

### Common Assertions

```typescript
// Visibility
await expect(page.locator('.selector')).toBeVisible();
await expect(page.locator('.selector')).toBeHidden();

// Content
await expect(page.getByText('text')).toBeVisible();
await expect(page.locator('.selector')).toContainText('text');

// State
await expect(page.locator('button')).toBeEnabled();
await expect(page.locator('input')).toHaveValue('value');

// Counts
await expect(page.locator('.item')).toHaveCount(3);
```

### Useful Locators

```typescript
// By text
page.getByText('Click me')

// By role
page.getByRole('button', { name: 'Click me' })

// By label
page.getByLabel('Username')

// By placeholder
page.getByPlaceholder('Enter name')

// By CSS selector
page.locator('.my-class')

// By data-testid (recommended)
page.getByTestId('game-board')
```

## Best Practices for Qwixx Tests

1. **Use data-testid attributes** for reliable element selection:
   ```typescript
   // In components
   <div data-testid="game-board">...</div>
   
   // In tests
   page.getByTestId('game-board')
   ```

2. **Wait for game state changes**:
   ```typescript
   await page.waitForSelector('[data-testid="dice-result"]');
   ```

3. **Test critical user flows**:
   - Game setup (player names/count)
   - Dice rolling
   - Marking numbers
   - Scoring calculations
   - Game end conditions

4. **Mobile-first testing**:
   - Tests include mobile viewports (Pixel 5, iPhone 12)
   - Consider touch interactions vs. mouse clicks

5. **Isolate tests**:
   - Each test should be independent
   - Don't rely on state from previous tests

## Continuous Integration

In CI environments (GitHub Actions, etc.), set the `CI` environment variable:

```bash
CI=true npm run test:pw
```

This will:
- Retry failed tests up to 2 times
- Run tests sequentially (not in parallel)
- Use headless mode
- Collect traces on first retry

## Troubleshooting

### Tests can't find the app
- Ensure the dev server is running on `http://localhost:5173`
- Check `playwright.config.ts` `baseURL` setting
- Verify Vite dev server is not on a different port

### Browser crashes
- Update Playwright: `npx playwright install`
- Clear Playwright cache: `rm -rf ~/.cache/ms-playwright`

### Flaky tests
- Use `test.slow()` to increase timeout for slow tests:
  ```typescript
  test.slow();
  ```
- Add explicit waits before assertions
- Use `toBeVisible()` instead of `toBeDefined()`

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debug Tests](https://playwright.dev/docs/debug)
- [Trace Viewer](https://playwright.dev/docs/trace-viewer)

## Ignored Files

Playwright artifacts are ignored by Git (see `.gitignore`):
- `test-results/` - Test results
- `playwright-report/` - HTML test report
- `blob-report/` - Blob report
- `playwright/.cache/` - Browser cache
