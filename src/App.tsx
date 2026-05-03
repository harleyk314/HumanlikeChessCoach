import { Chess } from "chess.js"
import { useRef, useState } from "react"
import Board from "./Board"
import "./App.css"


function App() {
  const gameRef = useRef(new Chess())
  const [, forceRender] = useState(0)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
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
    forceRender(x => x + 1)
  }

  const makeMove = (from: string, to: string) => {
    gameRef.current.move({ from, to })
    forceRender(x => x + 1)
}

  const undo = () => {
    gameRef.current.undo()
    forceRender(x => x + 1)
  }

  return (
    <div className="app">
      <h1>Chess App</h1>

      <div className="main">
        <div className="chess-board">
          <Board
            game={game}
            selectedSquare={selectedSquare}
            setSelectedSquare={setSelectedSquare}
            makeMove={makeMove}
          />
        </div>
        <div className="pgn-box-overview">
          <div className="moves-header">
            Moves
            </div>
          <div className="pgn-box">
            
            {pgnRows.map((row) => (
              <div key={row.moveNumber} className="pgn-row">
                <div className="pgn-num">{row.moveNumber}.</div>
                <div className="pgn-white">{row.white}</div>
                <div className="pgn-black">{row.black ?? ""}</div>
              </div>
            ))}
          </div>
      </div>
      </div>
      <div className="controls">
        <button onClick={newGame}>New Game</button>
        <button onClick={undo}>Undo</button>
      </div>

      <div className="status">
        <strong>{status}</strong>
      </div>
    </div>
  )
}

export default App