import { describe, it, expect } from 'vitest'
import { gameReducer, initialGameState } from './gameReducer'

/**
 * Integration tests for complete game flow
 */
describe('Game State Integration', () => {
  it('should handle a complete game flow from start to finish', () => {
    // Initialize game
    let state = gameReducer(initialGameState, {
      type: 'INITIALIZE_GAME',
      payload: { playerNames: ['Alice', 'Bob'] }
    })
    
    expect(state.players).toHaveLength(2)
    expect(state.gameStatus).toBe('setup')
    
    // Start game
    state = gameReducer(state, { type: 'START_GAME' })
    expect(state.gameStatus).toBe('playing')
    expect(state.currentPlayerIndex).toBe(0)
    
    // First turn - Alice's turn
    const aliceId = state.players[0].id
    
    // Roll dice
    state = gameReducer(state, {
      type: 'ROLL_DICE',
      payload: { white1: 3, white2: 4, red: 5, yellow: 2, green: 6, blue: 1 }
    })
    expect(state.dice).not.toBeNull()
    
    // Alice marks a number
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'red', number: 7 }
    })
    expect(state.players[0].scoreSheet.red.numbers[5].marked).toBe(true)
    expect(state.players[0].totalScore).toBe(1)
    
    // Next turn - Bob's turn
    state = gameReducer(state, { type: 'NEXT_TURN' })
    expect(state.currentPlayerIndex).toBe(1)
    expect(state.dice).toBeNull() // Dice cleared
    
    const bobId = state.players[1].id
    
    // Bob's turn
    state = gameReducer(state, {
      type: 'ROLL_DICE',
      payload: { white1: 2, white2: 3, red: 4, yellow: 5, green: 1, blue: 6 }
    })
    
    // Bob marks a number
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: bobId, color: 'yellow', number: 5 }
    })
    expect(state.players[1].totalScore).toBe(1)
    
    // Back to Alice
    state = gameReducer(state, { type: 'NEXT_TURN' })
    expect(state.currentPlayerIndex).toBe(0)
    
    // Alice takes a penalty
    state = gameReducer(state, {
      type: 'ADD_PENALTY',
      payload: { playerId: aliceId }
    })
    expect(state.players[0].penalties).toBe(1)
    expect(state.players[0].totalScore).toBe(-4) // 1 point from mark - 5 penalty
    
    // Game should still be playing
    expect(state.gameStatus).toBe('playing')
  })
  
  it('should end game when 2 rows are locked', () => {
    let state = gameReducer(initialGameState, {
      type: 'INITIALIZE_GAME',
      payload: { playerNames: ['Alice', 'Bob'] }
    })
    state = gameReducer(state, { type: 'START_GAME' })
    
    const aliceId = state.players[0].id
    
    // Lock first row by marking 5 numbers and the last one
    for (let i = 2; i <= 6; i++) {
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId: aliceId, color: 'red', number: i }
      })
    }
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'red', number: 12 }
    })
    
    expect(state.lockedRows).toContain('red')
    expect(state.gameStatus).toBe('playing') // Still playing with 1 locked row
    
    // Lock second row
    for (let i = 2; i <= 6; i++) {
      state = gameReducer(state, {
        type: 'MARK_NUMBER',
        payload: { playerId: aliceId, color: 'yellow', number: i }
      })
    }
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'yellow', number: 12 }
    })
    
    expect(state.lockedRows).toHaveLength(2)
    expect(state.gameStatus).toBe('ended') // Game ended with 2 locked rows
  })
  
  it('should end game when player gets 4 penalties', () => {
    let state = gameReducer(initialGameState, {
      type: 'INITIALIZE_GAME',
      payload: { playerNames: ['Alice', 'Bob'] }
    })
    state = gameReducer(state, { type: 'START_GAME' })
    
    const aliceId = state.players[0].id
    
    // Add 4 penalties
    for (let i = 0; i < 4; i++) {
      state = gameReducer(state, {
        type: 'ADD_PENALTY',
        payload: { playerId: aliceId }
      })
    }
    
    expect(state.players[0].penalties).toBe(4)
    expect(state.players[0].totalScore).toBe(-20)
    expect(state.gameStatus).toBe('ended')
  })
  
  it('should maintain history of all actions', () => {
    let state = gameReducer(initialGameState, {
      type: 'INITIALIZE_GAME',
      payload: { playerNames: ['Alice', 'Bob'] }
    })
    
    expect(state.history).toHaveLength(1)
    
    state = gameReducer(state, { type: 'START_GAME' })
    expect(state.history).toHaveLength(2)
    
    state = gameReducer(state, { type: 'NEXT_TURN' })
    expect(state.history).toHaveLength(3)
    
    // Verify action types in history
    expect(state.history[0].type).toBe('INITIALIZE_GAME')
    expect(state.history[1].type).toBe('START_GAME')
    expect(state.history[2].type).toBe('NEXT_TURN')
  })
  
  it('should handle complex marking scenarios', () => {
    let state = gameReducer(initialGameState, {
      type: 'INITIALIZE_GAME',
      payload: { playerNames: ['Alice', 'Bob'] }
    })
    state = gameReducer(state, { type: 'START_GAME' })
    
    const aliceId = state.players[0].id
    
    // Mark non-consecutive numbers (skipping allowed)
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'red', number: 2 }
    })
    
    // Skip 3, 4, mark 5
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'red', number: 5 }
    })
    
    // Try to mark skipped number (should fail - state unchanged)
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'red', number: 3 }
    })
    
    // State should not have changed (except history)
    expect(state.players[0].scoreSheet.red.numbers[1].marked).toBe(false)
    
    // Mark another valid number
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'red', number: 8 }
    })
    expect(state.players[0].scoreSheet.red.numbers[6].marked).toBe(true)
  })
  
  it('should calculate scores correctly across multiple rows', () => {
    let state = gameReducer(initialGameState, {
      type: 'INITIALIZE_GAME',
      payload: { playerNames: ['Alice', 'Bob'] }
    })
    state = gameReducer(state, { type: 'START_GAME' })
    
    const aliceId = state.players[0].id
    
    // Mark 2 numbers in red (2 marks = 3 points)
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'red', number: 2 }
    })
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'red', number: 3 }
    })
    
    // Mark 3 numbers in yellow (3 marks = 6 points)
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'yellow', number: 2 }
    })
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'yellow', number: 3 }
    })
    state = gameReducer(state, {
      type: 'MARK_NUMBER',
      payload: { playerId: aliceId, color: 'yellow', number: 4 }
    })
    
    // Add 1 penalty (-5 points)
    state = gameReducer(state, {
      type: 'ADD_PENALTY',
      payload: { playerId: aliceId }
    })
    
    // Total: 3 + 6 - 5 = 4 points
    expect(state.players[0].totalScore).toBe(4)
  })
})
