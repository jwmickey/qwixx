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
  // valid numbers are provided per color so colored rows only enable their own combinations
  validNumbersByColor: Record<RowColor, Set<number>>
  // Map of color -> (sum -> set of white die indices (1 or 2)) used to render a small UI hint
  validSourcesByColor?: Record<RowColor, Map<number, Set<1 | 2>>>
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
  validNumbers,
  sources,
}: {
  color: RowColor
  row: Player['scoreSheet'][RowColor]
  onMarkNumber: (number: number) => void
  canInteract: boolean
  validNumbers: Set<number>
  sources?: Map<number, Set<1 | 2>>
}) {
  const colors = ROW_COLORS[color]
  const rowScore = calculateRowScore(row)

  return (
    <div className="mb-2" role="group" aria-label={`${color} row`}>
      <div className="flex items-center gap-1">
        {/* Color indicator */}
        <div 
          className={`w-8 h-8 rounded ${colors.bg} ${colors.border} border-2 flex items-center justify-center`}
          aria-hidden="true"
        >
          <span className={`text-xs font-bold ${colors.text}`}>
            {color[0].toUpperCase()}
          </span>
        </div>

        {/* Numbers */}
        <div className="flex gap-1 flex-1 overflow-x-auto" role="group" aria-label={`${color} row numbers`}>
          {row.numbers.map((num, index) => {
            const isValid = validNumbers.has(num.number)
            const sourceSet = sources?.get(num.number)
            // Allow clicking if valid OR if already marked (for toggle/unmark)
            const isClickable = canInteract && !row.locked && (isValid || num.marked)
            
            // Check if this position is blocked because something to the right is marked
            const isBlocked = !num.marked && row.numbers.slice(index + 1).some(n => n.marked)
            
            return (
              <div className="relative" key={num.number}>
              <button
                key={num.number}
                onClick={() => isClickable && onMarkNumber(num.number)}
                disabled={!isClickable}
                className={`w-8 h-8 rounded border-2 text-sm font-semibold flex-shrink-0 transition-all duration-200 relative ${
                  num.marked
                    ? `${colors.bg} ${colors.text} ${colors.border} scale-105 cursor-pointer hover:opacity-80`
                    : isBlocked
                    ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed line-through'
                    : isValid && canInteract && !row.locked
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:scale-105 cursor-pointer'
                    : 'bg-white text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
                }`}
                aria-label={`${color} row, number ${num.number}${num.marked ? ', marked' : ''}${isBlocked ? ', blocked' : ''}`}
                aria-pressed={num.marked}
                tabIndex={isClickable ? 0 : -1}
              >
                {num.number}
              </button>
              {/* Small badge showing which white die(s) produce this sum when it's valid */}
              {isValid && sourceSet && (
                <div className="absolute -top-2 -right-2 bg-white border rounded px-1 text-xs font-semibold text-gray-700 flex gap-0.5 items-center" title={`Produced by white die(s): ${[...sourceSet].map(s => `W${s}`).join(', ')}`}>
                  {[...sourceSet].sort().map(s => (
                    <span key={s} className="text-[10px] leading-none">{`W${s}`}</span>
                  ))}
                </div>
              )}
              </div>
            )
          })}
        </div>

        {/* Lock indicator */}
        <div 
          className="w-8 h-8 flex items-center justify-center"
          aria-label={row.locked ? `${color} row locked` : `${color} row score: ${rowScore}`}
        >
          {row.locked ? (
            <span className="text-xl" aria-hidden="true">🔒</span>
          ) : (
            <span className="text-gray-400 text-xs">{rowScore}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export function ScoreSheet({ player, isActive, onMarkNumber, onAddPenalty, canInteract, validNumbersByColor }: ScoreSheetProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow p-4 ${isActive ? 'ring-2 ring-blue-500' : ''}`}
      role="region"
      aria-label={`${player.name}'s score sheet${isActive ? ' (active player)' : ''}`}
    >
      {/* Player name and score */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-900">
          {player.name}
          {isActive && <span className="ml-2 text-sm text-blue-600" aria-label="Active player">← Active</span>}
        </h3>
        <div className="text-right" aria-label={`Total score: ${player.totalScore} points`}>
          <div className="text-2xl font-bold text-gray-900" aria-hidden="true">{player.totalScore}</div>
          <div className="text-xs text-gray-500" aria-hidden="true">points</div>
        </div>
      </div>

      {/* Color rows */}
      <ColorRow
        color="red"
        row={player.scoreSheet.red}
        onMarkNumber={(num) => onMarkNumber('red', num)}
        canInteract={canInteract}
        validNumbers={validNumbersByColor.red}
      />
      <ColorRow
        color="yellow"
        row={player.scoreSheet.yellow}
        onMarkNumber={(num) => onMarkNumber('yellow', num)}
        canInteract={canInteract}
        validNumbers={validNumbersByColor.yellow}
      />
      <ColorRow
        color="green"
        row={player.scoreSheet.green}
        onMarkNumber={(num) => onMarkNumber('green', num)}
        canInteract={canInteract}
        validNumbers={validNumbersByColor.green}
      />
      <ColorRow
        color="blue"
        row={player.scoreSheet.blue}
        onMarkNumber={(num) => onMarkNumber('blue', num)}
        canInteract={canInteract}
        validNumbers={validNumbersByColor.blue}
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
