# Qwixx E2E Test Architecture

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     QWIXX GAME APPLICATION                      │
└─────────────────────────────────────────────────────────────────┘

                              │
                              ▼
                    ┌─────────────────────┐
                    │   Game Setup        │
                    │ (GameSetup.tsx)     │
                    │                     │
                    │ • Select players    │
                    │ • Enter names       │
                    │ • Validate input    │
                    └─────────────────────┘
                              │
                    ✓ Valid input
                              │
                              ▼
                    ┌─────────────────────┐
                    │   Game Board        │
                    │ (GameBoard.tsx)     │
                    │                     │
                    │ [Active Player]     │
                    │ • Roll Dice         │
                    │ • Mark Numbers      │
                    │ • Pass Turn         │
                    │                     │
                    │ [Inactive Players]  │
                    │ • Mark White Sum    │
                    │ • View Only Colored │
                    └─────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
              ┌──────────────┐    ┌──────────────┐
              │ Game Active  │    │ Game Ended   │
              │ • Continue   │    │ • 2 Locked   │
              │   turns      │    │ • 4 Penalties│
              └──────────────┘    └──────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ▼
                    ┌─────────────────────┐
                    │  Game Summary       │
                    │ (GameSummary.tsx)   │
                    │                     │
                    │ • Final Scores      │
                    │ • Winner            │
                    │ • Score Breakdown   │
                    │ • New Game Button   │
                    └─────────────────────┘
```

---

## Test Coverage Hierarchy

```
E2E Tests (60+ Scenarios)
│
├─ Setup & Initialization (9 tests)
│  ├─ Load home screen
│  ├─ Select player count
│  ├─ Enter valid names
│  ├─ Error handling (missing, duplicate)
│  └─ Start game
│
├─ Dice Rolling (4 tests)
│  ├─ Roll dice updates display
│  ├─ Verify dice values (1-6)
│  ├─ White dice sum calculated
│  └─ Cannot roll after rolling
│
├─ Marking - Active Player (7 tests)
│  ├─ Mark valid numbers
│  ├─ Cannot mark invalid
│  ├─ Left-to-right rule
│  ├─ Skip and block
│  ├─ Toggle/unmark
│  ├─ Cannot mark locked rows
│  └─ Mark in multiple rows
│
├─ Marking - Inactive Players (3 tests)
│  ├─ Mark white dice sum only
│  ├─ Cannot mark colored combos
│  └─ Multiple players mark same number
│
├─ Colored Dice (3 tests)
│  ├─ Active player marks white+colored
│  ├─ Cannot mark as inactive
│  └─ Each color available once per turn
│
├─ Penalties & Passing (5 tests)
│  ├─ Penalty on pass without marking
│  ├─ Multiple penalties accumulate
│  ├─ Game ends on 4th penalty
│  ├─ No penalty if mark made
│  └─ Cannot pass without rolling
│
├─ Row Locking (4 tests)
│  ├─ Lock after 5+ marks + final
│  ├─ Cannot mark in locked
│  ├─ Locked row removed from dice
│  └─ Other players unaffected
│
├─ Game End & Summary (5 tests)
│  ├─ Game ends on 2 locked rows
│  ├─ Game ends on 4th penalty
│  ├─ View final scores
│  ├─ Score calculation correct
│  ├─ Winner announced
│  └─ Tie handling
│
├─ Multi-Turn Sequences (4 tests)
│  ├─ 2-player complete game
│  ├─ 3-player turn order
│  ├─ 4-player extended play
│  └─ State persistence
│
├─ Edge Cases (5 tests)
│  ├─ Mark last available
│  ├─ Colored die locked mid-turn
│  ├─ Both dice = same sum
│  ├─ All players pass
│  └─ Single remaining die
│
└─ UI & Interactions (5 tests)
   ├─ Mobile responsive
   ├─ Desktop layout
   ├─ Turn indicator updates
   ├─ Button states correct
   └─ Color consistency
```

---

## Game State Transitions

```
GAME STATUS: setup → playing → ended

┌──────────────────────────────────────────────────────────┐
│ SETUP STATE                                              │
├──────────────────────────────────────────────────────────┤
│ • playerCount: 2-5                                       │
│ • playerNames: string[]                                  │
│ • gameStatus: 'setup'                                    │
│ • Transition: START_GAME action → 'playing'             │
└──────────────────────────────────────────────────────────┘
                        │
                        │ START_GAME action
                        ▼
