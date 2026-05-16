import { useEffect, useRef, useState } from "react"

export function useStockfish() {
  const workerRef = useRef<any>(null)
  const [bestMove, setBestMove] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<number | null>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "/stockfish.js"
    script.onload = () => {
      // @ts-ignore
      window.Stockfish().then((sf: any) => {
        workerRef.current = sf

        sf.addMessageListener((message: string) => {
          console.log("Stockfish says:", message)

          if (message.startsWith("bestmove")) {
            const move = message.split(" ")[1]
            setBestMove(move)
          }

          if (message.includes("score cp")) {
            const parts = message.split("score cp ")[1]
            const cp = parseInt(parts.split(" ")[0])
            setEvaluation(cp)
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

  const analyse = (fen: string, depth: number = 20) => {
    const sf = workerRef.current
    if (!sf) return

    sf.postMessage(`position fen ${fen}`)
    sf.postMessage(`go depth ${depth}`)
  }

  return { bestMove, evaluation, analyse }
}