/**
 * GameBoard component - Main game screen with all UI elements
 */

import { useGame } from '../state'
import { DiceDisplay } from './DiceDisplay'
import { ScoreSheet } from './ScoreSheet'
import { GameControls } from './GameControls'
import { rollAllDice, getActivePlayerCombinations, getOtherPlayerCombinations } from '../utils/diceHelpers'
import type { RowColor } from '../types/game'

export function GameBoard() {
  const { state, dispatch } = useGame()

  const currentPlayer = state.players[state.currentPlayerIndex]

  const handleRollDice = () => {
    const diceValues = rollAllDice()
    dispatch({ type: 'ROLL_DICE', payload: diceValues })
  }

  const handleMarkNumber = (playerId: string, color: RowColor, number: number) => {
    dispatch({
      type: 'MARK_NUMBER',
      payload: { playerId, color, number },
    })
  }

  const handleAddPenalty = (playerId: string) => {
    dispatch({ type: 'ADD_PENALTY', payload: { playerId } })
  }

  const handlePassTurn = () => {
    dispatch({ type: 'NEXT_TURN' })
  }

  // Can only roll if dice haven't been rolled yet this turn
  const canRoll = state.dice === null

  // Can pass after rolling dice
  const canPass = state.dice !== null

  // Get valid numbers for each player based on dice
  const getValidNumbers = (playerId: string): Set<number> => {
    if (!state.dice) return new Set()

    const isActivePlayer = playerId === currentPlayer.id
    
    if (isActivePlayer) {
      // Active player can use white dice sum + any colored die combinations
      const combinations = getActivePlayerCombinations(state.dice, state.lockedRows)
      return new Set(combinations.map(c => c.sum))
    } else {
      // Other players can only use white dice sum
      const combinations = getOtherPlayerCombinations(state.dice)
      return new Set(combinations.map(c => c.sum))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Game title */}
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Qwixx</h1>
        </div>

        {/* Game controls */}
        <GameControls
          onRollDice={handleRollDice}
          onPassTurn={handlePassTurn}
          canRoll={canRoll}
          canPass={canPass}
          currentPlayerName={currentPlayer.name}
        />

        {/* Dice display */}
        <DiceDisplay dice={state.dice} lockedRows={state.lockedRows} />

        {/* Score sheets */}
        <div className="space-y-4">
          {state.players.map((player) => (
            <ScoreSheet
              key={player.id}
              player={player}
              isActive={player.id === currentPlayer.id}
              onMarkNumber={(color, number) => handleMarkNumber(player.id, color, number)}
              onAddPenalty={() => handleAddPenalty(player.id)}
              canInteract={state.dice !== null}
              validNumbers={getValidNumbers(player.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
