import Square from "./Square"

type Props = {
  game: any
  selectedSquare: string | null
  setSelectedSquare: (s: string | null) => void
  makeMove: (from: string, to: string) => void
}

const files = ["a","b","c","d","e","f","g","h"]

function Board({
  game,
  selectedSquare,
  setSelectedSquare,
  makeMove
}: Props) {

  const board = game.board()

  const legalMoves = selectedSquare
    ? game.moves({ square: selectedSquare, verbose: true })
    : []

  const legalSquares = legalMoves.map((m: any) => m.to)

  return (
    <div>
      {board.map((row: any[], r: number) => (
        <div key={r} style={{ display: "flex" }}>
          {row.map((piece, c) => {
            const square = files[c] + (8 - r)

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
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Board