/**
 * DiceDisplay component - Shows the current dice values
 */

import type { DiceState, RowColor } from '../types/game'

interface DiceDisplayProps {
  dice: DiceState | null
  lockedRows: RowColor[]
}

const DICE_COLORS: Record<string, string> = {
  white: 'bg-white text-gray-900 border-gray-400',
  red: 'bg-red-500 text-white border-red-700',
  yellow: 'bg-yellow-400 text-gray-900 border-yellow-600',
  green: 'bg-green-500 text-white border-green-700',
  blue: 'bg-blue-500 text-white border-blue-700',
}

function Die({ value, color, locked }: { value: number; color: string; locked?: boolean }) {
  return (
    <div
      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-300 ${
        DICE_COLORS[color]
      } ${locked ? 'opacity-40' : ''}`}
    >
      {value}
    </div>
  )
}

export function DiceDisplay({ dice, lockedRows }: DiceDisplayProps) {
  if (!dice) {
    return (
      <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
        Roll the dice to start!
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-3">
      {/* All dice on one line */}
      <div className="flex gap-2 items-center flex-wrap">
        <Die value={dice.white1} color="white" />
        <Die value={dice.white2} color="white" />
        <div className="flex items-center px-1 text-gray-600 font-semibold text-sm">
          = {dice.white1 + dice.white2}
        </div>
        <div className="w-px h-8 bg-gray-300 mx-1"></div>
        <Die value={dice.red} color="red" locked={lockedRows.includes('red')} />
        <Die value={dice.yellow} color="yellow" locked={lockedRows.includes('yellow')} />
        <Die value={dice.green} color="green" locked={lockedRows.includes('green')} />
        <Die value={dice.blue} color="blue" locked={lockedRows.includes('blue')} />
      </div>
    </div>
  )
}
