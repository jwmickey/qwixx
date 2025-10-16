/**
 * Helper functions for colored dice validation
 */

import type { DiceState, RowColor } from '../types/game'

/**
 * Get valid numbers for a specific color row during colored dice phase
 * Returns the sums of the colored die + each white die
 * @param dice Current dice state
 * @param color The color row to get valid numbers for
 * @param lockedRows List of locked rows
 * @returns Set of valid numbers for the specified color
 */
export function getValidNumbersForColor(
  dice: DiceState,
  color: RowColor,
  lockedRows: RowColor[]
): Set<number> {
  // If this color is locked, no valid numbers
  if (lockedRows.includes(color)) {
    return new Set()
  }
  
  const validNumbers = new Set<number>()
  
  // Add white1 + colored die
  validNumbers.add(dice.white1 + dice[color])
  
  // Add white2 + colored die
  validNumbers.add(dice.white2 + dice[color])
  
  return validNumbers
}
