# E2E Test Implementation Guide

## Overview

This guide provides practical examples and patterns for implementing the Qwixx E2E tests using Playwright.

---

## Common Test Patterns

### 1. Game Setup Pattern

```typescript
import { test, expect } from '@playwright/test';

test.describe('Game Setup', () => {
  test('should initialize game with valid player names', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Verify we're on setup screen
    await expect(page.getByText('Qwixx')).toBeVisible();
    
    // Select player count
    await page.getByRole('button', { name: '2 players' }).click();
    
    // Enter player names
    const playerInputs = page.locator('input[placeholder*="Player"]');
    await playerInputs.nth(0).fill('Alice');
    await playerInputs.nth(1).fill('Bob');
    
    // Start game
    await page.getByRole('button', { name: /Start Game/i }).click();
    
    // Verify game board is visible
    await expect(page.getByText('Roll Dice')).toBeVisible();
  });
});
```

### 2. Dice Rolling Pattern

```typescript
test('should roll dice and display all six dice', async ({ page }) => {
  // Setup: Navigate to game board
  await setupGameWith2Players(page);
  
  // Roll dice
  await page.getByRole('button', { name: /Roll Dice/i }).click();
  
  // Verify dice are visible
  const diceDisplay = page.locator('[class*="dice"]');
  await expect(diceDisplay).toBeVisible();
  
  // Get and verify white dice sum
  const whiteSum = await page.evaluate(() => {
    const dice = document.querySelectorAll('[class*="Die"]');
    // Adjust selector based on actual implementation
    return 'calculated sum';
  });
  
  expect(whiteSum).toBeGreaterThan(1);
  expect(whiteSum).toBeLessThan(13);
});
```

### 3. Marking Numbers Pattern

```typescript
test('should mark valid numbers on score sheet', async ({ page }) => {
  // Setup
  await setupGameWith2Players(page);
  await page.getByRole('button', { name: /Roll Dice/i }).click();
  
  // Get white dice sum (example: assume it's 7)
  const whiteDiceSum = 7; // In real test, extract this from page
  
  // Find and click the number to mark
  const scoreSheet = page.locator('[class*="ScoreSheet"]').first();
  const numberToMark = scoreSheet.getByRole('button', { name: String(whiteDiceSum) }).first();
  
  await numberToMark.click();
  
  // Verify number is marked (highlighted)
  await expect(numberToMark).toHaveClass(/marked|active|checked/);
});
```

### 4. Pass Turn Pattern

```typescript
test('should pass turn and assign penalty if no marks', async ({ page }) => {
  // Setup
  await setupGameWith2Players(page);
  const player1Name = 'Alice';
  
  // Roll dice
  await page.getByRole('button', { name: /Roll Dice/i }).click();
  
  // Don't mark anything, just pass
  await page.getByRole('button', { name: /Pass Turn/i }).click();
  
  // Verify penalty is assigned
  const penaltyDisplay = page.locator('text=Penalties').first();
  await expect(penaltyDisplay).toContainText(/1|-5/);
  
  // Verify turn moved to Bob
  await expect(page.getByText("Bob's Turn")).toBeVisible();
});
```

### 5. Game End Pattern

```typescript
test('should end game when two rows are locked', async ({ page }) => {
  // Setup and play until 2 rows are locked
  await setupGameWith2Players(page);
  
  // Play multiple turns (implementation depends on game state)
  // ... simulate gameplay ...
  
  // Once 2 rows should be locked, verify game end
  await expect(page.getByText('Game Over!')).toBeVisible();
  await expect(page.getByText(/wins with/)).toBeVisible();
});
```

---

## Helper Functions

Create a `helpers.ts` file to reduce code duplication:

