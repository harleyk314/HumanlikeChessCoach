let stockfishLoadPromise: Promise<void> | null = null

function loadStockfishScript(): Promise<void> {
  if (stockfishLoadPromise) return stockfishLoadPromise

  stockfishLoadPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src="/stockfish.js"]')
    if (existing) {
      resolve()
      return
    }

    const script = document.createElement("script")
    script.src = "/stockfish.js"
    script.onload = () => resolve()
    document.head.appendChild(script)
  })

  return stockfishLoadPromise
}

export function createStockfishInstance(
  onMessage: (message: string) => void
): Promise<any> {
  return loadStockfishScript().then(() => {
    return new Promise((resolve) => {
      // @ts-ignore
      window.Stockfish().then((sf: any) => {
        sf.addMessageListener(onMessage)
        sf.postMessage("uci")
        sf.postMessage("isready")
        resolve(sf)
      })
    })
  })
}