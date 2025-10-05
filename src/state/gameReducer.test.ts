import { describe, it, expect } from 'vitest'
import { gameReducer, initialGameState } from './gameReducer'

describe('gameReducer', () => {
  describe('INITIALIZE_GAME', () => {
    it('should initialize game with valid player names', () => {
      const state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      
      expect(state.players).toHaveLength(2)
      expect(state.players[0].name).toBe('Alice')
      expect(state.players[1].name).toBe('Bob')
      expect(state.gameStatus).toBe('setup')
      expect(state.currentPlayerIndex).toBe(0)
    })
    
    it('should not initialize with less than 2 players', () => {
      const state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice'] },
      })
      
      expect(state.players).toHaveLength(0)
    })
    
    it('should not initialize with more than 5 players', () => {
      const state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['A', 'B', 'C', 'D', 'E', 'F'] },
      })
      
      expect(state.players).toHaveLength(0)
    })
    
    it('should not initialize with empty player names', () => {
      const state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', ''] },
      })
      
      expect(state.players).toHaveLength(0)
    })
    
    it('should trim player names', () => {
      const state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['  Alice  ', '  Bob  '] },
      })
      
      expect(state.players[0].name).toBe('Alice')
      expect(state.players[1].name).toBe('Bob')
    })
  })
  
  describe('START_GAME', () => {
    it('should start game when players are initialized', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      
      state = gameReducer(state, { type: 'START_GAME' })
      
      expect(state.gameStatus).toBe('playing')
    })
    
    it('should not start game without players', () => {
      const state = gameReducer(initialGameState, { type: 'START_GAME' })
      
      expect(state.gameStatus).toBe('setup')
    })
  })
  
  describe('NEXT_TURN', () => {
    it('should move to next player', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob', 'Charlie'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      expect(state.currentPlayerIndex).toBe(0)
      
      state = gameReducer(state, { type: 'NEXT_TURN' })
      expect(state.currentPlayerIndex).toBe(1)
      
      state = gameReducer(state, { type: 'NEXT_TURN' })
      expect(state.currentPlayerIndex).toBe(2)
    })
    
    it('should wrap around to first player', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      state = gameReducer(state, { type: 'NEXT_TURN' })
      expect(state.currentPlayerIndex).toBe(1)
      
      state = gameReducer(state, { type: 'NEXT_TURN' })
      expect(state.currentPlayerIndex).toBe(0)
    })
    
    it('should clear dice state on next turn', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      state = gameReducer(state, {
        type: 'ROLL_DICE',
        payload: { white1: 3, white2: 4, red: 5, yellow: 2, green: 6, blue: 1 },
      })
      
      expect(state.dice).not.toBeNull()
      
      state = gameReducer(state, { type: 'NEXT_TURN' })
      expect(state.dice).toBeNull()
    })
    
    it('should not advance turn if game is not playing', () => {
      const state = gameReducer(initialGameState, { type: 'NEXT_TURN' })
      expect(state.currentPlayerIndex).toBe(0)
    })
  })
  
  describe('ROLL_DICE', () => {
    it('should set dice state', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const diceState = { white1: 3, white2: 4, red: 5, yellow: 2, green: 6, blue: 1 }
      state = gameReducer(state, { type: 'ROLL_DICE', payload: diceState })
      
      expect(state.dice).toEqual(diceState)
    })
    
    it('should not set dice if game is not playing', () => {
      const diceState = { white1: 3, white2: 4, red: 5, yellow: 2, green: 6, blue: 1 }
      const state = gameReducer(initialGameState, { type: 'ROLL_DICE', payload: diceState })
      
      expect(state.dice).toBeNull()
    })
  })
  
  describe('MARK_NUMBER', () => {
    it('should mark a valid number', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId, color: 'red', number: 5 },
      })
      
      const markedNumber = state.players[0].scoreSheet.red.numbers.find(n => n.number === 5)
      expect(markedNumber?.marked).toBe(true)
    })
    
    it('should update total score after marking', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId, color: 'red', number: 5 },
      })
      
      expect(state.players[0].totalScore).toBe(1)
    })
    
    it('should not mark on a locked row', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      state = gameReducer(state, { type: 'LOCK_ROW', payload: { color: 'red' } })
      
      const playerId = state.players[0].id
      const stateBefore = state
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId, color: 'red', number: 5 },
      })
      
      expect(state).toEqual(stateBefore)
    })
    
    it('should lock row when marking last number with 5+ marks', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      
      // Mark 5 numbers
      for (let i = 2; i <= 6; i++) {
        state = gameReducer(state, {
          type: 'MARK_NUMBER',
          payload: { playerId, color: 'red', number: i },
        })
      }
      
      // Mark last number (12) which should lock the row
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId, color: 'red', number: 12 },
      })
      
      expect(state.players[0].scoreSheet.red.locked).toBe(true)
      expect(state.lockedRows).toContain('red')
    })
    
    it('should end game when 2 rows are locked', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      
      // Lock first row (red)
      for (let i = 2; i <= 6; i++) {
        state = gameReducer(state, {
          type: 'MARK_NUMBER',
          payload: { playerId, color: 'red', number: i },
        })
      }
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId, color: 'red', number: 12 },
      })
      
      expect(state.gameStatus).toBe('playing')
      
      // Lock second row (yellow)
      for (let i = 2; i <= 6; i++) {
        state = gameReducer(state, {
          type: 'MARK_NUMBER',
          payload: { playerId, color: 'yellow', number: i },
        })
      }
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId, color: 'yellow', number: 12 },
      })
      
      // Game should still be playing until turn transition
      expect(state.gameStatus).toBe('playing')
      expect(state.lockedRows).toHaveLength(2)
      
      // Game ends when turn is advanced
      state = gameReducer(state, { type: 'NEXT_TURN' })
      expect(state.gameStatus).toBe('ended')
    })
  })
  
  describe('LOCK_ROW', () => {
    it('should lock a row', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      state = gameReducer(state, { type: 'LOCK_ROW', payload: { color: 'red' } })
      
      expect(state.lockedRows).toContain('red')
    })
    
    it('should not lock already locked row', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      state = gameReducer(state, { type: 'LOCK_ROW', payload: { color: 'red' } })
      
      state = gameReducer(state, { type: 'LOCK_ROW', payload: { color: 'red' } })
      
      expect(state.lockedRows).toEqual(['red'])
    })
    
    it('should end game when 2 rows are locked', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      state = gameReducer(state, { type: 'LOCK_ROW', payload: { color: 'red' } })
      expect(state.gameStatus).toBe('playing')
      
      state = gameReducer(state, { type: 'LOCK_ROW', payload: { color: 'yellow' } })
      // Game should still be playing until turn transition
      expect(state.gameStatus).toBe('playing')
      expect(state.lockedRows).toHaveLength(2)
      
      // Game ends when turn is advanced
      state = gameReducer(state, { type: 'NEXT_TURN' })
      expect(state.gameStatus).toBe('ended')
    })
  })
  
  describe('ADD_PENALTY', () => {
    it('should add penalty to player', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      state = gameReducer(state, { type: 'ADD_PENALTY', payload: { playerId } })
      
      expect(state.players[0].penalties).toBe(1)
    })
    
    it('should update total score after penalty', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      state = gameReducer(state, { type: 'ADD_PENALTY', payload: { playerId } })
      
      expect(state.players[0].totalScore).toBe(-5)
    })
    
    it('should cap penalties at 4', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      
      for (let i = 0; i < 10; i++) {
        state = gameReducer(state, { type: 'ADD_PENALTY', payload: { playerId } })
      }
      
      expect(state.players[0].penalties).toBe(4)
    })
    
    it('should end game when player reaches 4 penalties', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      
      for (let i = 0; i < 3; i++) {
        state = gameReducer(state, { type: 'ADD_PENALTY', payload: { playerId } })
        expect(state.gameStatus).toBe('playing')
      }
      
      state = gameReducer(state, { type: 'ADD_PENALTY', payload: { playerId } })
      // Game should still be playing until turn transition
      expect(state.gameStatus).toBe('playing')
      expect(state.players[0].penalties).toBe(4)
      
      // Game ends when turn is advanced
      state = gameReducer(state, { type: 'NEXT_TURN' })
      expect(state.gameStatus).toBe('ended')
    })
  })
  
  describe('END_GAME', () => {
    it('should end the game', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      state = gameReducer(state, { type: 'END_GAME' })
      
      expect(state.gameStatus).toBe('ended')
    })
  })
  
  describe('RESET_GAME', () => {
    it('should reset game to initial state', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      state = gameReducer(state, { type: 'RESET_GAME' })
      
      expect(state.players).toHaveLength(0)
      expect(state.gameStatus).toBe('setup')
      expect(state.currentPlayerIndex).toBe(0)
      expect(state.dice).toBeNull()
      expect(state.lockedRows).toHaveLength(0)
    })
  })
  
  describe('history tracking', () => {
    it('should track all actions in history', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      
      expect(state.history).toHaveLength(1)
      expect(state.history[0].type).toBe('INITIALIZE_GAME')
      
      state = gameReducer(state, { type: 'START_GAME' })
      expect(state.history).toHaveLength(2)
      expect(state.history[1].type).toBe('START_GAME')
    })
  })

  describe('UNMARK_NUMBER', () => {
    it('should unmark a marked number', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId, color: 'red', number: 5 },
      })
      
      expect(state.players[0].scoreSheet.red.numbers[3].marked).toBe(true)
      
      // Unmark the number
      state = gameReducer(state, {
        type: 'UNMARK_NUMBER',
        payload: { playerId, color: 'red', number: 5 },
      })
      
      expect(state.players[0].scoreSheet.red.numbers[3].marked).toBe(false)
    })

    it('should not unmark a number that is not marked', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      const beforeUnmark = state
      
      // Try to unmark a number that was never marked
      state = gameReducer(state, {
        type: 'UNMARK_NUMBER',
        payload: { playerId, color: 'red', number: 5 },
      })
      
      // State should remain unchanged (except for history)
      expect(state.players).toEqual(beforeUnmark.players)
    })

    it('should update total score after unmarking', () => {
      let state = gameReducer(initialGameState, {
        type: 'INITIALIZE_GAME',
        payload: { playerNames: ['Alice', 'Bob'] },
      })
      state = gameReducer(state, { type: 'START_GAME' })
      
      const playerId = state.players[0].id
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId, color: 'red', number: 5 },
      })
      
      expect(state.players[0].totalScore).toBe(1)
      
      // Unmark the number
      state = gameReducer(state, {
        type: 'UNMARK_NUMBER',
        payload: { playerId, color: 'red', number: 5 },
      })
      
      expect(state.players[0].totalScore).toBe(0)
    })
  })
})
