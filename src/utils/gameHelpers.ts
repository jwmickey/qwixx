/**
 * Helper functions for game logic
 */

import type { Player, ScoreSheet, ColorRow, RowColor, MarkedNumber } from '../types/game'

/**
 * Generate a unique player ID
 */
export function generatePlayerId(): string {
  return `player-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Create the numbers array for a colored row
 * Red/Yellow: 2-12 ascending
 * Green/Blue: 12-2 descending
 */
export function createRowNumbers(color: RowColor): MarkedNumber[] {
  const numbers: MarkedNumber[] = []
  
  if (color === 'red' || color === 'yellow') {
    // Ascending: 2 to 12
    for (let i = 2; i <= 12; i++) {
      numbers.push({ number: i, marked: false })
    }
  } else {
    // Descending: 12 to 2
    for (let i = 12; i >= 2; i--) {
      numbers.push({ number: i, marked: false })
    }
  }
  
  return numbers
}

/**
 * Create a new colored row with initial state
 */
export function createColorRow(color: RowColor): ColorRow {
  return {
    color,
    numbers: createRowNumbers(color),
    locked: false,
  }
}

/**
 * Create a new score sheet with all four rows
 */
export function createScoreSheet(): ScoreSheet {
  return {
    red: createColorRow('red'),
    yellow: createColorRow('yellow'),
    green: createColorRow('green'),
    blue: createColorRow('blue'),
  }
}

/**
 * Calculate score for a single row based on number of marks
 * 1 mark: 1 point, 2 marks: 3 points, etc.
 * Formula: n * (n + 1) / 2
 */
export function calculateRowScore(row: ColorRow): number {
  const markedCount = row.numbers.filter(n => n.marked).length
  return (markedCount * (markedCount + 1)) / 2
}

/**
 * Calculate total score for a player
 */
export function calculateTotalScore(player: Player): number {
  const rowScores = 
    calculateRowScore(player.scoreSheet.red) +
    calculateRowScore(player.scoreSheet.yellow) +
    calculateRowScore(player.scoreSheet.green) +
    calculateRowScore(player.scoreSheet.blue)
  
  const penaltyScore = player.penalties * -5
  
  return rowScores + penaltyScore
}

/**
 * Create a new player with initialized score sheet
 */
export function createPlayer(name: string): Player {
  return {
    id: generatePlayerId(),
    name,
    scoreSheet: createScoreSheet(),
    penalties: 0,
    totalScore: 0,
  }
}

/**
 * Validate if a number can be marked in a row
 * Numbers must be marked left-to-right, skipped numbers cannot be marked later
 */
export function canMarkNumber(row: ColorRow, number: number): boolean {
  if (row.locked) {
    return false
  }
  
  const numberIndex = row.numbers.findIndex(n => n.number === number)
  
  if (numberIndex === -1) {
    return false
  }
  
  // If already marked, cannot mark again
  if (row.numbers[numberIndex].marked) {
    return false
  }
  
  // Find the rightmost marked number
  let rightmostMarkedIndex = -1
  for (let i = row.numbers.length - 1; i >= 0; i--) {
    if (row.numbers[i].marked) {
      rightmostMarkedIndex = i
      break
    }
  }
  
  // If no numbers are marked yet, any number can be marked
  if (rightmostMarkedIndex === -1) {
    return true
  }
  
  // Can only mark numbers to the right of the rightmost marked number
  return numberIndex > rightmostMarkedIndex
}

/**
 * Validate if a row can be locked
 * A row can only be locked if at least 5 numbers are marked
 * and the last number (2 or 12) is being marked
 */
export function canLockRow(row: ColorRow, number: number): boolean {
  const markedCount = row.numbers.filter(n => n.marked).length
  const lastNumber = row.numbers[row.numbers.length - 1].number
  
  // Need at least 5 marks to lock
  if (markedCount < 5) {
    return false
  }
  
  // Can only lock by marking the last number
  return number === lastNumber
}

/**
 * Check if game should end
 * Game ends when 2 rows are locked OR a player has 4 penalties
 */
export function shouldGameEnd(lockedRowsCount: number, players: Player[]): boolean {
  // Check if 2 rows are locked
  if (lockedRowsCount >= 2) {
    return true
  }
  
  // Check if any player has 4 penalties
  return players.some(player => player.penalties >= 4)
}

/**
 * Determine the winner(s) of the game
 * Returns array of winning player(s) sorted by score (highest first)
 * Can return multiple players if there's a tie
 */
export function determineWinner(players: Player[]): Player[] {
  if (players.length === 0) {
    return []
  }
  
  // Find the highest score
  const highestScore = Math.max(...players.map(p => p.totalScore))
  
  // Return all players with the highest score (handles ties)
  return players
    .filter(p => p.totalScore === highestScore)
    .sort((a, b) => b.totalScore - a.totalScore)
}
