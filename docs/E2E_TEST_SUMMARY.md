# E2E Test Plan Summary

## Document Reference
See full test plan: [E2E_TEST_PLAN.md](./E2E_TEST_PLAN.md)

## Quick Reference

### Application: Qwixx Digital Game
- **Type**: Single-device multiplayer dice game (2-5 players)
- **Platform**: Mobile-first web application
- **Framework**: React 19 + TypeScript

---

## Test Coverage Overview

### Total Test Scenarios: 60+
Organized into 12 categories:

| Category | Scenarios | Key Focus |
|----------|-----------|-----------|
| **Game Setup** | 9 | Player configuration, validation, error handling |
| **Dice Rolling** | 4 | Roll mechanics, dice display, turn flow |
| **Marking (Active)** | 7 | Valid/invalid marks, left-to-right rules, toggling |
| **Marking (Inactive)** | 3 | Collaborative marking, restricted options |
| **Colored Dice** | 3 | Active player only combinations |
| **Penalties & Pass** | 5 | Penalty accumulation, game end condition |
| **Row Locking** | 4 | Lock mechanics, row removal, scoring impact |
| **Game End & Summary** | 5 | End conditions, scoring calculation, winner determination |
| **Multi-Turn Sequences** | 4 | Full game flow, turn order, state persistence |
| **Edge Cases** | 5 | Boundary conditions, rare scenarios |
| **UI & Interactions** | 5 | Responsive design, button states, visual consistency |

---

## Key Test Workflows

### 1. Complete Game Flow (Happy Path)
```
Game Setup
  ↓
Player Configuration (names, count)
  ↓
Dice Roll
  ↓
Mark Numbers (Active Player)
  ↓
Inactive Players Mark (White Dice Sum)
  ↓
Pass Turn
  ↓
Next Player Dice Roll
  ↓
... (repeat until game end)
  ↓
Game Summary (Scores & Winner)
```

### 2. Player Setup Validation
```
Player Count Selection (2-5)
  ↓
Enter Player Names
  ↓
Validation Checks:
  - At least 2 names filled
  - All selected players have names
  - Names are unique
  - Names trimmed of whitespace
  ↓
Start Game OR Show Error
```

### 3. Marking Number Validation
```
Dice Roll
  ↓
Active Player:
  - Can mark white dice sum in ANY row
  - Can mark white + colored die sum in that color's row
  ↓
Inactive Players:
  - Can mark white dice sum in ANY row
  - CANNOT mark colored combinations
  ↓
Validation Rules:
  - Left-to-right only
  - Cannot skip and come back
  - Cannot mark in locked rows
  - Can unmark (toggle) within same turn
```

### 4. Game End Scenarios
```
Condition 1: Two Rows Locked
  - Game ends immediately
  - Calculate final scores
  - Display winner(s)

OR

Condition 2: Player Gets 4th Penalty
  - Game ends immediately
  - Calculate final scores
  - Display winner(s)
```

---

## Critical Test Cases (Must Pass)

1. ✓ **Game initializes with correct number of players**
2. ✓ **Dice roll produces valid values (1-6)**
3. ✓ **White dice sum is calculated correctly**
4. ✓ **Active player can mark valid numbers**
5. ✓ **Inactive players cannot mark colored combinations**
6. ✓ **Left-to-right marking rule is enforced**
7. ✓ **Locked rows prevent further marking**
8. ✓ **Penalties accumulate correctly (-5 points each)**
9. ✓ **Game ends on 4th penalty or 2nd locked row**
10. ✓ **Final scores are calculated correctly**
11. ✓ **Winner is determined and announced**
12. ✓ **UI is responsive on mobile and desktop**

---

## Test Execution Strategy

### Browser Coverage
- **Desktop**: Chromium, Firefox, WebKit
- **Mobile**: Pixel 5 (Chrome), iPhone 12 (Safari)

### Test Phases
1. **Phase 1**: Setup & Initialization (Scenarios 1-2)
2. **Phase 2**: Core Gameplay (Scenarios 3-7)
3. **Phase 3**: Game End & Scoring (Scenarios 8-9)
4. **Phase 4**: Extended Flows & Edge Cases (Scenarios 10-12)

### Expected Execution Time
- **Full suite**: ~45-60 minutes
- **Critical tests only**: ~15-20 minutes
- **Single browser**: ~10-15 minutes

---

## Accessibility Considerations

Tests should verify:
- Form inputs have associated labels
- Buttons have descriptive aria-labels
- ARIA roles are properly assigned (button, group, etc.)
- Color is not the only differentiator (text labels present)
- Focus management for keyboard navigation
- Error messages are announced

---

## Browser Compatibility Notes

### Known Considerations
- Mobile viewports should maintain portrait orientation
- Touch events should work on mobile browsers
- Flex/Grid layouts should render correctly
- CSS color values should be consistent
- JavaScript execution should be consistent

---

## Regression Test Checklist

Use this minimal set for quick regression testing:

### Regression Test Suite
- [ ] Game setup with 2 players
- [ ] Roll dice and mark valid number
- [ ] Pass turn without marking (penalty applied)
- [ ] Mark in multiple rows
- [ ] Lock a row (5+ marks + final number)
- [ ] Game ends correctly (2 locked rows)
- [ ] Winner announced with correct score
- [ ] New game starts fresh

**Expected Duration**: 10 minutes

---

## Future Test Enhancements

Potential tests for future iterations:
1. Game state persistence (auto-save/resume)
2. PWA functionality (offline play)
3. Tutorial modal display
4. Undo functionality
5. Help modal interactions
6. Keyboard navigation
7. Screen reader compatibility
8. Performance benchmarks (frame rate, load time)
9. Network conditions (slow 3G, offline)
10. Session timeout handling

---

## Notes for Test Implementation

### Selectors to Use
- Prefer `getByText()` for visible text
- Use `getByRole()` for interactive elements
- Use `getByTestId()` when specific selectors are needed
- Avoid implementation-dependent selectors

### Waits and Timing
- Wait for dice to update after roll
- Wait for turn indicator to change
- Implicit waits should be minimal
- Use `waitForSelector` for dynamic content

### Test Data
- Use consistent player names across tests
- Seed random number generator if needed for consistent dice
- Document any magic numbers used

### Flake Prevention
- Use `toBeVisible()` instead of `toBeDefined()`
- Add explicit waits before assertions
- Avoid time-dependent assertions
- Use realistic user interaction timing

---

## Contact & Questions

For questions about specific test scenarios, refer to:
- Full test plan: `docs/E2E_TEST_PLAN.md`
- Game rules: `README.md`
- Architecture: `docs/ARCHITECTURE.md`
- Playwright setup: `docs/PLAYWRIGHT_SETUP.md`
