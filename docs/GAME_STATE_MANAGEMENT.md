# Game State Management

This document describes the game state management system implemented for the Qwixx digital game.

## Overview

The game state management is implemented using React Context API with `useReducer` for global state management. This provides a native React solution without external dependencies, suitable for single-device pass-and-play gameplay.

## Architecture

### Core Components

1. **Types** (`src/types/game.ts`)
   - Type definitions for game state, players, dice, and actions
   - Ensures type safety throughout the application

2. **Game Reducer** (`src/state/gameReducer.ts`)
   - Central state management logic
   - Handles all game actions and state transitions
   - Validates state changes

3. **Game Context** (`src/state/GameContext.tsx`)
   - React Context provider for game state
   - `useGame` hook for accessing state and dispatch

4. **Helpers** (`src/utils/gameHelpers.ts`)
   - Utility functions for game logic
   - Player creation, score calculation, validation rules
   - Winner determination

5. **Dice Helpers** (`src/utils/diceHelpers.ts`)
   - Dice rolling functionality
   - Dice combination calculation
   - Active player vs. other players logic

6. **Validation** (`src/utils/validation.ts`)
   - Game state validation functions
   - Ensures data integrity

## Data Structure

### GameState

```typescript
interface GameState {
  players: Player[]              // Array of 2-5 players
  currentPlayerIndex: number     // Index of current active player
  dice: DiceState | null        // Current dice state (null when not rolled)
  lockedRows: RowColor[]        // Array of locked row colors
  gameStatus: GameStatus        // 'setup' | 'playing' | 'ended'
  history: GameAction[]         // History of all actions for undo/replay
}
```

### Player

```typescript
interface Player {
  id: string                    // Unique player identifier
  name: string                  // Player name
  scoreSheet: ScoreSheet        // Player's score sheet with 4 rows
  penalties: number             // Number of penalty marks (0-4)
  totalScore: number           // Calculated total score
}
```

### ScoreSheet

```typescript
interface ScoreSheet {
  red: ColorRow      // Red row: 2-12 ascending
  yellow: ColorRow   // Yellow row: 2-12 ascending
  green: ColorRow    // Green row: 12-2 descending
  blue: ColorRow     // Blue row: 12-2 descending
}
```

### ColorRow

```typescript
interface ColorRow {
  color: RowColor              // 'red' | 'yellow' | 'green' | 'blue'
  numbers: MarkedNumber[]      // Array of 11 numbers
  locked: boolean             // Whether row is locked
}
```

## Actions

### INITIALIZE_GAME

Initialize a new game with player names.

```typescript
dispatch({
  type: 'INITIALIZE_GAME',
  payload: { playerNames: ['Alice', 'Bob', 'Charlie'] }
})
```

**Validation:**
- Player count must be between 2 and 5
- Player names cannot be empty

### START_GAME

Start the game after initialization.

```typescript
dispatch({ type: 'START_GAME' })
```

**Validation:**
- Must have at least 2 players

### NEXT_TURN

Advance to the next player's turn.

```typescript
dispatch({ type: 'NEXT_TURN' })
```

**Effects:**
- Increments player index (wraps around)
- Clears dice state

### ROLL_DICE

Record the result of a dice roll.

```typescript
dispatch({
  type: 'ROLL_DICE',
  payload: {
    white1: 3,
    white2: 4,
    red: 5,
    yellow: 2,
    green: 6,
    blue: 1
  }
})
```

### MARK_NUMBER

Mark a number on a player's score sheet.

```typescript
dispatch({
  type: 'MARK_NUMBER',
  payload: {
    playerId: 'player-123',
    color: 'red',
    number: 7
  }
})
```

**Validation:**
- Row must not be locked
- Number must be to the right of rightmost marked number
- Number cannot already be marked

**Effects:**
- Updates player's score sheet
- Recalculates total score
- Locks row if marking last number with 5+ marks
- Ends game if win condition met

### LOCK_ROW

Lock a row (removes colored die from play).

```typescript
dispatch({
  type: 'LOCK_ROW',
  payload: { color: 'red' }
})
```

**Effects:**
- Ends game if 2 rows are locked

### ADD_PENALTY

Add a penalty mark to a player.

```typescript
dispatch({
  type: 'ADD_PENALTY',
  payload: { playerId: 'player-123' }
})
```

**Validation:**
- Penalties capped at 4

**Effects:**
- Updates penalty count
- Recalculates total score (-5 per penalty)
- Ends game if player reaches 4 penalties

### END_GAME

Manually end the game.

```typescript
dispatch({ type: 'END_GAME' })
```

### RESET_GAME

Reset to initial state.

```typescript
dispatch({ type: 'RESET_GAME' })
```