```typescript
// e2e/helpers.ts
import { Page } from '@playwright/test';

export async function setupGameWith2Players(page: Page, names = ['Alice', 'Bob']) {
  // Navigate
  await page.goto('/');
  
  // Setup
  await page.getByRole('button', { name: '2 players' }).click();
  
  // Enter names
  const inputs = page.locator('input[type="text"]');
  for (let i = 0; i < names.length; i++) {
    await inputs.nth(i).fill(names[i]);
  }
  
  // Start
  await page.getByRole('button', { name: /Start Game/i }).click();
  
  // Wait for game board
  await page.waitForSelector('[class*="GameBoard"]');
}

export async function setupGameWithNPlayers(page: Page, count: number, names?: string[]) {
  const playerNames = names || Array.from({ length: count }, (_, i) => `Player${i + 1}`);
  
  await page.goto('/');
  await page.getByRole('button', { name: String(count) }).click();
  
  const inputs = page.locator('input[type="text"]');
  for (let i = 0; i < playerNames.length; i++) {
    await inputs.nth(i).fill(playerNames[i]);
  }
  
  await page.getByRole('button', { name: /Start Game/i }).click();
  await page.waitForSelector('[class*="GameBoard"]');
}

export async function rollDice(page: Page) {
  await page.getByRole('button', { name: /Roll Dice/i }).click();
  // Wait for dice to appear
  await page.waitForSelector('[class*="Die"]');
}

export async function passTurn(page: Page) {
  await page.getByRole('button', { name: /Pass Turn/i }).click();
  // Wait for turn change
  await page.waitForTimeout(100); // Brief wait for UI update
}

export async function markNumber(page: Page, rowIndex: number, number: number) {
  const rows = page.locator('[class*="ColorRow"]');
  const row = rows.nth(rowIndex);
  
  const numberButton = row.getByRole('button', { name: String(number) });
  await numberButton.click();
}

export async function getCurrentPlayerName(page: Page): Promise<string> {
  const playerIndicator = page.locator('text=\'s Turn').first();
  const text = await playerIndicator.textContent();
  return text?.replace("'s Turn", '').trim() || '';
}

export async function getWhiteDiceSum(page: Page): Promise<number> {
  // Adjust based on actual implementation
  const sumText = await page.locator('[class*="sum"]').textContent();
  const match = sumText?.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}
```

### Usage in Tests

```typescript
import { test, expect } from '@playwright/test';
import { setupGameWith2Players, rollDice, passTurn, markNumber } from './helpers';

test('complete turn flow', async ({ page }) => {
  await setupGameWith2Players(page);
  await rollDice(page);
  
  // Mark a number and pass
  await markNumber(page, 0, 7); // Row 0, number 7
  await passTurn(page);
  
  // Verify turn changed
  const playerName = await getCurrentPlayerName(page);
  expect(playerName).toBe('Bob');
});
```

---

## Validation Patterns

### Verify Error Messages

```typescript
test('should show error for duplicate names', async ({ page }) => {
  await page.goto('/');
  
  const inputs = page.locator('input[type="text"]');
  await inputs.nth(0).fill('Alice');
  await inputs.nth(1).fill('Alice'); // Duplicate
  
  await page.getByRole('button', { name: /Start Game/i }).click();
  
  // Wait for error to appear
  await expect(page.getByText('names must be unique')).toBeVisible();
});
```

### Verify Button States

```typescript
test('should disable Roll Dice after rolling', async ({ page }) => {
  await setupGameWith2Players(page);
  
  const rollButton = page.getByRole('button', { name: /Roll Dice/i });
  
  // Initially enabled
  await expect(rollButton).toBeEnabled();
  
  // Click to roll
  await rollButton.click();
  
  // Now disabled
  await expect(rollButton).toBeDisabled();
  
  // Pass turn
  await passTurn(page);
  
  // Now enabled again
  await expect(rollButton).toBeEnabled();
});
```

### Verify Marked Numbers

