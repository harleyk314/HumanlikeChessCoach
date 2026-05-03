import { Dispatch, SetStateAction } from "react"

type Props = {
  newGame: () => void
  undo: () => void
  isBoardFlipped: boolean
  setBoardFlipped: Dispatch<SetStateAction<boolean>>
}

function Controls({ newGame, undo, isBoardFlipped, setBoardFlipped }: Props) {
  return (
    <div className="controls">
      <button onClick={newGame}>New Game</button>
      <button onClick={undo}>Undo</button>
      <button onClick={() => setBoardFlipped(f => !f)}>
        Flip Board ({isBoardFlipped ? "Black" : "White"})
      </button>
    </div>
  )
}

export default Controls