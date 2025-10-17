# Qwixx E2E Test Plan

## Application Overview

Qwixx is a digital recreation of the popular dice game for 2-5 players. The application features:

### Core Functionality
- **Game Setup**: Player selection (2-5 players) and name entry
- **Dice Rolling**: 6 dice (2 white, 4 colored) with automatic rolling
- **Score Sheets**: Interactive marking of numbers on colored rows
- **Turn Management**: Active player turns with pass functionality
- **Game End Conditions**: Game ends when 2 rows are locked OR a player gets 4 penalties
- **Scoring**: Automatic score calculation with penalties

### Game Rules (Summary)
- Players mark numbers from left to right in rows
- Red/Yellow rows: 2-12 ascending
- Green/Blue rows: 12-2 descending
- Once a number is skipped, it cannot be marked later
- Rows lock when 5+ numbers are marked and the final number is marked
- Locked rows remove that color die from play
- Failure to mark = penalty (-5 points, max 4 penalties)
- Game ends when 2 rows locked or someone gets 4 penalties

### Key Components
- `GameSetup` - Player configuration
- `GameBoard` - Main game interface
- `DiceDisplay` - Shows current dice values
- `ScoreSheet` - Interactive score sheet per player
- `GameControls` - Roll dice and pass turn buttons
- `GameSummary` - Final scores and winner

---

## Test Scenarios

### 1. Game Setup and Initialization

#### 1.1 Load Game Home Screen
**Steps:**
1. Navigate to the application root URL
2. Wait for the page to fully load

**Expected Results:**
- Page displays "Qwixx" title
- "Digital dice game" subtitle is visible
- Player count selection buttons (2, 3, 4, 5) are visible
- Initially "2" is selected
- Player name input fields display based on selected player count
- "Start Game" button is visible but potentially disabled

#### 1.2 Change Player Count - Increase Players
**Steps:**
1. On the game setup screen, verify 2 players is initially selected
2. Click on "3" player count button
3. Observe the name input fields

**Expected Results:**
- "3" button becomes highlighted/selected
- 3 empty name input fields appear
- Previous player names are cleared or reset
- "4" and "5" buttons remain available

#### 1.3 Change Player Count - Decrease Players
**Steps:**
1. On the game setup screen with 5 players selected
2. Click on "3" player count button

**Expected Results:**
- Only 3 name input fields are displayed
- "3" button is highlighted
- Remaining player count buttons are accessible

#### 1.4 Enter Valid Player Names (2 Players)
**Steps:**
1. On the game setup screen with 2 players selected
2. Click on the first player name input field
3. Type "Alice"
4. Click on the second player name input field
5. Type "Bob"
6. Click the "Start Game" button

**Expected Results:**
- Both names appear in their respective input fields
- "Start Game" button is enabled and clickable
- Game transitions to the GameBoard screen
- Both players are visible in the game

#### 1.5 Enter Valid Player Names (4 Players)
**Steps:**
1. Change player count to 4
2. Enter names: "Player1", "Player2", "Player3", "Player4"
3. Click "Start Game" button

**Expected Results:**
- Game initializes with 4 players
- All 4 player names are displayed in the game interface
- Dice are ready to roll

#### 1.6 Error: Missing Player Names
**Steps:**
1. On the game setup screen
2. Leave the first player name field empty
3. Enter only "Bob" for player 2
4. Click "Start Game" button

**Expected Results:**
- Error message appears: "Please enter names for at least 2 players"
- Game does not start
- User remains on setup screen

#### 1.7 Error: Incomplete Player Names
**Steps:**
1. On the game setup screen with 3 players selected
2. Enter "Alice", "Bob" (leaving third player empty)
3. Click "Start Game" button

**Expected Results:**
- Error message appears: "Please enter names for all 3 players"
- Game does not start
- Setup screen remains visible

#### 1.8 Error: Duplicate Player Names
**Steps:**
1. On the game setup screen with 2 players
2. Enter "Alice" for both player 1 and player 2
3. Click "Start Game" button

**Expected Results:**
- Error message appears: "Player names must be unique"
- Game does not start
- Both names remain in the input fields

#### 1.9 Player Names with Whitespace
**Steps:**
1. On the game setup screen
2. Enter "  Alice  " for player 1
3. Enter "  Bob  " for player 2
4. Click "Start Game" button

**Expected Results:**
- Names are trimmed (whitespace removed)
- Game starts successfully
- Players display as "Alice" and "Bob" (without extra spaces)

---

