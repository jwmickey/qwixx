# Copilot Instructions for Qwixx

## Project Overview

Qwixx is a digital recreation of the popular dice game for 2-5 players. This is a mobile-first, single-device multiplayer (pass-and-play) web application with no network/online multiplayer support.

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Testing**: Vitest with React Testing Library
- **Linting**: ESLint 9
- **Code Formatting**: Prettier 3

## Development Environment

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Available Commands
- `npm run dev` - Start the development server (runs on http://localhost:5173/)
- `npm run build` - Build the project for production (runs TypeScript compiler + Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm test` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI
- `npm run preview` - Preview the production build

## Project Structure

```
qwixx/
├── .github/              # GitHub configuration
├── docs/                 # Documentation
│   └── ARCHITECTURE.md   # Architecture decisions and patterns
├── public/               # Static assets
├── src/                  # Source code
│   ├── test/            # Test setup files
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── README.md            # Project documentation and game rules
├── ROADMAP.md           # Development roadmap and feature tracking
└── LICENSE              # MIT License
```

## Architecture and Design Patterns

### State Management
- Use **React Context API** with **useReducer** for global state management
- Keep state management simple and native to React
- Use Local Storage for game state persistence

### Component Structure (Planned)
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

### Mobile-First Design
- Design for mobile-first, optimized for portrait orientation
- Minimum supported viewport: 320px
- Use Tailwind CSS responsive utilities
- Touch-friendly interactions

## Code Style and Conventions

### TypeScript
- Use strict TypeScript configuration
- Always define types for props, state, and function parameters
- Prefer interfaces for object shapes
- Use type inference where appropriate

### React
- Use functional components with hooks
- Follow React 19 best practices
- Use React Testing Library for component tests
- Keep components small and focused on a single responsibility

### File Naming
- React components: PascalCase (e.g., `ScoreSheet.tsx`)
- Utilities and helpers: camelCase (e.g., `gameUtils.ts`)
- Test files: Same name as the file being tested with `.test.ts` or `.test.tsx` suffix

### Code Formatting
- Use Prettier for consistent code formatting
- Run `npm run format` before committing
- Follow existing formatting conventions in the codebase

## Testing Guidelines

### Test Framework
- Use Vitest as the test runner
- Use React Testing Library for component testing
- Test setup is in `src/test/setup.ts`

### Testing Principles
- Write tests for critical game logic (scoring, validation, turn management)
- Test component behavior, not implementation details
- Use descriptive test names that explain what is being tested
- Aim for good test coverage of core game functionality

### Running Tests
```bash
npm test              # Run tests in watch mode
npm test -- --run     # Run tests once
npm run test:ui       # Open Vitest UI
```

## Game-Specific Context

### Game Rules Summary
- **Players**: 2-5 players on a single device (pass-and-play)
- **Rows**: 4 colored rows (Red/Yellow: 2-12 ascending, Green/Blue: 12-2 descending)
- **Marking**: Numbers must be marked left-to-right, skipped numbers cannot be marked later
- **Locking**: Rows can be locked after 5+ marks, removes that colored die from play
- **Penalties**: -5 points each, max 4 penalties (ends game)
- **Game End**: Ends when 2 rows are locked OR a player gets 4 penalties

### Key Features to Implement
1. Digital dice rolling with animations
2. Interactive score sheets for each player
3. Automatic score calculation
4. Turn management system
5. Game state persistence
6. Undo functionality for accidental marks
7. Game history and statistics

## Development Guidelines

### Before Starting Work
1. Review the ROADMAP.md to understand current development phase
2. Check docs/ARCHITECTURE.md for architecture decisions
3. Run `npm install` to ensure all dependencies are installed
4. Run `npm run lint` and `npm run build` to verify the codebase

### When Adding Features
1. Reference the relevant roadmap item
2. Write tests for new functionality
3. Follow the existing code structure and patterns
4. Update documentation if adding significant features
5. Ensure code passes linting and formatting checks

### Code Quality Checklist
- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Tests are written for new functionality
- [ ] Code is formatted with Prettier
- [ ] ESLint passes without errors
- [ ] Build succeeds without errors
- [ ] Mobile-responsive design is considered

## Common Patterns

### Component Props
```typescript
interface ComponentProps {
  // Define all props with clear types
  value: number
  onChange: (value: number) => void
  isDisabled?: boolean  // Optional props should use ?
}
```

### State Management
```typescript
// Use useReducer for complex state
const [state, dispatch] = useReducer(gameReducer, initialState)

// Use useState for simple local state
const [count, setCount] = useState(0)
```

### Styling with Tailwind
- Use Tailwind utility classes
- Follow mobile-first approach (base styles for mobile, then use sm:, md:, lg: breakpoints)
- Keep custom CSS minimal, prefer Tailwind utilities

## Resources

- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

## Contributing

This is a personal hobby project. When contributing:
1. Open an issue first to discuss your ideas
2. Reference the ROADMAP.md for planned features
3. Follow the code style and testing guidelines
4. Update the roadmap when completing features

## License

MIT License - See LICENSE file for details

## Disclaimer

Qwixx is a registered trademark of Gamewright. This is a fan-made digital recreation for educational and entertainment purposes.
