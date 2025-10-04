/**
 * GameControls component - Roll dice, pass turn, end game buttons
 */

interface GameControlsProps {
  onRollDice: () => void
  onPassTurn: () => void
  canRoll: boolean
  canPass: boolean
  currentPlayerName: string
}

export function GameControls({
  onRollDice,
  onPassTurn,
  canRoll,
  canPass,
  currentPlayerName,
}: GameControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">
          {currentPlayerName}'s Turn
        </h3>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onRollDice}
          disabled={!canRoll}
          className={`flex-1 py-3 px-6 rounded font-semibold transition-colors ${
            canRoll
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          🎲 Roll Dice
        </button>

        <button
          onClick={onPassTurn}
          disabled={!canPass}
          className={`flex-1 py-3 px-6 rounded font-semibold transition-colors ${
            canPass
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Pass Turn
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        {canRoll ? 'Roll the dice to see your options' : 'Mark numbers or pass to continue'}
      </p>
    </div>
  )
}
