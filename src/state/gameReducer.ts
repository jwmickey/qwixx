/**
 * Game state reducer for managing game actions
 */

import type { GameState, GameAction } from '../types/game'
import { 
  createPlayer, 
  calculateTotalScore, 
  canMarkNumber,
  canLockRow,
  shouldGameEnd 
} from '../utils/gameHelpers'

/**
 * Initial game state
 */
export const initialGameState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  dice: null,
  lockedRows: [],
  gameStatus: 'setup',
  history: [],
}

/**
 * Game state reducer
 */
export function gameReducer(state: GameState, action: GameAction): GameState {
  // Add action to history for all actions
  const newState = { ...state, history: [...state.history, action] }
  
  switch (action.type) {
    case 'INITIALIZE_GAME': {
      const { playerNames } = action.payload
      
      // Validate player count (2-5 players)
      if (playerNames.length < 2 || playerNames.length > 5) {
        console.error('Invalid number of players. Must be between 2 and 5.')
        return state
      }
      
      // Validate player names
      if (playerNames.some(name => !name.trim())) {
        console.error('Player names cannot be empty.')
        return state
      }
      
      // Create players
      const players = playerNames.map(name => createPlayer(name.trim()))
      
      return {
        ...newState,
        players,
        currentPlayerIndex: 0,
        dice: null,
        lockedRows: [],
        gameStatus: 'setup',
      }
    }
    
    case 'START_GAME': {
      if (state.players.length < 2) {
        console.error('Cannot start game without at least 2 players.')
        return state
      }
      
      return {
        ...newState,
        gameStatus: 'playing',
      }
    }
    
    case 'NEXT_TURN': {
      if (state.gameStatus !== 'playing') {
        return state
      }
      
      // Move to next player
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length
      
      return {
        ...newState,
        currentPlayerIndex: nextIndex,
        dice: null, // Clear dice for next turn
      }
    }
    
    case 'ROLL_DICE': {
      if (state.gameStatus !== 'playing') {
        return state
      }
      
      return {
        ...newState,
        dice: action.payload,
      }
    }
    
    case 'MARK_NUMBER': {
      const { playerId, color, number } = action.payload
      
      if (state.gameStatus !== 'playing') {
        return state
      }
      
      // Check if row is locked
      if (state.lockedRows.includes(color)) {
        console.error(`Row ${color} is locked.`)
        return state
      }
      
      // Find player and validate
      const playerIndex = state.players.findIndex(p => p.id === playerId)
      if (playerIndex === -1) {
        console.error('Player not found.')
        return state
      }
      
      const player = state.players[playerIndex]
      const row = player.scoreSheet[color]
      
      // Validate if number can be marked
      if (!canMarkNumber(row, number)) {
        console.error(`Cannot mark number ${number} in ${color} row.`)
        return state
      }
      
      // Mark the number
      const updatedNumbers = row.numbers.map(n =>
        n.number === number ? { ...n, marked: true } : n
      )
      
      const updatedRow = {
        ...row,
        numbers: updatedNumbers,
      }
      
      const updatedScoreSheet = {
        ...player.scoreSheet,
        [color]: updatedRow,
      }
      
      const updatedPlayer = {
        ...player,
        scoreSheet: updatedScoreSheet,
        totalScore: calculateTotalScore({ ...player, scoreSheet: updatedScoreSheet }),
      }
      
      const updatedPlayers = [...state.players]
      updatedPlayers[playerIndex] = updatedPlayer
      
      // Check if this marks should also lock the row
      let updatedLockedRows = state.lockedRows
      if (canLockRow(row, number)) {
        updatedLockedRows = [...state.lockedRows, color]
        updatedPlayers[playerIndex] = {
          ...updatedPlayer,
          scoreSheet: {
            ...updatedPlayer.scoreSheet,
            [color]: { ...updatedRow, locked: true },
          },
        }
      }
      
      // Check if game should end
      const gameStatus = shouldGameEnd(updatedLockedRows.length, updatedPlayers)
        ? 'ended'
        : 'playing'
      
      return {
        ...newState,
        players: updatedPlayers,
        lockedRows: updatedLockedRows,
        gameStatus,
      }
    }
    
    case 'LOCK_ROW': {
      const { color } = action.payload
      
      if (state.gameStatus !== 'playing') {
        return state
      }
      
      // Check if already locked
      if (state.lockedRows.includes(color)) {
        return state
      }
      
      const updatedLockedRows = [...state.lockedRows, color]
      
      // Check if game should end
      const gameStatus = shouldGameEnd(updatedLockedRows.length, state.players)
        ? 'ended'
        : 'playing'
      
      return {
        ...newState,
        lockedRows: updatedLockedRows,
        gameStatus,
      }
    }
    
    case 'ADD_PENALTY': {
      const { playerId } = action.payload
      
      if (state.gameStatus !== 'playing') {
        return state
      }
      
      const playerIndex = state.players.findIndex(p => p.id === playerId)
      if (playerIndex === -1) {
        return state
      }
      
      const player = state.players[playerIndex]
      const newPenalties = Math.min(player.penalties + 1, 4)
      
      const updatedPlayer = {
        ...player,
        penalties: newPenalties,
        totalScore: calculateTotalScore({ ...player, penalties: newPenalties }),
      }
      
      const updatedPlayers = [...state.players]
      updatedPlayers[playerIndex] = updatedPlayer
      
      // Check if game should end (player reached 4 penalties)
      const gameStatus = shouldGameEnd(state.lockedRows.length, updatedPlayers)
        ? 'ended'
        : 'playing'
      
      return {
        ...newState,
        players: updatedPlayers,
        gameStatus,
      }
    }
    
    case 'END_GAME': {
      if (state.gameStatus === 'ended') {
        return state
      }
      
      return {
        ...newState,
        gameStatus: 'ended',
      }
    }
    
    case 'RESET_GAME': {
      return {
        ...initialGameState,
        history: [action],
      }
    }
    
    default:
      return state
  }
}
