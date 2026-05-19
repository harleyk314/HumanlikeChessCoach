/// <reference types="vite/client" />
import { Chess } from "chess.js"
import { useEffect, useRef, useState, useMemo } from "react"
import "./App.css"
import Board from "./Board"
import PGNPanel from "./PGNPanel"
import Controls from "./Controls"
//Stockfish hook imports
import { useStockfishAnalysis } from "./hooks/useStockfishAnalysis"
import { useStockfishOpponent } from "./hooks/useStockfishOpponent"


type AppConfig = {
  engine: {
    enabled: boolean
    playsMoves: boolean
    color: "w" | "b"
    opponentDepth: number
    analysisDepth: number
  }

  ui: {
    showEvalBar: boolean
    showTree: boolean
  }

  rules: {
    enforceTurns: boolean
    allowNavigation: boolean
  }
}
  const defaultConfig: AppConfig = {
    engine: {
      enabled: true,
      playsMoves: true,
      color: "b",
      opponentDepth: 12,
      analysisDepth: 12
    },
    ui: {
      showEvalBar: false,
      showTree: false
    },
    rules: {
      enforceTurns: true,
      allowNavigation: true
    }
  }
function App() {

  const gameRef = useRef(new Chess())
  const audioRef = useRef(new Audio("/move.mp3"))
  const [, forceRender] = useState(0)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [viewIndex, setViewIndex] = useState(-1) //-1 is the starting index
  const [settings, setSettings] = useState({
    showLegalMoves: true,
    soundEnabled: true,
    highlightLastMove: true
  })
  const [isBoardFlipped, setBoardFlipped] = useState(false)
  const [pgnInput, setPgnInput] = useState("")
  const [config, setConfig] = useState<AppConfig>(defaultConfig)
  const game = gameRef.current
  //Does moves actually need to be memoized?
  const moves = game.history({ verbose: true })
  const lastMove = viewIndex >= 0 ? moves[viewIndex] : null
  const currentIndex = moves.length === 0 ? null : moves.length - 1
  //game stages
  const isCheckmate = game.isCheckmate()
  const isStalemate = game.isStalemate()
  const isDraw = game.isDraw()
  const isCheck = game.isCheck()
  //engine stuff
  const { bestMove, evaluation, isThinking, analyse } = useStockfishAnalysis(config.engine.analysisDepth)
  const { bestMove: opponentMove, getMove, resetMove } = useStockfishOpponent(config.engine.opponentDepth)
  const [opponentThinking, setOpponentThinking] = useState(false)

  //Set up the PGN rows for game import (should this be in PGNPanel?)
  const pgnRows: { moveNumber: number; white: any; black?: any }[] = []
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i]

    if (i % 2 === 0) {
      pgnRows.push({
        moveNumber: Math.floor(i / 2) + 1,
        white: move,
      })
    } else {
      pgnRows[pgnRows.length - 1].black = move
    }
  }

  let status = ""

  if (isCheckmate) {
    status = `Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins`
  } else if (isStalemate) {
    status = "Stalemate"
  } else if (isDraw) {
    status = "Draw"
  } else if (isCheck) {
    status = "Check"
  }

  const newGame = () => {
    gameRef.current = new Chess()
    setViewIndex(-1)
    setBoardFlipped(false)
    forceRender(x => x + 1)
  }

  const makeMove = (from: string, to: string, byEngine: boolean = false) => {
    console.log("makeMove called:", { from, to, byEngine })
    
    if (!byEngine) {
      const piece = game.get(from as any)
      if (config.engine.enabled && config.engine.playsMoves) {
        if (piece && piece.color === config.engine.color) return
      }
        const isLatest = viewIndex === moves.length - 1 || moves.length === 0
        if (!isLatest) return
    }

    const move = gameRef.current.move({ from, to })
    if (!move) return

    setViewIndex(gameRef.current.history().length - 1)
    forceRender(x => x + 1)

    if (settings.soundEnabled) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }
const undo = () => {
  if (config.engine.enabled && config.engine.playsMoves) {
    if (game.turn() === config.engine.color) return
    gameRef.current.undo()
    gameRef.current.undo()
  } else {
    gameRef.current.undo()
  }

  const newLength = gameRef.current.history().length
  setViewIndex(newLength - 1)
  resetMove()
  forceRender(x => x + 1)
}

  const loadPgn = () => {
    const newGame = new Chess()

    try {
      newGame.loadPgn(pgnInput)
    } catch (e) {
      alert("Invalid PGN")
      return
    }

    gameRef.current = newGame
    setSelectedSquare(null)
    forceRender(x => x + 1)
  }

  const exportPgn = () => {
    const pgn = gameRef.current.pgn()

    navigator.clipboard.writeText(pgn)
  }

  const max = game.history().length - 1

  const stepBack = () => {
    setViewIndex(v => Math.max(-1, v - 1))
  }

  const stepForward = () => {
    setViewIndex(v => Math.min(max, v + 1))
  }

  const goToMove = (index: number) => {
    setViewIndex(index)
  }

  //We can probably adjust or get rid of this code block? Maybe?
  const userCanMove = (square: string): boolean => {
  // If engine is playing, user can't touch engine's pieces
  if (config.engine.enabled && config.engine.playsMoves) {
    const piece = game.get(square as any)
    if (piece && piece.color === config.engine.color) return false
  }

  // If enforce turns is on, user can't move opponent's pieces
  if (config.rules.enforceTurns) {
    const piece = game.get(square as any)
    if (piece && piece.color !== game.turn()) return false
  }

  return true
}