### 2. Dice Rolling and Turn Flow

#### 2.1 Roll Dice on First Turn
**Steps:**
1. Start a new game with 2 players (Alice, Bob)
2. Observe the game board
3. Click the "Roll Dice" button

**Expected Results:**
- "Roll Dice" button is clickable on first turn
- Dice display updates with random values
- All 6 dice show values (white1, white2, red, yellow, green, blue)
- White dice sum is displayed (e.g., "3 + 4 = 7")
- "Pass Turn" button becomes available

#### 2.2 Dice Display Shows Correct Values
**Steps:**
1. Roll dice in a game
2. Observe the displayed dice values

**Expected Results:**
- Each die shows a value between 1-6
- White dice sum is mathematically correct
- All dice are labeled with their color
- Locked row dice are grayed out/disabled

#### 2.3 Roll Dice Again on Next Turn
**Steps:**
1. Start a game
2. Roll dice once
3. Mark a number (any valid number)
4. Pass turn to next player
5. Next player clicks "Roll Dice"

**Expected Results:**
- Dice display updates with new random values
- Previous dice values are replaced
- Current player's name is shown in the control panel

#### 2.4 Cannot Roll Before Passing
**Steps:**
1. Start a game and roll dice
2. Without passing turn, try to roll again

**Expected Results:**
- "Roll Dice" button is disabled
- Button appears grayed out
- Helper text explains: "Mark numbers or pass to continue"

---

### 3. Marking Numbers - Active Player

#### 3.1 Mark Valid Number (White Dice Sum)
**Steps:**
1. Start a game with 2 players
2. Roll dice (note the white dice sum, e.g., 7)
3. Click on number 7 in any colored row on the active player's sheet

**Expected Results:**
- Number 7 is marked (highlighted in row color)
- Number appears visually marked/filled
- "Pass Turn" button remains available
- Other marked status doesn't change

#### 3.2 Mark Multiple Valid Numbers
**Steps:**
1. Roll dice (white sum = 7, red die = 5)
2. Mark 7 in yellow row
3. Mark 5+5 (10) in red row
4. Verify marked numbers

**Expected Results:**
- Both numbers appear marked
- All marks are persistent and visible
- Row scores update to reflect marks

#### 3.3 Cannot Mark Invalid Numbers
**Steps:**
1. Roll dice (white sum = 7)
2. Attempt to click a number that isn't 7 (e.g., 5) in any colored row during white dice phase

**Expected Results:**
- Number 5 is NOT marked
- Invalid numbers appear disabled/grayed out
- No change to the player's sheet

#### 3.4 Cannot Mark in Locked Row
**Steps:**
1. Play until a row is locked (5+ marks, then mark the final number)
2. Observe the locked row has a lock icon
3. Try to mark a number in the locked row

**Expected Results:**
- Locked row numbers cannot be clicked
- Lock icon (🔒) is displayed
- Numbers in locked row appear grayed out

#### 3.5 Mark Number Left-to-Right Rule
**Steps:**
1. Roll dice and mark number 5 in a row
2. Try to mark number 3 (which is to the left of 5)

**Expected Results:**
- Number 3 is disabled/cannot be marked
- Number 3 appears grayed out or crossed through
- Helper text indicates it's "blocked"

#### 3.6 Skip Numbers in a Row
**Steps:**
1. Roll and mark only number 7 in red row (skipping 2-6)
2. On next turn, roll and get white sum = 4

**Expected Results:**
- Number 4 cannot be marked in red row (blocked by skipped numbers)
- Number 4 is grayed out/disabled in red row
- Number 4 can be marked in other rows

#### 3.7 Toggle/Unmark a Number
**Steps:**
1. Roll dice and mark number 7 in yellow row
2. Click on number 7 again to unmark it

**Expected Results:**
- Number 7 becomes unmarked
- Visual highlighting is removed
- Number returns to normal appearance

---

### 4. Marking Numbers - Inactive Players

#### 4.1 Inactive Players Can Mark White Dice Sum
**Steps:**
1. Start game with 3 players (Alice, Bob, Carol)
2. Alice rolls dice (white sum = 8)
3. Alice marks a different number (e.g., red 5)
4. Observe Bob's and Carol's sheets

**Expected Results:**
- Bob and Carol can mark 8 in any of their rows
- Bob and Carol cannot mark active player's colored die combination
- If Bob marks 8 in his sheet and passes, Carol still has option to mark 8

