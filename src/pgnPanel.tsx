type Props = {
  pgnInput: string
  setPgnInput: (value: string) => void
  loadPgn: () => void
  pgnRows: { moveNumber: number; white: string; black?: string }[]
  goToMove: (index: number) => void
}

function PGNPanel({ pgnInput, setPgnInput, loadPgn, pgnRows, goToMove }: Props) {
  return (
    <div className="pgn-box-overview">
      <div className="moves-header">Moves</div>

      <div className="pgn-box">
        {pgnRows.map((row, i) => (
            <div
              key={row.moveNumber}
              className="pgn-row"
              onClick={() => goToMove(i * 2)}
              style={{ cursor: "pointer" }}
            >
            <div className="pgn-num">{row.moveNumber}.</div>
            <div className="pgn-white">{row.white}</div>
            <div className="pgn-black">{row.black ?? ""}</div>
          </div>
        ))}
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