┌──────────────────────────────────────────────────────────┐
│ PLAYING STATE                                            │
├──────────────────────────────────────────────────────────┤
│ • players: Player[]                                      │
│ • currentPlayerIndex: number                             │
│ • dice: DiceState | null                                │
│ • Each turn cycle:                                       │
│   1. ROLL_DICE → dice set                               │
│   2. MARK_NUMBER (active/inactive players)              │
│   3. PASS_TURN / ADD_PENALTY                            │
│   4. Check end condition                                 │
│                                                         │
│ • End Condition 1: Two rows locked                      │
│ • End Condition 2: Player reaches 4 penalties           │
│ • Transition: END_GAME action → 'ended'                │
└──────────────────────────────────────────────────────────┘
                        │
                        │ END_GAME action
                        ▼
┌──────────────────────────────────────────────────────────┐
│ ENDED STATE                                              │
├──────────────────────────────────────────────────────────┤
│ • finalPlayers: Player[]                                 │
│ • gameStatus: 'ended'                                    │
│ • winners: Player[] (one or more in tie)                │
│ • GameSummary displays scores                           │
│ • Transition: NEW_GAME → back to 'setup'               │
└──────────────────────────────────────────────────────────┘
```

---

## Turn Flow State Machine

```
TURN CYCLE
──────────

              ┌─────────────────────┐
              │  ROLLING            │
              │                     │
              │ • Roll Dice button  │
              │   enabled           │
              │ • Pass Turn button  │
              │   disabled          │
              └─────────────────────┘
                      │
                      │ Click "Roll Dice"
                      ▼
              ┌─────────────────────┐
              │  WHITE-DICE         │
              │  PHASE              │
              │                     │
              │ • Active & Inactive │
              │   can mark white    │
              │   dice sum          │
              │ • Roll Dice button  │
              │   disabled          │
              │ • Pass Turn button  │
              │   enabled           │
              └─────────────────────┘
                      │
           ┌──────────┴──────────┐
           │ (Optional)          │
           ▼                     │
      ┌─────────────────────┐   │
      │  COLORED-DICE       │   │
      │  PHASE              │   │
      │  (Active Only)      │   │
      │                     │   │
      │ • Active can mark   │   │
      │   white + colored   │   │
      │ • Pass Turn to      │   │
      │   end turn          │   │
      └─────────────────────┘   │
                │               │
                ▼               │
          ┌──────────────┐      │
          │  INACTIVE    │◄─────┘
          │  PLAYERS     │
          │  PHASE       │
          │              │
          │ • Other      │
          │   players    │
          │   can mark   │
          │   white      │
          │   dice sum   │
          │ • When all   │
          │   pass, go   │
          │   to next    │
          │   player     │
          └──────────────┘
                │
                │ All inactive players pass
                ▼
          ┌──────────────┐
          │ NEXT PLAYER  │
          │              │
          │ Return to    │
          │ ROLLING      │
          │ state        │
          └──────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│ USER INTERACTIONS                                   │
├─────────────────────────────────────────────────────┤
│ • Click buttons (Roll, Pass, Mark, etc)             │
│ • Enter text (Player names)                         │
│ • Select options (Player count)                     │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ REACT COMPONENTS                                    │
├─────────────────────────────────────────────────────┤
│ • GameSetup → GameBoard → GameSummary               │
│ • Handle local state (UI state)                     │
│ • Call dispatch(action) for game state changes      │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ GAME REDUCER (gameReducer.ts)                       │
├─────────────────────────────────────────────────────┤
│ Action Types:                                       │
│ • INITIALIZE_GAME                                   │
│ • ROLL_DICE                                         │
│ • MARK_NUMBER                                       │
│ • UNMARK_NUMBER                                     │
│ • PASS_TURN                                         │
│ • ADD_PENALTY                                       │
│ • LOCK_ROW                                          │
│ • END_GAME                                          │
│ • RESET_GAME                                        │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ GAME STATE (GameContext)                            │
├─────────────────────────────────────────────────────┤
│ {                                                   │
│   gameStatus: 'setup' | 'playing' | 'ended'        │
│   players: Player[]                                 │
│   currentPlayerIndex: number                        │
│   dice: DiceState | null                            │
│   lockedRows: RowColor[]                            │
│   winners?: Player[]                                │
│ }                                                   │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ PERSISTENT STORAGE (localStorage)                   │
├─────────────────────────────────────────────────────┤
│ • Auto-save game state                              │
│ • Resume game option                                │
│ • Settings (auto-save enabled)                      │
└─────────────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────┐
│ BROWSER RENDER                                      │
├─────────────────────────────────────────────────────┤
│ • Display current game state                        │
│ • Highlight valid actions                           │
│ • Show player information                           │
└─────────────────────────────────────────────────────┘
```

---

## Component Interaction Map

```
                        ┌─────────────┐
                        │   App.tsx   │
                        │ (Main)      │
                        └──────┬──────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                    ▼          ▼          ▼
            ┌───────────┐ ┌─────────┐ ┌─────────┐
            │ GameSetup │ │GameBoard│ │GameSummary
            │  SETUP    │ │ PLAYING │ │  ENDED
            └────┬──────┘ └────┬────┘ └─────────┘
                 │             │
                 │             ├─────────────────┐
                 │             │                 │
                 │             ▼                 ▼
                 │      ┌───────────────┐  ┌──────────┐
                 │      │ DiceDisplay   │  │ ScoreSheet
                 │      │ • Show dice   │  │ • Mark #s
                 │      │   values      │  │ • Show row
                 │      └───────────────┘  │   scores
                 │                         └──────────┘
                 │             │                 │
                 │             ├─────────────────┤
                 │             │                 │
                 │             ▼                 ▼
                 │      ┌──────────────┐ ┌──────────────┐
                 │      │GameControls  │ │ HelpModal
                 │      │ • Roll button│ │ • Show rules
                 │      │ • Pass button│ │
                 │      └──────────────┘ └──────────────┘
                 │             │
                 │             └─────────────────┐
                 │                               │
                 └───────────────────────────────┴────> GameContext
                                                       (useReducer)
