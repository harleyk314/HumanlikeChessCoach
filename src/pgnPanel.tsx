type Props = {
  pgnInput: string
  setPgnInput: (value: string) => void
  loadPgn: () => void
  pgnRows: { moveNumber: number; white: string; black?: string }[]
  goToMove: (index: number) => void
  viewIndex: number
  currentIndex: number | null
  movesLength: number
}

function PGNPanel({ pgnInput, setPgnInput, loadPgn, pgnRows, goToMove, viewIndex, currentIndex, movesLength}: Props) {


  return (
    <div className="pgn-box-overview">
      <div className="moves-header">Moves</div>

      <div className="pgn-box">
        {pgnRows.map((row, i) => {
            const effectiveIndex = viewIndex
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
                  {row.white}
                </div>

                <div
                  className={`pgn-black ${isBlackActive ? "active-move" : ""}`}
                  onClick={() => goToMove(blackIndex)}
                >
                  {row.black ?? ""}
                </div>
              </div>
            )
        })}
      </div>

      <textarea
        placeholder="Paste PGN here..."
        value={pgnInput}
        onChange={(e) => setPgnInput(e.target.value)}
        rows={5}
        style={{ width: "100%", marginTop: 10 }}
      />

      <button onClick={loadPgn}>Load PGN</button>
    </div>
  )
}

export default PGNPanel