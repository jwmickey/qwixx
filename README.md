# Qwixx

A digital recreation of the popular dice game Qwixx for mobile and web platforms.

## About Qwixx

Qwixx is a fast-paced dice game where players mark numbers on their score sheet to form rows. The game combines luck and strategy as players must decide when to mark numbers and when to pass.

### Game Components

- **6 Dice**: 2 white dice and 4 colored dice (red, yellow, green, blue)
- **Score Sheets**: Each player has a score sheet with four colored rows
- **Players**: 2-5 players

### Game Rules

#### Score Sheet Layout

Each player's score sheet contains four colored rows:
- **Red Row**: Numbers 2-12 (left to right, ascending)
- **Yellow Row**: Numbers 2-12 (left to right, ascending)
- **Green Row**: Numbers 12-2 (left to right, descending)
- **Blue Row**: Numbers 12-2 (left to right, descending)

Each row also has a lock symbol at the end (right side).

#### Gameplay

1. **Active Player's Turn**:
   - The active player rolls all 6 dice
   - First, they announce the sum of the two white dice
   - All players (including the active player) may mark this sum in any one of their colored rows
   
2. **Active Player's Additional Action**:
   - The active player may additionally combine one white die with one colored die
   - They can mark this sum in the row matching the colored die's color
   - Only the active player can perform this action

3. **Marking Rules**:
   - Numbers must be marked from left to right in each row
   - Numbers may be skipped, but once skipped, they cannot be marked later
   - Players are never forced to mark a number

4. **Locking a Row**:
   - A row can only be locked if at least 5 numbers have been marked in that row
   - To lock a row, the rightmost number (2 or 12) must be available to mark
   - When locked, mark the lock symbol and no player can mark that row anymore
   - The colored die of that row is removed from play

5. **Penalty Marks**:
   - If the active player cannot or chooses not to mark any numbers, they must take a penalty mark
   - Each penalty mark is worth -5 points at the end of the game
   - A player can have a maximum of 4 penalty marks

6. **Game End**:
   The game ends immediately when:
   - A player takes their 4th penalty mark, OR
   - Two rows have been locked

#### Scoring

Each row is scored based on the number of marks:
- 1 mark: 1 point
- 2 marks: 3 points
- 3 marks: 6 points
- 4 marks: 10 points
- 5 marks: 15 points
- 6 marks: 21 points
- 7 marks: 28 points
- 8 marks: 36 points
- 9 marks: 45 points
- 10 marks: 55 points
- 11 marks: 66 points
- 12 marks (all numbers + lock): 78 points

Penalty marks: -5 points each

The player with the highest total score wins!

## Project Overview

This project aims to create a digital version of Qwixx that allows 2-5 players to play on a single device. Players will pass the device between turns, simulating the physical board game experience.

### Target Platform

- Mobile-first web application
- Single-device multiplayer (pass-and-play)
- No network/online multiplayer support

### Key Features

- Digital dice rolling with animations
- Interactive score sheets for each player
- Automatic score calculation
- Turn management system
- Game state persistence
- Undo functionality for accidental marks
- Game history and statistics

### Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint 9

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jwmickey/qwixx.git
cd qwixx
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint to check code quality
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI

## Contributing

This is a personal hobby project. If you'd like to contribute or have suggestions, please open an issue first to discuss your ideas.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

Qwixx is a registered trademark of Gamewright. This is a fan-made digital recreation for educational and entertainment purposes.
