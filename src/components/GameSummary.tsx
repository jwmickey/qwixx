/**
 * GameSummary component - End game screen with final scores
 */

import type { Player } from '../types/game'
import { calculateRowScore } from '../utils/gameHelpers'

interface GameSummaryProps {
  players: Player[]
  winners: Player[]
  onNewGame: () => void
}

export function GameSummary({ players, winners, onNewGame }: GameSummaryProps) {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Game Over!</h1>
        
        {/* Winner announcement */}
        <div className="mb-6 text-center">
          {winners.length === 1 ? (
            <p className="text-xl text-green-600 font-semibold">
              🎉 {winners[0].name} wins with {winners[0].totalScore} points!
            </p>
          ) : (
            <p className="text-xl text-green-600 font-semibold">
              🎉 It's a tie! {winners.map(w => w.name).join(' and ')} win with {winners[0].totalScore} points!
            </p>
          )}
        </div>

        {/* Final scores */}
        <div className="space-y-4 mb-6">
          {sortedPlayers.map((player, index) => {
            const isWinner = winners.some(w => w.id === player.id)
            return (
              <div
                key={player.id}
                className={`border-2 rounded-lg p-4 ${
                  isWinner ? 'border-green-500 bg-green-50' : 'border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                    <span className="text-xl font-bold text-gray-900">{player.name}</span>
                    {isWinner && <span className="text-xl">👑</span>}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{player.totalScore}</div>
                </div>

                {/* Score breakdown */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-600">Red:</span>
                    <span>{calculateRowScore(player.scoreSheet.red)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">Yellow:</span>
                    <span>{calculateRowScore(player.scoreSheet.yellow)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Green:</span>
                    <span>{calculateRowScore(player.scoreSheet.green)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Blue:</span>
                    <span>{calculateRowScore(player.scoreSheet.blue)}</span>
                  </div>
                  {player.penalties > 0 && (
                    <div className="flex justify-between col-span-2 text-red-600 font-semibold">
                      <span>Penalties ({player.penalties}):</span>
                      <span>{player.penalties * -5}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* New game button */}
        <button
          onClick={onNewGame}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded font-semibold hover:bg-blue-700 transition-colors"
        >
          New Game
        </button>
      </div>
    </div>
  )
}
