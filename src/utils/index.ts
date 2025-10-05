/**
 * Export utility functions
 */

export {
  generatePlayerId,
  createRowNumbers,
  createColorRow,
  createScoreSheet,
  calculateRowScore,
  calculateTotalScore,
  createPlayer,
  canMarkNumber,
  canLockRow,
  shouldGameEnd,
  determineWinner,
} from './gameHelpers'

export {
  validatePlayerCount,
  validatePlayerNames,
  validateGameState,
} from './validation'

export {
  rollDie,
  rollAllDice,
  getWhiteDiceSum,
  getActivePlayerCombinations,
  getOtherPlayerCombinations,
  getPossibleSums,
} from './diceHelpers'

export {
  saveGameState,
  loadGameState,
  clearGameState,
  hasSavedGame,
  getAutoSaveEnabled,
  setAutoSaveEnabled,
} from './storage'
