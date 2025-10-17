# E2E Testing Quick Reference

## File Structure
```
qwixx/
├── e2e/                           # E2E test directory
│   ├── helpers.ts                 # Common test utilities
│   ├── game-setup.spec.ts
│   ├── dice-rolling.spec.ts
│   ├── marking-active.spec.ts
│   ├── marking-inactive.spec.ts
│   ├── colored-dice.spec.ts
│   ├── penalties.spec.ts
│   ├── locking-rows.spec.ts
│   ├── game-end.spec.ts
│   ├── multi-turn.spec.ts
│   ├── edge-cases.spec.ts
│   └── ui-interactions.spec.ts
│
├── playwright.config.ts            # Playwright configuration
├── docs/
│   ├── E2E_TEST_PLAN.md           # Full test scenarios
│   ├── E2E_TEST_SUMMARY.md        # Overview & coverage
│   ├── E2E_IMPLEMENTATION_GUIDE.md # Code examples
│   ├── E2E_TEST_ARCHITECTURE.md   # Diagrams & flows
│   ├── PLAYWRIGHT_SETUP.md        # Setup guide
│   └── E2E_QUICK_REFERENCE.md     # (This file)
```

---

## Quick Commands

| Command | Purpose |
|---------|---------|
| `npm run test:pw` | Run all E2E tests |
| `npm run test:pw:headed` | Run tests with visible browser |
| `npx playwright test --debug` | Debug tests with inspector |
| `npx playwright show-report` | View HTML test report |
| `npx playwright test -g "pattern"` | Run tests matching pattern |
| `npx playwright test e2e/game-setup.spec.ts` | Run specific file |
| `npx playwright test --project=chromium` | Run on specific browser |

---

## Common Test Patterns

### Setup Game
```typescript
import { setupGameWith2Players } from './helpers';

test('example', async ({ page }) => {
  await setupGameWith2Players(page);
  // Game is now ready, roll dice button visible
});
```

### Roll Dice
```typescript
import { rollDice } from './helpers';

await rollDice(page);
// Dice are now displayed
```

### Mark Number
```typescript
import { markNumber } from './helpers';

// Mark number in specific row
await markNumber(page, 0, 7); // Row 0 (red), number 7
```

### Pass Turn
```typescript
import { passTurn } from './helpers';

await passTurn(page);
// Turn passed, turn indicator updated
```

### Verify Game State
```typescript
// Check if text is visible
await expect(page.getByText('Game Over!')).toBeVisible();

// Check button state
await expect(page.getByRole('button', { name: /Roll Dice/i })).toBeEnabled();

// Check element count
const rows = page.locator('[class*="ColorRow"]');
await expect(rows).toHaveCount(4);

// Check attribute
await expect(page.locator('button')).toHaveAttribute('aria-pressed', 'true');
```

---

## Assertion Cheatsheet

```typescript
// Visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Content
await expect(element).toContainText('text');
await expect(element).toHaveText('exact text');

// State
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();
await expect(element).toBeChecked();
await expect(element).toBeUnchecked();

// Attributes
await expect(element).toHaveAttribute('id', 'value');
await expect(element).toHaveClass('className');

// Count
await expect(locator).toHaveCount(5);

// URL/Title
await expect(page).toHaveURL('path');
await expect(page).toHaveTitle('Title');
```

---

## Locator Cheatsheet

```typescript
// By text
page.getByText('Click me')
page.getByText(/partial text/i)  // Regex, case-insensitive

// By role (recommended)
page.getByRole('button', { name: 'Click me' })
page.getByRole('heading', { level: 1 })
page.getByRole('option', { name: 'Player 1' })

// By label
page.getByLabel('Username')

// By placeholder
page.getByPlaceholder('Enter name')

// By test ID (if element has data-testid)
page.getByTestId('dice-display')

// By CSS selector (avoid if possible)
page.locator('.my-class')
page.locator('#my-id')
page.locator('input[type="text"]')

// By XPath (avoid)
page.locator('//button[text()="Click"]')

// Nth element
page.locator('button').nth(0)  // First button
page.locator('button').last()  // Last button

// Has relationship
page.locator('div:has-text("Score")')
page.locator('button:has-text("7")')
```

---

## Waiting Patterns

```typescript
// Wait for element visible
await page.waitForSelector('[class*="DiceDisplay"]');

// Wait for specific text
await page.waitForFunction(() => {
  return document.body.innerText.includes('Game Over');
});

// Wait for state change
await page.waitForFunction(async () => {
  const text = await page.textContent('button');
  return text !== 'Loading...';
});

// Implicit wait (up to 30 seconds default)
await expect(page.getByText('something')).toBeVisible();
```

---

## Test Template

```typescript
import { test, expect } from '@playwright/test';
import { setupGameWith2Players, rollDice, markNumber, passTurn } from './helpers';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Setup
    await setupGameWith2Players(page);
    
    // Execute
    await rollDice(page);
    
    // Assert
    await expect(page.getByText('Dice rolled')).toBeVisible();
  });
});
```

---

## Test Naming Conventions

