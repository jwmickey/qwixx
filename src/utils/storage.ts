/**
 * Local storage utilities for game state persistence
 */

import type { GameState } from '../types/game'

const STORAGE_KEY = 'qwixx-game-state'
const AUTO_SAVE_KEY = 'qwixx-auto-save-enabled'

/**
 * Save game state to local storage
 */
export function saveGameState(state: GameState): boolean {
  try {
    const serialized = JSON.stringify(state)
    localStorage.setItem(STORAGE_KEY, serialized)
    return true
  } catch (error) {
    console.error('Failed to save game state:', error)
    return false
  }
}

/**
 * Load game state from local storage
 */
export function loadGameState(): GameState | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) {
      return null
    }
    return JSON.parse(serialized) as GameState
  } catch (error) {
    console.error('Failed to load game state:', error)
    return null
  }
}

/**
 * Clear saved game state from local storage
 */
export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear game state:', error)
  }
}

/**
 * Check if there is a saved game state
 */
export function hasSavedGame(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null
  } catch {
    return false
  }
}

/**
 * Get auto-save preference
 */
export function getAutoSaveEnabled(): boolean {
  try {
    const value = localStorage.getItem(AUTO_SAVE_KEY)
    return value === 'true'
  } catch {
    return false
  }
}

/**
 * Set auto-save preference
 */
export function setAutoSaveEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(AUTO_SAVE_KEY, enabled ? 'true' : 'false')
  } catch (error) {
    console.error('Failed to set auto-save preference:', error)
  }
}