```

---

## Scoring Calculation

```
SCORE SHEET STRUCTURE

┌──────────────────────────────────────────────────┐
│ Player Score Sheet                               │
├──────────────────────────────────────────────────┤
│                                                  │
│  RED (2→12 ascending)                           │
│  □ 2 □ 3 □ 4 □ 5 □ 6 □ 7 □ 8 □ 9 □ 10 □ 11 □ 12 □ 🔒│
│  Marks: 5/12  Score: 15 points                  │
│                                                  │
│  YELLOW (2→12 ascending)                        │
│  □ 2 □ 3 □ 4 □ 5 □ 6 □ 7 □ 8 □ 9 □ 10 □ 11 □ 12 □    │
│  Marks: 8/12  Score: 36 points                  │
│                                                  │
│  GREEN (12→2 descending)                        │
│  □ 12 □ 11 □ 10 □ 9 □ 8 □ 7 □ 6 □ 5 □ 4 □ 3 □ 2 □ 🔒│
│  Marks: 6/12  Score: 21 points                  │
│                                                  │
│  BLUE (12→2 descending)                         │
│  □ 12 □ 11 □ 10 □ 9 □ 8 □ 7 □ 6 □ 5 □ 4 □ 3 □ 2 □    │
│  Marks: 3/12  Score: 6 points                   │
│                                                  │
├──────────────────────────────────────────────────┤
│ Row Scores:  15 + 36 + 21 + 6 = 78 points       │
│ Penalties:   0 × -5 = 0 points                  │
│ TOTAL SCORE: 78 points                          │
└──────────────────────────────────────────────────┘

SCORING TABLE
─────────────
Marked Count  → Points
1             → 1
2             → 3
3             → 6
4             → 10
5             → 15
6             → 21
7             → 28
8             → 36
9             → 45
10            → 55
11            → 66
12 + Lock     → 78

