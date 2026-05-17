import { useEffect, useRef, useState } from "react"
import { createStockfishInstance } from "./stockfishInstance"

type CacheEntry = {
  bestMove: string
  evaluation: number
}

export function useStockfishAnalysis(depth: number = 15) {
  const sfRef = useRef<any>(null)
  const searchIdRef = useRef(0)
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map())
  const currentFenRef = useRef<string | null>(null)
  const evaluationRef = useRef<number | null>(null)

  const [bestMove, setBestMove] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<number | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    createStockfishInstance((message: string) => {
      if (message.includes("score cp")) {
        const parts = message.split("score cp ")[1]
        const cp = parseInt(parts.split(" ")[0])
        evaluationRef.current = cp
        setEvaluation(cp)
      }

      if (message.startsWith("bestmove")) {
        const move = message.split(" ")[1]

        if (searchIdRef.current !== searchIdRef.current) return

        const fen = currentFenRef.current
        if (!fen) return

        cacheRef.current.set(fen, {
          bestMove: move,
          evaluation: evaluationRef.current ?? 0
        })

        setBestMove(move)
        setIsThinking(false)
      }
    }).then((sf) => {
      sfRef.current = sf
    })
  }, [])

  const analyse = (fen: string) => {
    const sf = sfRef.current
    if (!sf) return

    const cached = cacheRef.current.get(fen)
    if (cached) {
      setBestMove(cached.bestMove)
      setEvaluation(cached.evaluation)
      setIsThinking(false)
      return
    }

    searchIdRef.current++
    currentFenRef.current = fen

    sf.postMessage("stop")
    sf.postMessage(`position fen ${fen}`)
    sf.postMessage(`go depth ${depth}`)
    setIsThinking(true)
  }

  return { bestMove, evaluation, isThinking, analyse }
}