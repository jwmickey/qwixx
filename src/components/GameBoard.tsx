/**
 * GameBoard component - Main game screen with all UI elements
 */

import { useState, useEffect } from 'react'
import { useGame } from '../state'
import { DiceDisplay } from './DiceDisplay'
import { ScoreSheet } from './ScoreSheet'
import { rollAllDice, getActivePlayerCombinations } from '../utils/diceHelpers'
import type { RowColor } from '../types/game'

type TurnPhase = 'rolling' | 'white-dice' | 'colored-dice' | 'inactive-players'

export function GameBoard() {
  const { state, dispatch } = useGame()
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('rolling')
  const [whiteDiceMarked, setWhiteDiceMarked] = useState(false)
  const [coloredDiceMarked, setColoredDiceMarked] = useState(false)
  const [playersWhoMarkedWhite, setPlayersWhoMarkedWhite] = useState<Set<string>>(new Set())

  const currentPlayer = state.players[state.currentPlayerIndex]

  // Reset turn state when player changes or dice are rolled
  useEffect(() => {
    if (state.dice === null) {
      setTurnPhase('rolling')
      setWhiteDiceMarked(false)
      setColoredDiceMarked(false)
      setPlayersWhoMarkedWhite(new Set())
    }
  }, [state.dice, state.currentPlayerIndex])

  const handleRollDice = () => {
    const diceValues = rollAllDice()
    dispatch({ type: 'ROLL_DICE', payload: diceValues })
    setTurnPhase('white-dice')
  }

  const handleMarkNumber = (playerId: string, color: RowColor, number: number) => {
    const isActivePlayer = playerId === currentPlayer.id
    const whiteDiceSum = state.dice ? state.dice.white1 + state.dice.white2 : 0
    const isWhiteDiceMark = number === whiteDiceSum

    // Validate marking rules
    if (turnPhase === 'white-dice') {
      // Check if player already marked white dice
      if (playersWhoMarkedWhite.has(playerId)) {
        console.error('Player already marked white dice this turn')
        return
      }
      
      if (isWhiteDiceMark) {
        // Mark white dice - allow marking even if row is globally locked
        // (multiple players can lock the same row during white dice phase)
        dispatch({
          type: 'MARK_NUMBER',
          payload: { playerId, color, number, allowLockedRow: true },
        })
        setPlayersWhoMarkedWhite(prev => new Set(prev).add(playerId))
        if (isActivePlayer) {
          setWhiteDiceMarked(true)
        }
      } else {
        console.error('Can only mark white dice sum in this phase')
        return
      }
    } else if (turnPhase === 'colored-dice' && isActivePlayer && !coloredDiceMarked) {
      // Active player can mark one colored dice combination
      dispatch({
        type: 'MARK_NUMBER',
        payload: { playerId, color, number },
      })
      setColoredDiceMarked(true)
    } else if (turnPhase === 'inactive-players' && !isActivePlayer) {
      // Inactive players can mark white dice - allow marking even if row is locked
      if (isWhiteDiceMark && !playersWhoMarkedWhite.has(playerId)) {
        dispatch({
          type: 'MARK_NUMBER',
          payload: { playerId, color, number, allowLockedRow: true },
        })
        setPlayersWhoMarkedWhite(prev => new Set(prev).add(playerId))
      }
    }
  }

  const handleAddPenalty = (playerId: string) => {
    dispatch({ type: 'ADD_PENALTY', payload: { playerId } })
  }

  const handleFinishWhiteDicePhase = () => {
    if (turnPhase === 'white-dice') {
      setTurnPhase('colored-dice')
    }
  }

  const handleFinishColoredDicePhase = () => {
    if (turnPhase === 'colored-dice') {
      // If active player marked nothing, add penalty
      if (!whiteDiceMarked && !coloredDiceMarked) {
        handleAddPenalty(currentPlayer.id)
      }
      setTurnPhase('inactive-players')
    }
  }

  const handlePassTurn = () => {
    // Move to next turn
    dispatch({ type: 'NEXT_TURN' })
    setTurnPhase('rolling')
    setWhiteDiceMarked(false)
    setColoredDiceMarked(false)
    setPlayersWhoMarkedWhite(new Set())
  }

  // Can only roll if dice haven't been rolled yet this turn
  const canRoll = state.dice === null

  // Determine button states based on turn phase
  let primaryButtonText = ''
  let primaryButtonAction = () => {}
  let primaryButtonDisabled = false

  if (turnPhase === 'white-dice') {
    primaryButtonText = 'Finish White Dice'
    primaryButtonAction = handleFinishWhiteDicePhase
    primaryButtonDisabled = false
  } else if (turnPhase === 'colored-dice') {
    primaryButtonText = 'Finish Turn'
    primaryButtonAction = handleFinishColoredDicePhase
    primaryButtonDisabled = false
  } else if (turnPhase === 'inactive-players') {
    primaryButtonText = 'Next Player'
    primaryButtonAction = handlePassTurn
    primaryButtonDisabled = false
  }

  // Get valid numbers for each player based on dice and turn phase
  const getValidNumbers = (playerId: string): Set<number> => {
    if (!state.dice) return new Set()

    const isActivePlayer = playerId === currentPlayer.id
    const whiteDiceSum = state.dice.white1 + state.dice.white2

    if (turnPhase === 'white-dice') {
      // All players can see white dice sum
      return new Set([whiteDiceSum])
    } else if (turnPhase === 'colored-dice') {
      if (isActivePlayer && !coloredDiceMarked) {
        // Active player can use colored dice combinations
        const combinations = getActivePlayerCombinations(state.dice, state.lockedRows)
        return new Set(combinations.filter(c => c.color !== null).map(c => c.sum))
      }
      return new Set()
    } else if (turnPhase === 'inactive-players') {
      if (!isActivePlayer && !playersWhoMarkedWhite.has(playerId)) {
        // Inactive players can mark white dice
        return new Set([whiteDiceSum])
      }
      return new Set()
    }

    return new Set()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Game title */}
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Qwixx</h1>
        </div>

        {/* Game controls */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold mb-3">{currentPlayer.name}'s Turn</h3>
          <div className="flex gap-2 mb-3">
            {turnPhase === 'rolling' ? (
              <button
                onClick={handleRollDice}
                disabled={!canRoll}
                className={`flex-1 py-3 px-4 rounded font-medium ${
                  canRoll
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                🎲 Roll Dice
              </button>
            ) : (
              <button
                onClick={primaryButtonAction}
                disabled={primaryButtonDisabled}
                className={`flex-1 py-3 px-4 rounded font-medium ${
                  !primaryButtonDisabled
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {primaryButtonText}
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600">
            {turnPhase === 'rolling' && 'Roll the dice to see your options'}
            {turnPhase === 'white-dice' && 'All players: Mark the white dice sum (optional), then click Finish'}
            {turnPhase === 'colored-dice' && `${currentPlayer.name}: Mark ONE colored dice combination (optional), then Finish`}
            {turnPhase === 'inactive-players' && 'Other players: Mark white dice sum or click Next Player'}
          </p>
        </div>

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
              canInteract={turnPhase !== 'rolling'}
              validNumbers={getValidNumbers(player.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
