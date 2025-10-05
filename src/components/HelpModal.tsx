/**
 * HelpModal component - Displays game rules and instructions
 */

interface HelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 id="help-modal-title" className="text-2xl font-bold text-gray-900">
            How to Play Qwixx
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close help modal"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Objective */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Objective</h3>
            <p className="text-gray-700">
              Mark numbers on your score sheet to form rows and score points. The player with the
              highest score wins!
            </p>
          </section>

          {/* Score Sheet */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Score Sheet</h3>
            <p className="text-gray-700 mb-2">Each player has four colored rows:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>
                <span className="font-semibold text-red-600">Red Row:</span> Numbers 2-12 (ascending)
              </li>
              <li>
                <span className="font-semibold text-yellow-600">Yellow Row:</span> Numbers 2-12 (ascending)
              </li>
              <li>
                <span className="font-semibold text-green-600">Green Row:</span> Numbers 12-2 (descending)
              </li>
              <li>
                <span className="font-semibold text-blue-600">Blue Row:</span> Numbers 12-2 (descending)
              </li>
            </ul>
          </section>

          {/* Gameplay */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gameplay</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-800">1. White Dice (All Players)</h4>
                <p className="text-gray-700">
                  The active player rolls all 6 dice. All players may mark the sum of the two white
                  dice in any one colored row.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">2. Colored Dice (Active Player Only)</h4>
                <p className="text-gray-700">
                  The active player may additionally combine one white die with one colored die and
                  mark this sum in the matching colored row.
                </p>
              </div>
            </div>
          </section>

          {/* Marking Rules */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Marking Rules</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>Numbers must be marked from left to right in each row</li>
              <li>Numbers may be skipped, but once skipped, cannot be marked later</li>
              <li>You are never forced to mark a number</li>
              <li>If the active player marks nothing, they must take a penalty (-5 points)</li>
            </ul>
          </section>

          {/* Locking Rows */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Locking Rows</h3>
            <p className="text-gray-700 mb-2">A row can be locked when:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>At least 5 numbers have been marked in that row</li>
              <li>The rightmost number (2 or 12) is marked</li>
            </ul>
            <p className="text-gray-700 mt-2">
              When locked, the row is marked with 🔒 and no player can mark that row anymore. The
              colored die is removed from play.
            </p>
          </section>

          {/* Game End */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Game End</h3>
            <p className="text-gray-700 mb-2">The game ends immediately when:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>A player takes their 4th penalty mark, OR</li>
              <li>Two rows have been locked</li>
            </ul>
          </section>

          {/* Scoring */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Scoring</h3>
            <p className="text-gray-700 mb-2">Points are awarded based on marks per row:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div>1 mark = 1 point</div>
              <div>7 marks = 28 points</div>
              <div>2 marks = 3 points</div>
              <div>8 marks = 36 points</div>
              <div>3 marks = 6 points</div>
              <div>9 marks = 45 points</div>
              <div>4 marks = 10 points</div>
              <div>10 marks = 55 points</div>
              <div>5 marks = 15 points</div>
              <div>11 marks = 66 points</div>
              <div>6 marks = 21 points</div>
              <div>12 marks = 78 points</div>
            </div>
            <p className="text-gray-700 mt-2">Each penalty mark = -5 points</p>
          </section>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  )
}
