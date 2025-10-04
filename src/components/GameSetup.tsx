/**
 * GameSetup component - Player name input and game initialization
 */

import { useState } from 'react'

interface GameSetupProps {
  onStartGame: (playerNames: string[]) => void
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(2)
  const [playerNames, setPlayerNames] = useState(['', ''])
  const [error, setError] = useState('')

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count)
    const newNames = Array(count).fill('').map((_, i) => playerNames[i] || '')
    setPlayerNames(newNames)
    setError('')
  }

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames]
    newNames[index] = name
    setPlayerNames(newNames)
    setError('')
  }

  const handleStartGame = () => {
    // Validate player names
    const filledNames = playerNames.filter(name => name.trim() !== '')
    
    if (filledNames.length < 2) {
      setError('Please enter names for at least 2 players')
      return
    }

    if (filledNames.length !== playerCount) {
      setError(`Please enter names for all ${playerCount} players`)
      return
    }

    // Check for duplicate names
    const uniqueNames = new Set(filledNames.map(name => name.trim().toLowerCase()))
    if (uniqueNames.size !== filledNames.length) {
      setError('Player names must be unique')
      return
    }

    onStartGame(filledNames.map(name => name.trim()))
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Qwixx</h1>
        <p className="text-gray-600 text-center mb-6">Digital dice game</p>

        {/* Player count selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Players
          </label>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map(count => (
              <button
                key={count}
                onClick={() => handlePlayerCountChange(count)}
                className={`flex-1 py-2 px-4 rounded font-semibold transition-colors ${
                  playerCount === count
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Player name inputs */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Player Names
          </label>
          <div className="space-y-2">
            {playerNames.map((name, index) => (
              <input
                key={index}
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Player ${index + 1}`}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={20}
              />
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Start game button */}
        <button
          onClick={handleStartGame}
          className="w-full bg-green-600 text-white py-3 px-6 rounded font-semibold hover:bg-green-700 transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