#### 4.2 Inactive Player Marks, Active Player Continues
**Steps:**
1. 2+ players in game, active player rolls (white sum = 7)
2. Inactive player marks 7 in their sheet
3. Active player marks a different number and passes

**Expected Results:**
- Both marks are recorded
- Turn passes to next player
- All marks from previous turn persist

#### 4.3 Cannot Mark Colored Dice as Inactive Player
**Steps:**
1. Active player rolls (white sum = 7, red = 5, so 5+5=10)
2. Inactive player attempts to click 10 in red row

**Expected Results:**
- Number 10 in red row is NOT available for inactive player
- Only white dice sum (7) is available for inactive player
- Colored die combinations are exclusive to active player

---

### 5. Colored Dice Combination (Active Player Only)

#### 5.1 Mark Colored Dice Combination
**Steps:**
1. Active player rolls dice (white sum = 5, red = 4, so white + red = 9)
2. Active player marks 9 in the red row

**Expected Results:**
- Number 9 is marked in red row
- Mark is recorded and visible
- "Pass Turn" remains available

#### 5.2 Mark Multiple Colored Combinations
**Steps:**
1. Roll dice (example: white=3, yellow=2, so white+yellow=5)
2. Mark 5 in yellow row
3. On same turn, roll is still active, mark another combination if available

**Expected Results:**
- Each colored combination is available once per turn
- Marked combinations are recorded
- Numbers are added to appropriate colored rows

#### 5.3 Cannot Mark Colored Combination as Inactive
**Steps:**
1. Active player rolls (white = 2, red = 3, so white+red=5)
2. Inactive player attempts to mark 5 in red row

**Expected Results:**
- Inactive player cannot mark the colored combination
- Number remains disabled/unavailable for inactive player
- Only active player can mark white+colored combinations

---

### 6. Penalties and Passing

#### 6.1 Pass Turn Without Marking
**Steps:**
1. Active player rolls dice
2. Chooses not to mark any numbers
3. Clicks "Pass Turn" button

**Expected Results:**
- Active player receives a penalty mark (-5 points)
- Penalty display updates (e.g., "Penalties: 1")
- Turn passes to next player
- Game continues

#### 6.2 Multiple Penalties
**Steps:**
1. Play turns where active player passes without marking 3 times
2. Observe the same player's penalty count

**Expected Results:**
- Penalty count increments: 1, 2, 3, 4
- Each penalty is -5 points
- Player's total score decreases appropriately

#### 6.3 Game Ends on Fourth Penalty
**Steps:**
1. Get a player to 3 penalties
2. On their fourth turn without marking, pass turn

**Expected Results:**
- Fourth penalty is recorded
- Game immediately ends
- GameSummary screen displays with final scores

#### 6.4 Pass Turn After Marking
**Steps:**
1. Roll dice
2. Mark one or more numbers
3. Click "Pass Turn"

**Expected Results:**
- No penalty is applied
- Turn passes to next player
- Previously marked numbers remain on sheet

#### 6.5 Cannot Pass Without Rolling First
**Steps:**
1. On a fresh turn, attempt to click "Pass Turn" button

**Expected Results:**
- "Pass Turn" button is disabled
- Button appears grayed out
- "Roll Dice" button is enabled

---

### 7. Locking Rows

#### 7.1 Lock Row After Fifth Mark
**Steps:**
1. Play game until a row has exactly 5 marks
2. On subsequent turn, roll and get the rightmost number (12 for ascending, 2 for descending)
3. Mark the final number in that row

**Expected Results:**
- Lock icon (🔒) appears in the row
- Row numbers become disabled/grayed out
- Corresponding colored die is no longer shown in dice display
- That colored die becomes grayed out in the display

#### 7.2 Cannot Mark in Locked Row
**Steps:**
1. With a locked row, roll and get a number from that row
2. Attempt to mark it

**Expected Results:**
- Number is disabled/cannot be clicked
- Lock icon confirms row is locked
- No mark can be added

#### 7.3 Locked Row Removed from Active Player Options
**Steps:**
1. Lock a row (e.g., red)
2. On next turn with active player, roll dice

**Expected Results:**
- Red die is no longer shown (or grayed out)
- Red colored combinations are unavailable
- Active player cannot mark any numbers in red row

#### 7.4 Inactive Players Cannot Unlock
**Steps:**
1. Red row is locked for a player
2. Another player's turn, they have red available

**Expected Results:**
- Other players' red rows are independent
- Other player can still mark in their red row
- Lock status doesn't affect other players

---

### 8. Game End Conditions

