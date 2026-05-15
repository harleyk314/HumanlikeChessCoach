import { pieceSymbols } from "./pieceSymbols"

type Props = {
  square: string
  piece: any
  game: any
  selectedSquare: string | null
  setSelectedSquare: (s: string | null) => void
  makeMove: (from: string, to: string) => void
  isLegalMove: boolean
  lastMove: {
    from: string
    to: string
  } | null
}

function Square({
  square,
  piece,
  game,
  selectedSquare,
  setSelectedSquare,
  makeMove,
  isLegalMove,
  lastMove
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

  const pieceColor =
    piece?.color === "w" ? "#680707" : "#222222"

  const isFromSquare = lastMove?.from === square
  const isToSquare = lastMove?.to === square

  const classes = ["square"]

  const isKingInCheck =
  piece?.type === "k" &&
  piece.color === game.turn() &&
  game.isCheck()

  if (isKingInCheck) {
    classes.push("check")
  }

  if ((square.charCodeAt(0) + Number(square[1])) % 2 === 1) {
    classes.push("dark")
  } else {
    classes.push("light")
  }

  if (selectedSquare === square) {
    classes.push("selected")
  }

  if (isLegalMove) {
    classes.push("legal-move")
  }

  if (isFromSquare) {
    classes.push("last-move-from")
  }

  if (isToSquare) {
    classes.push("last-move-to")
  }

  const className = classes.join(" ")

  return (
    <div
      onClick={handleClick}
      className={className}
      style={{
        width: 60,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        cursor: "pointer",
        color: pieceColor
      }}
    >
      {piece ? pieceSymbols[piece.type] : ""}
    </div>
  )
}

export default Square