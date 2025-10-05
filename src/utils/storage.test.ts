/**
 * Tests for storage utilities
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveGameState,
  loadGameState,
  clearGameState,
  hasSavedGame,
  getAutoSaveEnabled,
  setAutoSaveEnabled,
} from './storage'
import { initialGameState } from '../state/gameReducer'
import type { GameState } from '../types/game'

describe('Storage Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  describe('saveGameState and loadGameState', () => {
    it('should save and load game state', () => {
      const testState: GameState = {
        ...initialGameState,
        players: [
          {
            id: 'player-1',
            name: 'Alice',
            scoreSheet: {
              red: { color: 'red', numbers: [], locked: false },
              yellow: { color: 'yellow', numbers: [], locked: false },
              green: { color: 'green', numbers: [], locked: false },
              blue: { color: 'blue', numbers: [], locked: false },
            },
            penalties: 0,
            totalScore: 0,
          },
        ],
        gameStatus: 'playing',
      }

      const saved = saveGameState(testState)
      expect(saved).toBe(true)

      const loaded = loadGameState()
      expect(loaded).not.toBeNull()
      expect(loaded?.gameStatus).toBe('playing')
      expect(loaded?.players).toHaveLength(1)
      expect(loaded?.players[0].name).toBe('Alice')
    })

    it('should return null when no saved game exists', () => {
      const loaded = loadGameState()
      expect(loaded).toBeNull()
    })
  })

  describe('clearGameState', () => {
    it('should clear saved game state', () => {
      saveGameState(initialGameState)
      expect(hasSavedGame()).toBe(true)

      clearGameState()
      expect(hasSavedGame()).toBe(false)
      expect(loadGameState()).toBeNull()
    })
  })

  describe('hasSavedGame', () => {
    it('should return false when no game is saved', () => {
      expect(hasSavedGame()).toBe(false)
    })

    it('should return true when game is saved', () => {
      saveGameState(initialGameState)
      expect(hasSavedGame()).toBe(true)
    })
  })

  describe('getAutoSaveEnabled and setAutoSaveEnabled', () => {
    it('should default to false', () => {
      expect(getAutoSaveEnabled()).toBe(false)
    })

    it('should save and retrieve auto-save preference', () => {
      setAutoSaveEnabled(true)
      expect(getAutoSaveEnabled()).toBe(true)

      setAutoSaveEnabled(false)
      expect(getAutoSaveEnabled()).toBe(false)
    })
  })
})