const viewGame = useMemo(() => {
  const g = new Chess()
  const safeMoves = viewIndex === -1 ? [] : moves.slice(0, viewIndex + 1)
  for (const m of safeMoves) {
    g.move(m)
  }
  return g
}, [viewIndex, moves])
useEffect(() => {
  const timeout = setTimeout(() => {
    analyse(viewGame.fen())
  }, 150)

  return () => clearTimeout(timeout)
}, [viewGame.fen()])

useEffect(() => {
    console.log("Engine effect fired:", {
    turn: game.turn(),
    engineColor: config.engine.color,
    viewIndex,
    movesLength: moves.length,
    isLatest: viewIndex === moves.length - 1 || moves.length === 0
  })
  if (!config.engine.enabled) return
  if (!config.engine.playsMoves) return

  const isLatest = viewIndex === moves.length - 1 || moves.length === 0
  if (!isLatest) return

  if (game.turn() !== config.engine.color) return
  setOpponentThinking(true)
  getMove(game.fen())
}, [moves.length])

useEffect(() => {
  if (!opponentMove) return

  //for the visual display, this indicates when the engine is "thinking"
  console.log("opponentMove effect fired:", opponentMove)
  const delay = setTimeout(() => {
    const from = opponentMove.slice(0, 2)
    const to = opponentMove.slice(2, 4)
    makeMove(from, to, true)
    setOpponentThinking(false)
  }, 1000)

  return () => clearTimeout(delay)
}, [opponentMove])

  return (
    <div className="app">
      <div className="header">
        <div className="header-left">
          Play computer
        </div>

        <div className="header-center">
          Analysis
        </div>

        <div className="header-right">
          About
        </div>
      </div>
      <div className="main">
        <div className="left-sidebar">
          <h2> Analysis mode </h2>
          <Controls
            newGame={newGame}
            undo={undo}
            isBoardFlipped={isBoardFlipped}
            setBoardFlipped={setBoardFlipped}
          />
          <button>
            Analysis Mode (Testing only)
          </button>
          <button>
            Play mode (Testing only)
          </button>
          
          <button onClick={() => analyse(viewGame.fen())}>
            Test Stockfish
          </button>
          <div>Best move: {bestMove}</div>
          <div>Evaluation: {evaluation}</div>
          <div className="thinking-indicator" style={{ visibility: isThinking ? "visible" : "hidden" }}>
            Analysing...
          </div>
          <div className="settings">
            <label>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) =>
                  setSettings(s => ({ ...s, soundEnabled: e.target.checked }))
                }
              />
              Sound
            </label>

            <label>
              <input
                type="checkbox"
                checked={settings.highlightLastMove}
                onChange={(e) =>
                  setSettings(s => ({ ...s, highlightLastMove: e.target.checked }))
                }
              />
              Highlight last move
            </label>
          </div>
        </div>
        <div className="chess-board">
          <Board
            game={viewGame}
            selectedSquare={selectedSquare}
            setSelectedSquare={setSelectedSquare}
            isBoardFlipped = {isBoardFlipped}
            makeMove={makeMove}
            settings={settings}
            lastMove={lastMove}
            engineColor={config.engine.color}
            engineActive={config.engine.enabled && config.engine.playsMoves}
          />
        </div>
        <div className="right-sidebar">
          <div className="thinking-indicator" style={{ visibility: opponentThinking ? "visible" : "hidden" }}>
            Opponent is thinking...
          </div>
          <PGNPanel
            pgnRows={pgnRows}
            goToMove={goToMove}
            viewIndex={viewIndex}
            stepBack={stepBack}
            stepForward={stepForward}
          />
          <div className="import-section">
            <div className="textarea">
              <textarea 
                placeholder="Paste PGN here..."
                value={pgnInput}
                onChange={(e) => setPgnInput(e.target.value)}
              />
            </div>
            <div className="load-and-export">
              <button onClick={loadPgn}>Load PGN</button>
              <button onClick={exportPgn}>Export PGN</button>
            </div>
          </div>
        </div>
      </div>
      <div className="status">
          <strong>{status}</strong>
      </div>
    </div>
  )
}

export default App