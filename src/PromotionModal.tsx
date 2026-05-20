import { pieceSymbols } from "./pieceSymbols"

type Props = {
  color: "w" | "b"
  onChoose: (piece: "q" | "r" | "b" | "n") => void
  onCancel: () => void
}

const PROMOTION_PIECES = [
  { type: "q" as const, label: "Queen" },
  { type: "r" as const, label: "Rook" },
  { type: "b" as const, label: "Bishop" },
  { type: "n" as const, label: "Knight" },
]

function PromotionModal({ color, onChoose, onCancel }: Props) {
  const pieceColor = color === "w" ? "#680707" : "#222222"

  return (
    <div className="promotion-overlay" onClick={onCancel}>
      <div
        className="promotion-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="promotion-title">Promote pawn to:</div>
        <div className="promotion-choices">
          {PROMOTION_PIECES.map(({ type, label }) => (
            <button
              key={type}
              className="promotion-piece-btn"
              onClick={() => onChoose(type)}
              title={label}
            >
              <span style={{ color: pieceColor, fontSize: "40px" }}>
                {pieceSymbols[type]}
              </span>
              <span className="promotion-piece-label">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PromotionModal
