/**
 * Core game type definitions for Qwixx
 */

export type GameStatus = 'setup' | 'playing' | 'ended'

export type RowColor = 'red' | 'yellow' | 'green' | 'blue'

export type DiceColor = 'white' | RowColor

/**
 * Represents a single die with its color and value
 */
export interface Die {
  color: DiceColor
  value: number
}

/**
 * Represents the current state of all dice
 */
export interface DiceState {
  white1: number
  white2: number
  red: number
  yellow: number
  green: number
  blue: number
}

/**
 * Represents a marked number in a row
 */
export interface MarkedNumber {
  number: number
  marked: boolean
}

/**
 * Represents a single colored row on the score sheet
 */
export interface ColorRow {
  color: RowColor
  numbers: MarkedNumber[]
  locked: boolean
}

/**
 * Represents a player's score sheet with all four rows
 */
export interface ScoreSheet {
  red: ColorRow
  yellow: ColorRow
  green: ColorRow
  blue: ColorRow
}

/**
 * Represents a single player in the game
 */
export interface Player {
  id: string
  name: string
  scoreSheet: ScoreSheet
  penalties: number
  totalScore: number
}

/**
 * Action types for game state updates
 */
export type GameAction =
  | { type: 'INITIALIZE_GAME'; payload: { playerNames: string[]; playerIds?: string[] } }
  | { type: 'START_GAME' }
  | { type: 'NEXT_TURN' }
  | { type: 'ROLL_DICE'; payload: DiceState }
  | { type: 'MARK_NUMBER'; payload: { playerId: string; color: RowColor; number: number; allowLockedRow?: boolean } }
  | { type: 'UNMARK_NUMBER'; payload: { playerId: string; color: RowColor; number: number } }
  | { type: 'LOCK_ROW'; payload: { color: RowColor } }
  | { type: 'ADD_PENALTY'; payload: { playerId: string } }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }

/**
 * Represents the complete game state
 */
export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  dice: DiceState | null
  lockedRows: RowColor[]
  gameStatus: GameStatus
  history: GameAction[]
}
