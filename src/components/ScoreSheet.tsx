/**
 * ScoreSheet component - Player's score sheet with all rows
 */

import type { Player, RowColor } from '../types/game'
import { calculateRowScore } from '../utils/gameHelpers'

interface ScoreSheetProps {
  player: Player
  isActive: boolean
  onMarkNumber: (color: RowColor, number: number) => void
  onAddPenalty: () => void
  canInteract: boolean
}

const ROW_COLORS: Record<RowColor, { bg: string; text: string; border: string }> = {
  red: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-700' },
  yellow: { bg: 'bg-yellow-400', text: 'text-gray-900', border: 'border-yellow-600' },
  green: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-700' },
  blue: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-700' },
}

function ColorRow({
  color,
  row,
  onMarkNumber,
  canInteract,
}: {
  color: RowColor
  row: Player['scoreSheet'][RowColor]
  onMarkNumber: (number: number) => void
  canInteract: boolean
}) {
  const colors = ROW_COLORS[color]
  const rowScore = calculateRowScore(row)

  return (
    <div className="mb-2">
      <div className="flex items-center gap-1">
        {/* Color indicator */}
        <div className={`w-8 h-8 rounded ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}>
          <span className={`text-xs font-bold ${colors.text}`}>
            {color[0].toUpperCase()}
          </span>
        </div>

        {/* Numbers */}
        <div className="flex gap-1 flex-1 overflow-x-auto">
          {row.numbers.map((num) => (
            <button
              key={num.number}
              onClick={() => canInteract && onMarkNumber(num.number)}
              disabled={!canInteract || row.locked}
              className={`w-8 h-8 rounded border-2 text-sm font-semibold flex-shrink-0 transition-all duration-200 ${
                num.marked
                  ? `${colors.bg} ${colors.text} ${colors.border} scale-105`
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:scale-105'
              } ${!canInteract || row.locked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
            >
              {num.number}
            </button>
          ))}
        </div>

        {/* Lock indicator */}
        <div className="w-8 h-8 flex items-center justify-center">
          {row.locked ? (
            <span className="text-xl">🔒</span>
          ) : (
            <span className="text-gray-400 text-xs">{rowScore}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function ScoreSheet({ player, isActive, onMarkNumber, onAddPenalty, canInteract }: ScoreSheetProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
      {/* Player name and score */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-900">
          {player.name}
          {isActive && <span className="ml-2 text-sm text-blue-600">← Active</span>}
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{player.totalScore}</div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>

      {/* Color rows */}
      <ColorRow
        color="red"
        row={player.scoreSheet.red}
        onMarkNumber={(num) => onMarkNumber('red', num)}
        canInteract={canInteract && isActive}
      />
      <ColorRow
        color="yellow"
        row={player.scoreSheet.yellow}
        onMarkNumber={(num) => onMarkNumber('yellow', num)}
        canInteract={canInteract && isActive}
      />
      <ColorRow
        color="green"
        row={player.scoreSheet.green}
        onMarkNumber={(num) => onMarkNumber('green', num)}
        canInteract={canInteract && isActive}
      />
      <ColorRow
        color="blue"
        row={player.scoreSheet.blue}
        onMarkNumber={(num) => onMarkNumber('blue', num)}
        canInteract={canInteract && isActive}
      />

      {/* Penalties */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Penalties</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center text-sm transition-all duration-300 ${
                    i < player.penalties
                      ? 'bg-red-500 text-white border-red-700 scale-110'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {i < player.penalties && '✕'}
                </div>
              ))}
            </div>
            {canInteract && isActive && player.penalties < 4 && (
              <button
                onClick={onAddPenalty}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium transition-colors"
              >
                + Penalty
              </button>
            )}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {player.penalties > 0 && `${player.penalties} × -5 = ${player.penalties * -5} points`}
        </div>
      </div>
    </div>
  )
}