Penalty Mark: -5 points each (max 4 penalties = -20)
```

---

## Test File Organization

```
e2e/
│
├─ helpers.ts
│  ├─ setupGameWith2Players()
│  ├─ setupGameWithNPlayers()
│  ├─ rollDice()
│  ├─ passTurn()
│  ├─ markNumber()
│  ├─ getCurrentPlayerName()
│  └─ getWhiteDiceSum()
│
├─ game-setup.spec.ts (9 tests)
│  ├─ Load home screen
│  ├─ Change player count
│  ├─ Enter valid names
│  ├─ Error: missing names
│  ├─ Error: incomplete names
│  ├─ Error: duplicate names
│  └─ Whitespace handling
│
├─ dice-rolling.spec.ts (4 tests)
│  ├─ Roll dice on first turn
│  ├─ Verify dice values
│  ├─ Roll again on next turn
│  └─ Cannot roll twice
│
├─ marking-active.spec.ts (7 tests)
│  ├─ Mark valid number
│  ├─ Mark multiple numbers
│  ├─ Cannot mark invalid
│  ├─ Cannot mark in locked row
│  ├─ Left-to-right rule
│  ├─ Skip and block
│  └─ Toggle/unmark
│
├─ marking-inactive.spec.ts (3 tests)
│  ├─ Mark white sum only
│  ├─ Cannot mark colored combo
│  └─ Multiple players mark
│
├─ colored-dice.spec.ts (3 tests)
│  ├─ Mark colored combination
│  ├─ Multiple colored marks
│  └─ Cannot mark as inactive
│
├─ penalties.spec.ts (5 tests)
│  ├─ Pass without marking = penalty
│  ├─ Multiple penalties
│  ├─ Game ends on 4th penalty
│  ├─ No penalty if mark made
│  └─ Cannot pass without roll
│
├─ locking-rows.spec.ts (4 tests)
│  ├─ Lock after 5 marks
│  ├─ Cannot mark in locked
│  ├─ Locked row removed
│  └─ Independent per player
│
├─ game-end.spec.ts (5 tests)
│  ├─ End on 2 locked rows
│  ├─ End on 4th penalty
│  ├─ View final scores
│  ├─ Score calculation
│  └─ Winner announced
│
├─ multi-turn.spec.ts (4 tests)
│  ├─ Complete 2-player game
│  ├─ 3-player turn order
│  ├─ 4-player extended play
│  └─ State persistence
│
├─ edge-cases.spec.ts (5 tests)
│  ├─ Mark last available
│  ├─ Colored die locked mid-turn
│  ├─ Same sum from both dice
│  ├─ All players pass
│  └─ Single remaining die
│
└─ ui-interactions.spec.ts (5 tests)
   ├─ Mobile responsive
   ├─ Desktop layout
   ├─ Turn indicator updates
   ├─ Button states
   └─ Color consistency
```

---

## Test Execution Flow

```
npm run test:pw
      │
      ▼
┌──────────────────────────────┐
│ Playwright starts            │
│ • Loads config               │
│ • Starts dev server          │
│ • Opens browsers             │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────────┐
│ For each test file:                              │
│ ├─ game-setup.spec.ts (9 tests)                  │
│ ├─ dice-rolling.spec.ts (4 tests)                │
│ ├─ marking-active.spec.ts (7 tests)              │
│ ├─ marking-inactive.spec.ts (3 tests)            │
│ ├─ colored-dice.spec.ts (3 tests)                │
│ ├─ penalties.spec.ts (5 tests)                   │
│ ├─ locking-rows.spec.ts (4 tests)                │
│ ├─ game-end.spec.ts (5 tests)                    │
│ ├─ multi-turn.spec.ts (4 tests)                  │
│ ├─ edge-cases.spec.ts (5 tests)                  │
│ └─ ui-interactions.spec.ts (5 tests)             │
└──────────────────────────────────────────────────┘
      │
      ▼ (Parallel across browsers)
┌──────────────────────────────┐
│ Chromium  Firefox  WebKit     │
│ Pixel 5   iPhone 12           │
└──────────────────────────────┘
      │
      ▼ (Total: 60 tests × 5 browsers = 300 test runs)
┌──────────────────────────────┐
│ Generate HTML report         │
│ playwright-report/index.html │
└──────────────────────────────┘
      │
      ▼
┌──────────────────────────────┐
│ Exit with status             │
│ 0 = all passed ✓             │
│ 1 = failures ✗               │
└──────────────────────────────┘
```

---

## Error Handling Flow

```
USER ERROR (e.g., enter duplicate names)
        │
        ▼
    VALIDATION in GameSetup component
        │
    ┌───┴───┐
    │       │
    ▼       ▼
  VALID   INVALID
    │       │
    │       ▼
    │   Set error state
    │       │
    │       ▼
    │   Display error message
    │   to user
    │       │
    │       ▼
    │   User corrects input
    │       │
    │       └──────┐
    │              │
    └──────────────┤
                   │
                   ▼
            RE-VALIDATE
                   │
                   └──> Success → Start Game
```

---

## Success Criteria for Test Suite

```
✓ All 60+ scenarios pass
✓ Pass on all 5 browser configurations
  ├─ Chromium (Desktop)
  ├─ Firefox (Desktop)
  ├─ WebKit (Desktop)
  ├─ Mobile Chrome (Pixel 5)
  └─ Mobile Safari (iPhone 12)
✓ No flaky tests (consistent results)
✓ Fast execution (< 60 seconds total)
✓ Clear error messages for failures
✓ HTML report generated
✓ No console errors
✓ No unhandled promise rejections
```