#### 8.1 Game Ends When Two Rows Locked
**Steps:**
1. Play until 2 different rows are locked
2. Observe the game state after the second lock

**Expected Results:**
- Game immediately transitions to GameSummary
- No additional turns are possible
- Final scores are displayed

#### 8.2 Game Ends on Fourth Penalty
**Steps:**
1. Play until a player accumulates 4 penalties
2. On fourth penalty assignment

**Expected Results:**
- Game immediately ends
- GameSummary screen displays
- Penalty is recorded as -20 points total

#### 8.3 Game Does Not End on One Locked Row
**Steps:**
1. Lock exactly 1 row
2. Continue gameplay

**Expected Results:**
- Game continues
- Players take turns normally
- Second lock is needed to end game

---

### 9. Game Summary and Scoring

#### 9.1 View Final Scores
**Steps:**
1. Complete a game (2 rows locked or 4 penalties)
2. Observe GameSummary screen

**Expected Results:**
- "Game Over!" title is displayed
- Winner is announced with trophy icon (👑)
- All players' final scores are shown
- Scores are sorted (highest to lowest)

#### 9.2 Score Breakdown by Row
**Steps:**
1. Complete a game
2. View the summary for each player

**Expected Results:**
- Each row score is displayed (Red, Yellow, Green, Blue)
- Penalty score is shown if applicable
- Total score matches sum of row scores + penalties

#### 9.3 Correct Scoring Calculation
**Steps:**
1. Complete a game
2. Note the scoring table:
   - 1 mark = 1 point
   - 2 marks = 3 points
   - 3 marks = 6 points
   - ... up to 12 marks (all + lock) = 78 points
3. Verify calculations

**Expected Results:**
- Each row score matches the expected point value
- Locked row displays highest score (if all numbers marked + lock)
- Total score is accurate

#### 9.4 Tie Game
**Steps:**
1. Play a game where 2+ players end with the same score
2. Observe the summary

**Expected Results:**
- Both/all tied players are announced as winners
- Message reads: "It's a tie! [Names] win with [Score] points!"
- Both winners have crown icon (👑)

#### 9.5 New Game Button
**Steps:**
1. Complete a game and view summary
2. Click "New Game" button

**Expected Results:**
- Returns to GameSetup screen
- All previous game state is cleared
- Player name fields are empty
- Player count is reset to 2

---

### 10. Game State and Multi-Turn Sequences

#### 10.1 Complete 2-Player Game (Happy Path)
**Setup:** 2 players - Alice and Bob

**Steps:**
1. Start game with Alice and Bob
2. Alice rolls, marks number 7 in yellow
3. Alice passes
4. Bob rolls, marks number 4 in red
5. Bob passes
6. Alice rolls, marks number 5 in green
7. Continue turns until game ends (2 rows locked or 4 penalties)

**Expected Results:**
- All moves execute correctly
- Turn alternates properly
- Marks persist across turns
- Game ends according to rules
- Final scores display correctly

#### 10.2 3-Player Game Turn Order
**Setup:** 3 players - Alice, Bob, Carol

**Steps:**
1. Start game
2. Roll and play several turns
3. Track whose turn it is after each pass

**Expected Results:**
- Turn order follows: Alice → Bob → Carol → Alice
- Each player gets exactly one turn in sequence
- No players are skipped
- Turn indicator updates correctly

#### 10.3 4-Player Game Extended Play
**Setup:** 4 players - P1, P2, P3, P4

**Steps:**
1. Start game
2. Play 10+ turns, observing marks and passes
3. Note any locked rows
4. Continue until game end

**Expected Results:**
- All 4 players get turns in order
- Marks accumulate correctly
- Scoring calculations remain accurate
- Game ends appropriately

#### 10.4 Game State Persistence During Play
**Steps:**
1. Start a game
2. Make several moves (marks, passes)
3. Take note of the current game state
4. Perform browser actions (not refresh)
5. Verify game state

**Expected Results:**
- Current player, marks, scores, and dice remain consistent
- No unexpected state changes
- Game flow is uninterrupted

---

### 11. Edge Cases and Validation

#### 11.1 Mark Last Available Number
**Steps:**
1. Play until a row has 11 marks
2. Roll and get the final number (12 for ascending)
3. Mark it, locking the row

**Expected Results:**
- Row locks successfully
- Lock icon appears
- Number is marked before lock state applies

#### 11.2 Colored Die Locked Mid-Turn
**Steps:**
1. Red row has exactly 5 marks
2. Active player rolls and gets red die value
3. Active player marks the final number in red (locks it)
4. Same turn, verify red combinations are unavailable