## Usage Example

```tsx
import { GameProvider, useGame } from './state'

function App() {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  )
}

function GameBoard() {
  const { state, dispatch } = useGame()
  
  // Initialize game
  const startNewGame = () => {
    dispatch({
      type: 'INITIALIZE_GAME',
      payload: { playerNames: ['Alice', 'Bob'] }
    })
    dispatch({ type: 'START_GAME' })
  }
  
  // Roll dice
  const rollDice = () => {
    dispatch({
      type: 'ROLL_DICE',
      payload: {
        white1: Math.ceil(Math.random() * 6),
        white2: Math.ceil(Math.random() * 6),
        red: Math.ceil(Math.random() * 6),
        yellow: Math.ceil(Math.random() * 6),
        green: Math.ceil(Math.random() * 6),
        blue: Math.ceil(Math.random() * 6),
      }
    })
  }
  
  // Mark a number
  const markNumber = (color, number) => {
    dispatch({
      type: 'MARK_NUMBER',
      payload: {
        playerId: state.players[state.currentPlayerIndex].id,
        color,
        number,
      }
    })
  }
  
  return (
    <div>
      <h1>Qwixx - {state.gameStatus}</h1>
      {/* Game UI */}
    </div>
  )
}
```

## Game Rules Implementation

### Marking Rules

- Numbers must be marked **left to right**
- Skipped numbers cannot be marked later
- Implemented in `canMarkNumber()` helper

### Locking Rules

- Row must have **5 or more marks** to lock
- Can only lock by marking the **last number** (2 or 12)
- When locked, that colored die is removed from play
- Implemented in `canLockRow()` helper

### Game End Conditions

Game ends when:
1. **Two rows are locked**, OR
2. **A player gets 4 penalty marks**

Implemented in `shouldGameEnd()` helper

### Score Calculation

Each row score = n × (n + 1) / 2, where n is the number of marks:
- 1 mark: 1 point
- 2 marks: 3 points
- 3 marks: 6 points
- ...
- 12 marks: 78 points

Penalties: -5 points each

Implemented in `calculateRowScore()` and `calculateTotalScore()` helpers

## Testing

Comprehensive test coverage includes:

- **gameHelpers.test.ts**: 30 tests for helper functions
- **gameReducer.test.ts**: 28 tests for state reducer
- **validation.test.ts**: 16 tests for validation functions

Run tests:
```bash
npm test
```

## Validation

The system includes validation at multiple levels:

1. **Action-level validation**: In the reducer for each action
2. **State-level validation**: `validateGameState()` for complete state integrity
3. **Player validation**: `validatePlayerCount()` and `validatePlayerNames()`

## Dice System

### Rolling Dice

```typescript
import { rollAllDice } from './utils'

// Roll all six dice
const diceState = rollAllDice()
// Returns: { white1: 3, white2: 4, red: 5, yellow: 2, green: 6, blue: 1 }
```

### Active Player Combinations

The active player can combine dice in multiple ways:

```typescript
import { getActivePlayerCombinations } from './utils'

const dice = {
  white1: 2,
  white2: 3,
  red: 4,
  yellow: 5,
  green: 6,
  blue: 1,
}

const combinations = getActivePlayerCombinations(dice, [])
// Returns:
// [
//   { color: null, sum: 5 },        // white1 + white2
//   { color: 'red', sum: 6 },       // white1 + red
//   { color: 'red', sum: 7 },       // white2 + red
//   { color: 'yellow', sum: 7 },    // white1 + yellow
//   { color: 'yellow', sum: 8 },    // white2 + yellow
//   { color: 'green', sum: 8 },     // white1 + green
//   { color: 'green', sum: 9 },     // white2 + green
//   { color: 'blue', sum: 3 },      // white1 + blue
//   { color: 'blue', sum: 4 },      // white2 + blue
// ]
```

### Other Players Combinations

Non-active players can only use the white dice:

```typescript
import { getOtherPlayerCombinations } from './utils'

const combinations = getOtherPlayerCombinations(dice)
// Returns: [{ color: null, sum: 5 }]  // Only white1 + white2
```

### Locked Row Handling

When a row is locked, its colored die is removed from combinations:

```typescript
const combinations = getActivePlayerCombinations(dice, ['red', 'blue'])
// Returns combinations without red or blue dice
```

## Winner Determination

```typescript
import { determineWinner } from './utils'

const winner = determineWinner(state.players)
// Returns array of player(s) with highest score
// Can return multiple players if there's a tie
```

## Future Enhancements

- Undo/redo functionality (history is already tracked)
- Local storage persistence
- Game state serialization/deserialization
- AI player support
- Statistics tracking
