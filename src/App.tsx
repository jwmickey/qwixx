import { useEffect, useState } from 'react'
import { GameProvider, useGame } from './state'
import { GameSetup, GameBoard, GameSummary, TutorialModal } from './components'
import { determineWinner } from './utils/gameHelpers'
import { loadGameState, hasSavedGame, clearGameState, getAutoSaveEnabled, setAutoSaveEnabled } from './utils/storage'
import { registerServiceWorker, setupInstallPrompt, showInstallPrompt, isStandalone } from './utils/pwa'

function GameContainer() {
  const { state, dispatch } = useGame()
  const [showTutorial, setShowTutorial] = useState(false)
  const [showResumeDialog, setShowResumeDialog] = useState(false)
  const [autoSave, setAutoSave] = useState(getAutoSaveEnabled())
  const [showInstallBanner, setShowInstallBanner] = useState(false)

  // Check for saved game and tutorial on mount
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('qwixx-tutorial-seen')
    if (!hasSeenTutorial) {
      setShowTutorial(true)
    }

    // Check for saved game
    if (hasSavedGame() && state.gameStatus === 'setup') {
      setShowResumeDialog(true)
    }

    // Setup PWA install prompt
    if (!isStandalone()) {
      setupInstallPrompt(() => {
        // Show install banner after a delay to not overwhelm the user
        setTimeout(() => {
          const hasSeenInstallPrompt = localStorage.getItem('qwixx-install-prompt-seen')
          if (!hasSeenInstallPrompt) {
            setShowInstallBanner(true)
          }
        }, 5000)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCloseTutorial = () => {
    setShowTutorial(false)
    localStorage.setItem('qwixx-tutorial-seen', 'true')
  }

  const handleStartGame = (playerNames: string[]) => {
    dispatch({ type: 'INITIALIZE_GAME', payload: { playerNames } })
    dispatch({ type: 'START_GAME' })
    // Enable auto-save by default for new games
    if (!getAutoSaveEnabled()) {
      setAutoSaveEnabled(true)
      setAutoSave(true)
    }
  }

  const handleNewGame = () => {
    clearGameState()
    dispatch({ type: 'RESET_GAME' })
  }

  const handleResumeGame = () => {
    const savedState = loadGameState()
    if (savedState) {
      dispatch({ type: 'LOAD_GAME', payload: { state: savedState } })
    }
    setShowResumeDialog(false)
  }

  const handleStartNewGame = () => {
    clearGameState()
    setShowResumeDialog(false)
  }

  const toggleAutoSave = () => {
    const newValue = !autoSave
    setAutoSave(newValue)
    setAutoSaveEnabled(newValue)
  }

  const handleInstallClick = async () => {
    const outcome = await showInstallPrompt()
    if (outcome) {
      setShowInstallBanner(false)
      localStorage.setItem('qwixx-install-prompt-seen', 'true')
    }
  }

  const handleDismissInstall = () => {
    setShowInstallBanner(false)
    localStorage.setItem('qwixx-install-prompt-seen', 'true')
  }

  if (state.gameStatus === 'setup') {
    return (
      <>
        <GameSetup onStartGame={handleStartGame} />
        {showResumeDialog && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-dialog-title"
          >
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 id="resume-dialog-title" className="text-xl font-bold text-gray-900 mb-4">
                Resume Game?
              </h2>
              <p className="text-gray-700 mb-6">
                You have a saved game in progress. Would you like to resume it or start a new game?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleResumeGame}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                >
                  Resume Game
                </button>
                <button
                  onClick={handleStartNewGame}
                  className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 font-medium"
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  if (state.gameStatus === 'ended') {
    const winners = determineWinner(state.players)
    return <GameSummary players={state.players} winners={winners} onNewGame={handleNewGame} />
  }

  return (
    <>
      <div className="relative">
        <GameBoard />
        {/* Auto-save indicator */}
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={toggleAutoSave}
            className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 ${
              autoSave
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
            title={autoSave ? 'Auto-save enabled' : 'Auto-save disabled'}
            aria-label={autoSave ? 'Disable auto-save' : 'Enable auto-save'}
          >
            {autoSave ? '💾 Auto-save ON' : '💾 Auto-save OFF'}
          </button>
        </div>
        {/* Install PWA banner */}
        {showInstallBanner && (
          <div className="fixed bottom-20 left-4 right-4 z-40 bg-white rounded-lg shadow-xl p-4 border-2 border-blue-500">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Install Qwixx</h3>
                <p className="text-sm text-gray-600">
                  Install the app for a better experience and offline play!
                </p>
              </div>
              <button
                onClick={handleDismissInstall}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Dismiss install prompt"
              >
                ✕
              </button>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleInstallClick}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium text-sm"
              >
                Install
              </button>
              <button
                onClick={handleDismissInstall}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium text-sm"
              >
                Not now
              </button>
            </div>
          </div>
        )}
      </div>
      <TutorialModal isOpen={showTutorial} onClose={handleCloseTutorial} />
    </>
  )
}

function App() {
  // Register service worker on app load
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  )
}

export default App
