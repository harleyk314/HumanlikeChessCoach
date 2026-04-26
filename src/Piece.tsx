function Piece({ piece }: any) {
  if (!piece) return null
  return <span>{piece.type}</span>
}

export default Piece