# Architecture

## State Management Strategy

Based on the complexity described in the README and ROADMAP, the application requires managing:

- Multiple players (2-5)
- Turn management
- Score sheets for each player
- Dice states
- Game history/statistics
- Undo functionality

### Recommended Approach: React Context + useReducer

For this application's complexity level, we recommend using:

1. **React Context API** with **useReducer** for global state management
   - Native React solution, no external dependencies
   - Sufficient for single-device, pass-and-play gameplay
   - Easy to test and understand
   - Good performance for this use case

2. **Local Storage** for persistence
   - Simple browser-based storage
   - No backend required
   - Supports game state persistence

### Alternative Considerations

If the application grows more complex, consider:

- **Zustand**: Lightweight state management with minimal boilerplate
- **Redux Toolkit**: If more advanced features like time-travel debugging are needed

## Component Structure (Planned)

```
App
├── GameSetup (player names, count)
├── GameBoard
│   ├── DiceDisplay
│   ├── ScoreSheet (per player)
│   │   ├── ColorRow (x4)
│   │   └── PenaltyMarks
│   ├── TurnIndicator
│   └── GameControls (roll, pass, undo)
└── GameSummary (end screen)
```

## Data Models (Planned)

### GameState
```typescript
{
  players: Player[]
  currentPlayerIndex: number
  dice: DiceState
  lockedRows: string[]
  gameStatus: 'setup' | 'playing' | 'ended'
  history: GameAction[]
}
```

### Player
```typescript
{
  id: string
  name: string
  scoreSheet: ScoreSheet
  penalties: number
  totalScore: number
}
```

## Mobile-First Design

- Responsive layouts using Tailwind CSS
- Touch-friendly interactions
- Optimized for portrait orientation
- Minimum supported viewport: 320px
