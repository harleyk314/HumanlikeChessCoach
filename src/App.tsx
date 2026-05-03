/// <reference types="vite/client" />
import { Chess } from "chess.js"
import { useRef, useState } from "react"
import Board from "./Board"
import "./App.css"
import PGNPanel from "./PGNPanel"
import Controls from "./Controls"


function App() {
  const gameRef = useRef(new Chess())
  const [, forceRender] = useState(0)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [viewIndex, setViewIndex] = useState<number | null>(null)
  const [settings, setSettings] = useState({
    showLegalMoves: true,
    soundEnabled: true,
    highlightLastMove: true
  })
  const [isBoardFlipped, setBoardFlipped] = useState(false)
  const [pgnInput, setPgnInput] = useState("")
  const game = gameRef.current
  const moves = game.history()
  const isCheckmate = game.isCheckmate()
  const isStalemate = game.isStalemate()
  const isDraw = game.isDraw()
  const isCheck = game.isCheck()

  const pgnRows: { moveNumber: number; white: string; black?: string }[] = []
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
    setBoardFlipped(false)
    forceRender(x => x + 1)
  }

  const makeMove = (from: string, to: string) => {
    // only allow moves if we're at the latest position
    if (viewIndex !== null && viewIndex !== moves.length) return
    
    gameRef.current.move({ from, to })

    if (settings.soundEnabled) {
      const audio = new Audio("/move.mp3")
      audio.play()
    }
    forceRender(x => x + 1)
}

  const undo = () => {
    gameRef.current.undo()
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

  const stepBack = () => {
    setViewIndex(v =>
      v === null ? moves.length - 1 : Math.max(0, v - 1)
    )
  }

  const stepForward = () => {
    setViewIndex(v => {
      if (v === null) return null
      return v + 1 >= moves.length ? null : v + 1
    })
  }

  const goToMove = (index: number) => {
    setViewIndex(index)
  }

  //ChatGPT: This is the key idea: we temporarily replay moves up to a point.
  //If I don't understand this, I should ask ChatGPT for clarification.
  const viewMoves =
    viewIndex === null
      ? moves
      : moves.slice(0, viewIndex)
      const viewGame = (() => {
  const g = new Chess()

  for (const m of viewMoves) {
    g.move(m)
  }

  return g
})()
  
  return (
    <div className="app">
      <h1>Chess App</h1>

      <div className="main">
        <div className="chess-board">
          <Board
            game={viewGame}
            selectedSquare={selectedSquare}
            setSelectedSquare={setSelectedSquare}
            isBoardFlipped = {isBoardFlipped}
            makeMove={makeMove}
            settings={settings}
          />
        </div>
        <PGNPanel
          pgnInput={pgnInput}
          setPgnInput={setPgnInput}
          loadPgn={loadPgn}
          pgnRows={pgnRows}
          goToMove={goToMove}
        />
      </div>
        <Controls
          newGame={newGame}
          undo={undo}
          isBoardFlipped={isBoardFlipped}
          setBoardFlipped={setBoardFlipped}
        />
        <button onClick={stepBack}>←</button>
        <button onClick={stepForward}>→</button>
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
      <div className="status">
        <strong>{status}</strong>
      
    </div>
    </div>
  )
}

export default App