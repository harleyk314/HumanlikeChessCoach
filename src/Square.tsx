import { pieceSymbols } from "./pieceSymbols"

type Props = {
  square: string
  piece: any
  game: any
  selectedSquare: string | null
  setSelectedSquare: (s: string | null) => void
  makeMove: (from: string, to: string) => void
  isLegalMove: boolean
}

function Square({
  square,
  piece,
  game,
  selectedSquare,
  setSelectedSquare,
  makeMove,
  isLegalMove
}: Props) {

  const handleClick = () => {
    if (!selectedSquare) {
      if (piece) setSelectedSquare(square)
      return
    }

    if (selectedSquare === square) {
      setSelectedSquare(null)
      return
    }

    const selectedPiece = game.get(selectedSquare)

    // switch selection if same color
    if (piece && selectedPiece && piece.color === selectedPiece.color) {
      setSelectedSquare(square)
      return
    }

    makeMove(selectedSquare, square)

    setSelectedSquare(null)
  }

  const isDark =
    (square.charCodeAt(0) + Number(square[1])) % 2 === 1

  let background = isDark ? "#769656" : "#eeeed2"

  const isKingInCheck =
    piece?.type === "k" &&
    piece.color === game.turn() &&
    game.isCheck()

  if (isKingInCheck) background = "#ff4d4d"

  if (isLegalMove) background = "#a9a9a9"
  if (selectedSquare === square) background = "#f6f669"

  const pieceColor =
    piece?.color === "w" ? "#680707" : "#222222"

  return (
    <div
      onClick={handleClick}
      style={{
        width: 60,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        cursor: "pointer",
        backgroundColor: background,
        color: pieceColor
      }}
    >
      {piece ? pieceSymbols[piece.type] : ""}
    </div>
  )
}

export default Square