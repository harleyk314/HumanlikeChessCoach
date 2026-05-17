import { useEffect, useRef, useState } from "react"
import { createStockfishInstance } from "./stockfishInstance"

export function useStockfishOpponent(depth: number = 15) {
  const sfRef = useRef<any>(null)
  const [bestMove, setBestMove] = useState<string | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    createStockfishInstance((message: string) => {
      if (message.startsWith("bestmove")) {
        const move = message.split(" ")[1]
        setBestMove(move)
        setIsThinking(false)
      }
    }).then((sf) => {
      sfRef.current = sf
    })
  }, [])

  const getMove = (fen: string) => {
    const sf = sfRef.current
    if (!sf) return

    sf.postMessage("stop")
    sf.postMessage(`position fen ${fen}`)
    sf.postMessage(`go depth ${depth}`)
    setIsThinking(true)
  }

  return { bestMove, isThinking, getMove }
}