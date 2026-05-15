
type Move = {
  from: string
  to: string
  piece: string
  san: string
  captured?: string
  promotion?: string
  flags: string
}

type Props = {
  pgnRows: {
  moveNumber: number
  white: Move
  black?: Move
}[]
  goToMove: (index: number) => void
  viewIndex: number
  stepBack: () => void
  stepForward: () => void
}

function PGNPanel({ pgnRows, goToMove, viewIndex, stepBack, stepForward}: Props) {


  return (
    <div className="pgn-box-overview">
      <div className="moves-header">Moves</div>

      <div className="pgn-box">
        {pgnRows.map((row, i) => {
            const whiteIndex = i * 2
            const blackIndex = i * 2 + 1

            const isWhiteActive = viewIndex === whiteIndex
            const isBlackActive = viewIndex === blackIndex

            return (
              <div key={row.moveNumber} className="pgn-row">
                <div className="pgn-num">{row.moveNumber}.</div>

                <div
                  className={`pgn-white ${isWhiteActive ? "active-move" : ""}`}
                  onClick={() => goToMove(whiteIndex)}
                >
                  {row.white.san}
                </div>

                <div
                  className={`pgn-black ${isBlackActive ? "active-move" : ""}`}
                  onClick={() => goToMove(blackIndex)}
                >
                  {row.black?.san ?? ""}
                </div>
              </div>
            )
        })}
      </div>
      <div className="move-controls">
        <button onClick={stepBack}>←</button>
        <button onClick={stepForward}>→</button>
      </div>
    </div>
  )
}

export default PGNPanel