import { GameProvider, useGame } from './state'
import { GameSetup, GameBoard, GameSummary } from './components'
import { determineWinner } from './utils/gameHelpers'

function GameContainer() {
  const { state, dispatch } = useGame()

  const handleStartGame = (playerNames: string[]) => {
    dispatch({ type: 'INITIALIZE_GAME', payload: { playerNames } })
    dispatch({ type: 'START_GAME' })
  }

  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' })
  }

  if (state.gameStatus === 'setup') {
    return <GameSetup onStartGame={handleStartGame} />
  }

  if (state.gameStatus === 'ended') {
    const winners = determineWinner(state.players)
    return <GameSummary players={state.players} winners={winners} onNewGame={handleNewGame} />
  }

  return <GameBoard />
}

function App() {
  return (
    <GameProvider>
      <GameContainer />
    </GameProvider>
  )
}

export default App
