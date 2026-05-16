import Square from "./Square"

type Props = {
  game: any
  selectedSquare: string | null
  settings: {
    showLegalMoves: boolean
    soundEnabled: boolean
    highlightLastMove: boolean
  }
  isBoardFlipped: boolean
  setSelectedSquare: (s: string | null) => void
  makeMove: (from: string, to: string) => void
  lastMove: {
    from: string
    to: string
  } | null
}

const files = ["a","b","c","d","e","f","g","h"]

function Board({
  game,
  selectedSquare,
  settings,
  isBoardFlipped,
  setSelectedSquare,
  makeMove,
  lastMove
}: Props) {

  const board = game.board()

  const legalMoves = selectedSquare
    ? game.moves({ square: selectedSquare, verbose: true })
    : []

  const legalSquares = legalMoves.map((m: any) => m.to)

  const orientation = isBoardFlipped ? "b" : "w";

  return (
    <div>
      {(orientation === "b" ? [...board].reverse() : board).map((row: any[], r: number) => (
        <div key={r} style={{ display: "flex" }}>
          {(orientation === "b" ? [...row].reverse() : row).map((piece, c: number) => {
            const actualRow = orientation === "b" ? 7 - r : r
            const actualCol = orientation === "b" ? 7 - c : c
            const square = files[actualCol] + (8 - actualRow)

            return (
              <Square
                key={square}
                square={square}
                piece={piece}
                game={game}
                selectedSquare={selectedSquare}
                setSelectedSquare={setSelectedSquare}
                makeMove={makeMove}
                isLegalMove={legalSquares.includes(square)}
                lastMove = {lastMove}
              />
          )
        })}
      </div>
    ))}
  </div>
)}

export default Board;