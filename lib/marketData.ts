export type OHLCV = {
  date: string // YYYY-MM-DD
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type HistoricalParams = {
  symbol: string // e.g. 600519
  startDate: string // YYYY-MM-DD
  endDate: string // YYYY-MM-DD
  adjust?: "qfq" | "hfq" | "" // default qfq
}

export async function getHistoricalData(params: HistoricalParams): Promise<OHLCV[]> {
  const url = new URL("/api/market-data/historical", window.location.origin)
  url.searchParams.set("symbol", params.symbol.trim())
  url.searchParams.set("startDate", params.startDate)
  url.searchParams.set("endDate", params.endDate)
  url.searchParams.set("adjust", params.adjust ?? "qfq")

  const resp = await fetch(url.toString())
  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`拉取历史数据失败: ${resp.status} ${text}`)
  }
  return (await resp.json()) as OHLCV[]
}

