/**
 * Validation utilities for game state
 */

import type { GameState } from '../types/game'

/**
 * Validate player count is within allowed range (2-5)
 */
export function validatePlayerCount(count: number): boolean {
  return count >= 2 && count <= 5
}

/**
 * Validate player names are not empty
 */
export function validatePlayerNames(names: string[]): boolean {
  return names.every(name => name.trim().length > 0)
}

/**
 * Validate complete game state
 */
export function validateGameState(state: GameState): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  // Validate players
  if (state.gameStatus !== 'setup' && state.players.length < 2) {
    errors.push('Game must have at least 2 players')
  }
  
  if (state.players.length > 5) {
    errors.push('Game cannot have more than 5 players')
  }
  
  // Validate player names
  if (!validatePlayerNames(state.players.map(p => p.name))) {
    errors.push('All player names must be non-empty')
  }
  
  // Validate current player index
  if (state.players.length > 0 && state.currentPlayerIndex >= state.players.length) {
    errors.push('Current player index is out of bounds')
  }
  
  // Validate locked rows count
  if (state.lockedRows.length > 4) {
    errors.push('Cannot have more than 4 locked rows')
  }
  
  // Validate penalties
  for (const player of state.players) {
    if (player.penalties < 0 || player.penalties > 4) {
      errors.push(`Player ${player.name} has invalid penalty count`)
    }
  }
  
  // Validate game status consistency
  if (state.gameStatus === 'ended') {
    const hasWinCondition = 
      state.lockedRows.length >= 2 || 
      state.players.some(p => p.penalties >= 4)
    
    if (!hasWinCondition) {
      errors.push('Game is marked as ended but win condition is not met')
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