```typescript
test('should mark number correctly', async ({ page }) => {
  await setupGameWith2Players(page);
  await rollDice(page);
  
  const numberButton = page.locator('button:has-text("7")').first();
  
  // Before mark
  await expect(numberButton).not.toHaveClass('marked');
  
  // Mark it
  await numberButton.click();
  
  // After mark - check for marking class or aria-pressed
  await expect(numberButton).toHaveClass(/marked|active/) 
    .or
    .toHaveAttribute('aria-pressed', 'true');
});
```

---

## Multi-Turn Test Pattern

```typescript
test('should complete multiple turns correctly', async ({ page }) => {
  await setupGameWith2Players(page);
  
  // Turn 1: Alice
  await rollDice(page);
  await markNumber(page, 0, 5);
  await passTurn(page);
  
  // Turn 2: Bob
  expect(await getCurrentPlayerName(page)).toBe('Bob');
  await rollDice(page);
  await markNumber(page, 1, 8);
  await passTurn(page);
  
  // Turn 3: Alice (back to Alice)
  expect(await getCurrentPlayerName(page)).toBe('Alice');
  await rollDice(page);
  // Continue...
});
```

---

## Wait Patterns

### Wait for Game Initialization

```typescript
test('should wait for game board after setup', async ({ page }) => {
  await page.goto('/');
  
  // Fill in names...
  await page.getByRole('button', { name: /Start Game/i }).click();
  
  // Wait for specific game element
  await page.waitForSelector('[class*="DiceDisplay"]');
  
  // Or wait for visible content
  await expect(page.getByRole('button', { name: /Roll Dice/i })).toBeVisible();
});
```

### Wait for State Change

```typescript
test('should wait for turn change', async ({ page }) => {
  const currentPlayer = await getCurrentPlayerName(page);
  
  await passTurn(page);
  
  // Wait for player to change
  await page.waitForFunction(async () => {
    const newPlayer = await getCurrentPlayerName(page);
    return newPlayer !== currentPlayer;
  });
});
```

### Wait for Score Update

```typescript
test('should update score after marking', async ({ page }) => {
  await rollDice(page);
  
  const scoreDisplay = page.locator('[class*="score"]').first();
  const oldScore = await scoreDisplay.textContent();
  
  await markNumber(page, 0, 7);
  
  // Wait for score to change
  await page.waitForFunction(async () => {
    const newScore = await scoreDisplay.textContent();
    return newScore !== oldScore;
  });
});
```

---

## Assertion Patterns

### Text-Based Assertions

```typescript
// Visible text
await expect(page.getByText('Qwixx')).toBeVisible();

// Partial text match
await expect(page.locator('button')).toContainText('Roll');

// Case-insensitive
await expect(page.getByText(/start game/i)).toBeVisible();
```

### Count Assertions

```typescript
// Count rows
const rows = page.locator('[class*="ColorRow"]');
await expect(rows).toHaveCount(4);

// Count players
const playerScores = page.locator('[class*="PlayerScore"]');
await expect(playerScores).toHaveCount(2);
```

### State Assertions

```typescript
// Enabled/Disabled
const button = page.getByRole('button', { name: /Roll Dice/i });
await expect(button).toBeEnabled();
await expect(button).toBeDisabled();

// Visible/Hidden
await expect(page.locator('[class*="ErrorMessage"]')).toBeHidden();
await expect(page.getByText('Game Over!')).toBeVisible();

// Attributes
await expect(page.locator('button')).toHaveAttribute('aria-pressed', 'true');
```

---

## Best Practices

### ✅ DO

```typescript
// Use semantic queries
await page.getByRole('button', { name: 'Roll Dice' }).click();
await page.getByLabel('Player Name').fill('Alice');

// Wait for visibility
await expect(page.getByText('Game Over!')).toBeVisible();

// Use meaningful variable names
const playerCount = 2;
const playerNames = ['Alice', 'Bob'];

// Test one thing per test
test('should roll dice', ...) // Good
test('should roll dice and mark number', ...) // Too much

// Use helpers to reduce duplication
await setupGameWith2Players(page);
```

