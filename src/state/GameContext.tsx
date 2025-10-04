/**
 * React Context for game state management
 */

import React, { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { GameState, GameAction } from '../types/game'
import { gameReducer, initialGameState } from './gameReducer'

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<GameAction>
}

const GameContext = createContext<GameContextValue | undefined>(undefined)

interface GameProviderProps {
  children: ReactNode
}

/**
 * Game state provider component
 */
export function GameProvider({ children }: GameProviderProps) {
  // Wrapper to make gameReducer compatible with useReducer
  const reducerWrapper = (state: GameState, action: GameAction): GameState => {
    return gameReducer(state, action)
  }
  
  const [state, dispatch] = useReducer(reducerWrapper, initialGameState)
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  )
}

/**
 * Hook to access game state and dispatch
 * @returns Game context value
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext)
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider')
  }
  
  return context
}
