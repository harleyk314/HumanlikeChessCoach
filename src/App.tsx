import { Chess } from "chess.js"
import { useRef, useState } from "react"
import Board from "./Board"


function App() {
  const gameRef = useRef(new Chess())
  const [, forceRender] = useState(0)
  const game = gameRef.current
  const pgn = game.pgn()
  const isCheckmate = game.isCheckmate()
  const isStalemate = game.isStalemate()
  const isDraw = game.isDraw()
  const isCheck = game.isCheck()
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)

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
    <div style={{ padding: 20 }}>
      <h1>Chess App</h1>

      <Board
        game={game}
        selectedSquare={selectedSquare}
        setSelectedSquare={setSelectedSquare}
        makeMove={makeMove}
      />

      <div style={{ marginTop: 20 }}>
        <button onClick={newGame}>New Game</button>
        <button onClick={undo}>Undo</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>PGN</h3>
        <pre>{pgn}</pre>
      </div>

      <div style={{ marginTop: 10 }}>
        <strong>{status}</strong>
      </div>

    </div>
  )
}

export default App