### ❌ DON'T

```typescript
// Avoid hardcoded selectors
page.locator('.abc123-xyz'); // Bad
page.locator('div > span > button:nth-child(3)'); // Bad

// Avoid fragile waits
await page.waitForTimeout(1000); // Too long, fragile
await page.waitForNavigation(); // May not trigger

// Avoid implementation details
test('should set state correctly', ...) // Don't test implementation

// Avoid testing multiple features
test('complete game', ...) // Split into smaller tests
```

---

## Mobile Testing Considerations

### Mobile-Specific Patterns

```typescript
test.describe('Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });
  
  test('should scroll score sheet on mobile', async ({ page }) => {
    await setupGameWith2Players(page);
    
    // Verify score sheet is scrollable
    const scoreSheet = page.locator('[class*="ScoreSheet"]').first();
    await expect(scoreSheet).toBeInViewport();
    
    // Scroll if needed
    if (await scoreSheet.isVisible()) {
      await scoreSheet.scroll({ left: 50 });
    }
  });
  
  test('should have touch-friendly buttons', async ({ page }) => {
    await setupGameWith2Players(page);
    
    const button = page.getByRole('button', { name: /Roll Dice/i });
    
    // Verify button size is reasonable for touch
    const box = await button.boundingBox();
    expect(box?.height).toBeGreaterThan(40); // At least 40px for touch
    expect(box?.width).toBeGreaterThan(40);
  });
});
```

---

## Test Organization Example

```
e2e/
├── helpers.ts              # Common functions
├── game-setup.spec.ts      # Setup tests (Scenario 1)
├── dice-rolling.spec.ts    # Dice tests (Scenario 2)
├── marking-active.spec.ts  # Active player marking (Scenario 3)
├── marking-inactive.spec.ts # Inactive marking (Scenario 4)
├── colored-dice.spec.ts    # Colored combinations (Scenario 5)
├── penalties.spec.ts       # Penalties (Scenario 6)
├── locking-rows.spec.ts    # Row locking (Scenario 7)
├── game-end.spec.ts        # End conditions (Scenario 8-9)
├── multi-turn.spec.ts      # Multi-turn sequences (Scenario 10)
├── edge-cases.spec.ts      # Edge cases (Scenario 11)
└── ui-interactions.spec.ts # UI tests (Scenario 12)
```

---

## Running Specific Tests

```bash
# Run all tests
npm run test:pw

# Run specific file
npx playwright test e2e/game-setup.spec.ts

# Run tests matching name
npx playwright test -g "should mark number"

# Run in debug mode
npx playwright test e2e/game-setup.spec.ts --debug

# Run on specific browser
npx playwright test --project=chromium

# Run in headed mode (see browser)
npm run test:pw:headed
```

---

## Debugging Tips

### Use Trace Viewer

```typescript
test('debug test', async ({ page }) => {
  await page.context().tracing.start({ screenshots: true, snapshots: true });
  
  // ... your test code ...
  
  await page.context().tracing.stop({ path: 'trace.zip' });
});

// View: npx playwright show-trace trace.zip
```

### Use Page Inspector

```typescript
test('inspect elements', async ({ page }) => {
  await page.goto('/');
  
  // Pause and inspect
  await page.pause();
  
  // Look at page state
  const html = await page.content();
  console.log(html);
});
```

### Console Logging

```typescript
test('log game state', async ({ page }) => {
  // Listen to console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  await setupGameWith2Players(page);
  
  // Any console.log in the app will be printed
});
```

---

## Next Steps

1. Create helper functions in `e2e/helpers.ts`
2. Implement tests file by file (start with game-setup.spec.ts)
3. Use this guide as reference for patterns
4. Run frequently with `npm run test:pw`
5. Debug failures with `--debug` flag
6. Check report with `npx playwright show-report`