✅ **Good**
- `test('should mark number in red row')`
- `test('should not allow duplicate player names')`
- `test('should end game when 2 rows locked')`

❌ **Bad**
- `test('test 1')`
- `test('mark')`
- `test('game ends')`

---

## Debugging Tricks

### See what's on page
```typescript
const html = await page.content();
console.log(html);
```

### Pause and inspect
```typescript
await page.pause(); // Opens inspector, step through manually
```

### Screenshot at point
```typescript
await page.screenshot({ path: 'debug.png' });
```

### Console logs from app
```typescript
page.on('console', msg => console.log('APP:', msg.text()));
```

### All network requests
```typescript
const requests = await page.context().requests;
```

### Performance
```typescript
const perfLog = await page.evaluate(() => performance.getEntriesByType('measure'));
```

---

## Flamingo Browser States

| State | Roll | Pass | Mark | Effects |
|-------|------|------|------|---------|
| ROLLING | ✓ Enabled | ✗ Disabled | ✗ Disabled | Roll button clickable |
| WHITE-DICE | ✗ Disabled | ✓ Enabled | ✓ Enabled | Mark white sum only |
| COLORED-DICE | ✗ Disabled | ✓ Enabled | ✓ Enabled (active only) | Mark white+colored |
| INACTIVE-PLAYERS | ✗ Disabled | ✓ Enabled | ✓ Enabled (white only) | Other players mark |
| GAME-ENDED | ✗ Disabled | ✗ Disabled | ✗ Disabled | Summary shown |

---

## Scoring Quick Reference

| Marks | Points |
|-------|--------|
| 1 | 1 |
| 2 | 3 |
| 3 | 6 |
| 4 | 10 |
| 5 | 15 |
| 6 | 21 |
| 7 | 28 |
| 8 | 36 |
| 9 | 45 |
| 10 | 55 |
| 11 | 66 |
| 12 + Lock | 78 |

**Penalty**: -5 points each (max 4 = -20)

---

## Game Rules Quick Reference

### Row Layouts
- **Red**: 2→12 (left to right, ascending)
- **Yellow**: 2→12 (left to right, ascending)
- **Green**: 12→2 (right to left, descending)
- **Blue**: 12→2 (right to left, descending)

### Marking Rules
- ✓ Mark left-to-right
- ✓ Can skip numbers
- ✗ Cannot mark skipped numbers later
- ✓ Can mark in any row (active player: +colored combos)
- ✗ Cannot mark in locked rows

### End Conditions
- **Condition 1**: 2 rows locked → Game ends
- **Condition 2**: Player gets 4th penalty → Game ends

### Penalties
- -5 points each
- Applied when active player passes without marking
- Max 4 penalties (ends game at 4th)

---

## Common Test Failures & Solutions

| Issue | Solution |
|-------|----------|
| Element not found | Use `.first()`, check locator with `--debug` |
| Timeout waiting | Add explicit `waitForSelector()` before assertion |
| Flaky tests | Use `toBeVisible()` not `toBeDefined()`, add waits |
| Wrong element clicked | Use more specific locator (role, label, test-id) |
| State not updated | Wait for actual change, don't rely on timing |
| Mobile test fails | Check viewport size, ensure responsive CSS |

---

## Resources

| Resource | Link |
|----------|------|
| Full Test Plan | `docs/E2E_TEST_PLAN.md` |
| Implementation Guide | `docs/E2E_IMPLEMENTATION_GUIDE.md` |
| Architecture Diagrams | `docs/E2E_TEST_ARCHITECTURE.md` |
| Playwright Docs | https://playwright.dev |
| Best Practices | https://playwright.dev/docs/best-practices |
| Assertions | https://playwright.dev/docs/test-assertions |
| Locators | https://playwright.dev/docs/locators |

---

## Priority Test Cases (Smoke Test)

Run these if short on time:

```bash
npx playwright test -g "should initialize game|should roll dice|should mark number|should pass turn|should end game"
```

**Expected**: ~15 minutes for full browser coverage

---

## Test Status

- **Setup**: ⏳ Not implemented
- **Dice**: ⏳ Not implemented
- **Marking**: ⏳ Not implemented
- **Penalties**: ⏳ Not implemented
- **Game End**: ⏳ Not implemented
- **UI**: ⏳ Not implemented

**Overall**: Ready to implement (Playwright configured, docs complete)

---

## Next Steps

1. Create `e2e/helpers.ts` with utility functions
2. Implement `e2e/game-setup.spec.ts` first
3. Test locally: `npm run test:pw:headed`
4. Debug failures with `--debug` flag
5. Add more spec files progressively
6. Monitor report: `npx playwright show-report`

---

## Tips for Success

✅ **Start small** - Implement one spec file at a time
✅ **Use helpers** - Reduce code duplication
✅ **Run frequently** - Test after each change
✅ **Debug actively** - Use `--debug` and `--headed` flags
✅ **Read reports** - HTML report shows exact failures
✅ **Consider mobile** - Tests run on 5 configurations
✅ **Keep it simple** - One assertion per test is ideal
✅ **Name tests clearly** - Future you will thank you
