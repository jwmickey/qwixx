/**
 * Helper functions for dice rolling and combinations
 */

import type { DiceState, RowColor } from '../types/game'

/**
 * Roll a single die (1-6)
 */
export function rollDie(): number {
  return Math.ceil(Math.random() * 6)
}

/**
 * Roll all six dice and return their values
 */
export function rollAllDice(): DiceState {
  return {
    white1: rollDie(),
    white2: rollDie(),
    red: rollDie(),
    yellow: rollDie(),
    green: rollDie(),
    blue: rollDie(),
  }
}

/**
 * Calculate the sum of the two white dice
 * This combination is available to all players
 */
export function getWhiteDiceSum(dice: DiceState): number {
  return dice.white1 + dice.white2
}

/**
 * Calculate possible combinations for the active player
 * Active player can use:
 * - Sum of white dice (available to all players)
 * - Sum of white die 1 + any colored die
 * - Sum of white die 2 + any colored die
 * 
 * Returns array of { color, sum } objects for each colored combination
 * Plus one entry for white dice sum with null color
 */
export function getActivePlayerCombinations(
  dice: DiceState,
  lockedRows: RowColor[]
): Array<{ color: RowColor | null; sum: number }> {
  const combinations: Array<{ color: RowColor | null; sum: number }> = []
  
  // White dice sum is always available (for all players)
  combinations.push({ color: null, sum: getWhiteDiceSum(dice) })
  
  // Colored die combinations (only for active player)
  const colors: RowColor[] = ['red', 'yellow', 'green', 'blue']
  
  for (const color of colors) {
    // Skip if row is locked (die removed from play)
    if (lockedRows.includes(color)) {
      continue
    }
    
    // Add white1 + colored die
    combinations.push({ color, sum: dice.white1 + dice[color] })
    
    // Add white2 + colored die (only if different from white1 combination)
    const white2Sum = dice.white2 + dice[color]
    if (white2Sum !== dice.white1 + dice[color]) {
      combinations.push({ color, sum: white2Sum })
    }
  }
  
  return combinations
}

/**
 * Calculate possible combinations for non-active players
 * Non-active players can only use the sum of the two white dice
 */
export function getOtherPlayerCombinations(dice: DiceState): Array<{ color: null; sum: number }> {
  return [{ color: null, sum: getWhiteDiceSum(dice) }]
}

/**
 * Get all possible sums from dice (for validation or display)
 * Returns unique sums that can be achieved
 */
export function getPossibleSums(dice: DiceState, lockedRows: RowColor[]): number[] {
  const combinations = getActivePlayerCombinations(dice, lockedRows)
  const sums = combinations.map(c => c.sum)
  return [...new Set(sums)].sort((a, b) => a - b)
}