**Expected Results:**
- Red die is marked as locked
- Red die disappears from display or grays out
- Red colored combinations become unavailable

#### 11.3 Both Dice Sets Provide Same Sum
**Steps:**
1. Roll: white = 3+2, red = 1 (white sum = 5, colored sum could also = 5)
2. Attempt to mark 5 in colored row as active player

**Expected Results:**
- 5 can be marked as white+colored combination in that row
- Mark is recorded correctly
- Row score updates

#### 11.4 All Players Pass Same Turn
**Steps:**
1. Roll dice where no valid numbers exist (impossible in normal play, but test scenario)
2. Or simulate a scenario where all players choose to pass

**Expected Results:**
- Each passing player receives a penalty
- Turn order continues
- Game does not end prematurely

#### 11.5 Single Remaining Die Available
**Steps:**
1. Lock 3 of 4 colored rows
2. Play continues with only 1 colored die
3. Roll and observe available options

**Expected Results:**
- Only white dice sum is available to non-active players
- Active player can mark white sum or white+remaining colored die
- Game continues normally

---

### 12. User Interface and Interactions

#### 12.1 Responsive Layout on Mobile (Portrait)
**Steps:**
1. Open game on mobile device (or use mobile viewport)
2. Start a game
3. Interact with UI elements

**Expected Results:**
- Dice display fits on screen
- Score sheets are scrollable if needed
- Buttons are touch-friendly
- No horizontal scrolling required
- Text is readable

#### 12.2 Responsive Layout on Desktop
**Steps:**
1. Open game on desktop browser
2. Play a game

**Expected Results:**
- All elements fit on screen
- No unnecessary whitespace
- UI is properly aligned
- Buttons are easily clickable

#### 12.3 Player Turn Indicator Updates
**Steps:**
1. Play a game
2. After each pass turn, observe the turn indicator

**Expected Results:**
- Current player name updates in control panel
- Indicator clearly shows whose turn it is
- Previous player information is not shown

#### 12.4 Button State Changes Appropriately
**Steps:**
1. Start game
2. Observe "Roll Dice" button state
3. After rolling, observe "Pass Turn" state
4. After marking, observe button states

**Expected Results:**
- "Roll Dice" button: enabled initially, disabled after roll
- "Pass Turn" button: disabled initially, enabled after roll
- Buttons' visual state reflects their enabled/disabled status

#### 12.5 Color Coding Consistency
**Steps:**
1. View game board with all colors visible
2. Check dice colors, row colors, marks

**Expected Results:**
- Red, Yellow, Green, Blue are consistently colored throughout
- White dice are clearly distinguished
- Color coding aids gameplay

---

## Test Execution Notes

### Assumptions
- Start with blank/fresh game state before each scenario
- Browser cookies/storage are cleared between tests (unless testing persistence)
- Development server is running on http://localhost:5173
- All 5 browser configurations (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari) should pass all tests

### Success Criteria
- All assertions pass
- UI updates correctly after each action
- Game logic follows Qwixx rules exactly
- No JavaScript errors in console
- Performance is acceptable (UI updates within 1 second)

### Known Limitations
- This test plan focuses on happy path and common edge cases
- Accessibility features (ARIA labels, keyboard navigation) are assumed to be present but not explicitly tested
- Advanced animations/visual effects are not validated
- Performance under heavy load is not tested
- Game state auto-save feature is not explicitly tested here

---

## Test Organization

Tests should be organized in E2E spec files:
- `e2e/game-setup.spec.ts` - Scenarios 1 (Setup)
- `e2e/dice-rolling.spec.ts` - Scenario 2 (Dice)
- `e2e/marking-active-player.spec.ts` - Scenario 3 (Marking Active)
- `e2e/marking-inactive-players.spec.ts` - Scenario 4 (Marking Inactive)
- `e2e/colored-dice.spec.ts` - Scenario 5 (Colored Dice)
- `e2e/penalties.spec.ts` - Scenario 6 (Penalties)
- `e2e/locking-rows.spec.ts` - Scenario 7 (Locking)
- `e2e/game-end.spec.ts` - Scenario 8-9 (End & Summary)
- `e2e/multi-turn.spec.ts` - Scenario 10 (Multi-turn)
- `e2e/edge-cases.spec.ts` - Scenario 11 (Edge Cases)
- `e2e/ui-interactions.spec.ts` - Scenario 12 (UI)
