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
      className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
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
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Dice</h3>
      
      {/* White dice */}
      <div className="flex gap-2 mb-3">
        <Die value={dice.white1} color="white" />
        <Die value={dice.white2} color="white" />
        <div className="flex items-center px-2 text-gray-600 font-semibold">
          = {dice.white1 + dice.white2}
        </div>
      </div>

      {/* Colored dice */}
      <div className="flex gap-2 flex-wrap">
        <Die value={dice.red} color="red" locked={lockedRows.includes('red')} />
        <Die value={dice.yellow} color="yellow" locked={lockedRows.includes('yellow')} />
        <Die value={dice.green} color="green" locked={lockedRows.includes('green')} />
        <Die value={dice.blue} color="blue" locked={lockedRows.includes('blue')} />
      </div>
    </div>
  )
}
