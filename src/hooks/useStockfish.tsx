import { useEffect, useRef, useState } from "react"

type CacheEntry = {
  bestMove: string
  evaluation: number
}

export function useStockfish() {
  const sfRef = useRef<any>(null)
  const searchIdRef = useRef(0)
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map())
  const currentFenRef = useRef<string | null>(null)
  const evaluationRef = useRef<number | null>(null)

  const [bestMove, setBestMove] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<number | null>(null)
  const [isThinking, setIsThinking] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "/stockfish.js"
    script.onload = () => {
      // @ts-ignore
      window.Stockfish().then((sf: any) => {
        sfRef.current = sf

        sf.addMessageListener((message: string) => {
          const id = searchIdRef.current

          // Intermediate results - show but don't cache
          if (message.includes("score cp")) {
            const parts = message.split("score cp ")[1]
            const cp = parseInt(parts.split(" ")[0])
            evaluationRef.current = cp  // ← update ref immediately
            setEvaluation(cp)           // ← update state for display
          }

          // Search complete - now cache it
          if (message.startsWith("bestmove")) {
            const move = message.split(" ")[1]
            console.log("bestmove fired, evaluationRef is:", evaluationRef.current)  // ← add this
            // Check if this result is still relevant
            if (id !== searchIdRef.current) return

            const fen = currentFenRef.current
            if (!fen) return

            // Store in cache
            cacheRef.current.set(fen, {
              bestMove: move,
              evaluation: evaluationRef.current ?? 0
            })

            setBestMove(move)
            setIsThinking(false)
          }
        })

        sf.postMessage("uci")
        sf.postMessage("isready")
      })
    }

    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  const analyse = (fen: string, depth: number = 15) => {
    const sf = sfRef.current
    if (!sf) return

    // Check cache first
    const cached = cacheRef.current.get(fen)
    if (cached) {
      setBestMove(cached.bestMove)
      setEvaluation(cached.evaluation)
      setIsThinking(false)
      return
    }

    // Not cached - start a fresh search
    searchIdRef.current++
    currentFenRef.current = fen

    sf.postMessage("stop")
    sf.postMessage(`position fen ${fen}`)
    sf.postMessage(`go depth ${depth}`)
    setIsThinking(true)
  }

  return { bestMove, evaluation, isThinking, analyse }
}