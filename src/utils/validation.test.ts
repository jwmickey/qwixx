import { describe, it, expect } from 'vitest'
import { validatePlayerCount, validatePlayerNames, validateGameState } from './validation'
import { createPlayer } from './gameHelpers'
import type { GameState } from '../types/game'

describe('validation', () => {
  describe('validatePlayerCount', () => {
    it('should return false for count less than 2', () => {
      expect(validatePlayerCount(0)).toBe(false)
      expect(validatePlayerCount(1)).toBe(false)
    })
    
    it('should return true for count between 2 and 5', () => {
      expect(validatePlayerCount(2)).toBe(true)
      expect(validatePlayerCount(3)).toBe(true)
      expect(validatePlayerCount(4)).toBe(true)
      expect(validatePlayerCount(5)).toBe(true)
    })
    
    it('should return false for count greater than 5', () => {
      expect(validatePlayerCount(6)).toBe(false)
      expect(validatePlayerCount(10)).toBe(false)
    })
  })
  
  describe('validatePlayerNames', () => {
    it('should return true for valid names', () => {
      expect(validatePlayerNames(['Alice', 'Bob'])).toBe(true)
      expect(validatePlayerNames(['John', 'Jane', 'Jack'])).toBe(true)
    })
    
    it('should return false for empty names', () => {
      expect(validatePlayerNames(['Alice', ''])).toBe(false)
      expect(validatePlayerNames(['', 'Bob'])).toBe(false)
    })
    
    it('should return false for whitespace-only names', () => {
      expect(validatePlayerNames(['Alice', '   '])).toBe(false)
      expect(validatePlayerNames(['\t', 'Bob'])).toBe(false)
    })
    
    it('should return true for names with whitespace that are not empty', () => {
      expect(validatePlayerNames(['Alice Smith', 'Bob Jones'])).toBe(true)
    })
  })
  
  describe('validateGameState', () => {
    const createValidGameState = (): GameState => ({
      players: [createPlayer('Alice'), createPlayer('Bob')],
      currentPlayerIndex: 0,
      dice: null,
      lockedRows: [],
      gameStatus: 'playing',
      history: [],
    })
    
    it('should validate a valid game state', () => {
      const state = createValidGameState()
      const result = validateGameState(state)
      
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
    
    it('should detect insufficient players in non-setup state', () => {
      const state = createValidGameState()
      state.players = [createPlayer('Alice')]
      
      const result = validateGameState(state)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Game must have at least 2 players')
    })
    
    it('should detect too many players', () => {
      const state = createValidGameState()
      state.players = [
        createPlayer('A'),
        createPlayer('B'),
        createPlayer('C'),
        createPlayer('D'),
        createPlayer('E'),
        createPlayer('F'),
      ]
      
      const result = validateGameState(state)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Game cannot have more than 5 players')
    })
    
    it('should detect invalid current player index', () => {
      const state = createValidGameState()
      state.currentPlayerIndex = 5
      
      const result = validateGameState(state)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Current player index is out of bounds')
    })
    
    it('should detect too many locked rows', () => {
      const state = createValidGameState()
      state.lockedRows = ['red', 'yellow', 'green', 'blue', 'red']
      
      const result = validateGameState(state)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Cannot have more than 4 locked rows')
    })
    
    it('should detect invalid penalty count', () => {
      const state = createValidGameState()
      state.players[0].penalties = 5
      
      const result = validateGameState(state)
      
      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('invalid penalty count'))).toBe(true)
    })
    
    it('should detect ended game without win condition', () => {
      const state = createValidGameState()
      state.gameStatus = 'ended'
      
      const result = validateGameState(state)
      
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Game is marked as ended but win condition is not met')
    })
    
    it('should validate ended game with 2 locked rows', () => {
      const state = createValidGameState()
      state.gameStatus = 'ended'
      state.lockedRows = ['red', 'yellow']
      
      const result = validateGameState(state)
      
      expect(result.valid).toBe(true)
    })
    
    it('should validate ended game with player at 4 penalties', () => {
      const state = createValidGameState()
      state.gameStatus = 'ended'
      state.players[0].penalties = 4
      
      const result = validateGameState(state)
      
      expect(result.valid).toBe(true)
    })
  })
})
