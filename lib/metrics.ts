import type { BacktestResult } from "@/lib/backtestEngine"

export type Trade = {
  symbol: string
  entryDate: string
  exitDate: string
  entryPrice: number
  exitPrice: number
  quantity: number
  pnl: number
}

export type PortfolioSnapshot = {
  date: string
  equity: number
}

export function calcTotalReturn(snapshots: PortfolioSnapshot[]): number {
  if (!snapshots.length) return 0
  const first = snapshots[0]!.equity
  const last = snapshots[snapshots.length - 1]!.equity
  if (first <= 0) return 0
  return last / first - 1
}

export function calcCAGRFromSnapshots(snapshots: PortfolioSnapshot[]): number {
  if (snapshots.length < 2) return 0
  const first = snapshots[0]!
  const last = snapshots[snapshots.length - 1]!
  const start = new Date(first.date).getTime()
  const end = new Date(last.date).getTime()
  const days = (end - start) / (1000 * 60 * 60 * 24)
  if (days <= 0 || first.equity <= 0 || last.equity <= 0) return 0
  const years = days / 365
  return Math.pow(last.equity / first.equity, 1 / years) - 1
}

export function calcMaxDrawdownFromSnapshots(snapshots: PortfolioSnapshot[]): number {
  if (!snapshots.length) return 0
  let peak = snapshots[0]!.equity
  let maxDD = 0
  for (const s of snapshots) {
    if (s.equity > peak) peak = s.equity
    const dd = peak > 0 ? (s.equity - peak) / peak : 0
    if (dd < maxDD) maxDD = dd
  }
  return Math.abs(maxDD)
}

export function calcVolatilityFromSnapshots(snapshots: PortfolioSnapshot[]): number {
  if (snapshots.length < 2) return 0
  const dailyReturns: number[] = []
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1]!.equity
    const curr = snapshots[i]!.equity
    if (prev > 0) dailyReturns.push((curr - prev) / prev)
  }
  if (dailyReturns.length <= 1) return 0
  const mean = dailyReturns.reduce((s, r) => s + r, 0) / dailyReturns.length
  const variance =
    dailyReturns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) /
    (dailyReturns.length - 1)
  const dailyStd = Math.sqrt(variance)
  return dailyStd * Math.sqrt(252)
}

export function calcSharpeFromSnapshots(
  snapshots: PortfolioSnapshot[],
  riskFreeRate = 0.02
): number {
  if (snapshots.length < 2) return 0
  const dailyReturns: number[] = []
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1]!.equity
    const curr = snapshots[i]!.equity
    if (prev > 0) dailyReturns.push((curr - prev) / prev)
  }
  if (!dailyReturns.length) return 0
  const vol = calcVolatilityFromSnapshots(snapshots)
  if (vol === 0) return 0
  const avgDaily =
    dailyReturns.reduce((s, r) => s + r, 0) / dailyReturns.length
  const rfDaily = Math.pow(1 + riskFreeRate, 1 / 252) - 1
  const excess = avgDaily - rfDaily
  return (excess * 252) / vol
}

export function calcWinRate(trades: Trade[]): number {
  if (!trades.length) return 0
  const wins = trades.filter((t) => t.pnl > 0).length
  return wins / trades.length
}

export function calcAverageHoldingPeriodDays(trades: Trade[]): number {
  if (!trades.length) return 0
  let weightedSum = 0
  let totalQty = 0
  for (const t of trades) {
    const start = new Date(t.entryDate).getTime()
    const end = new Date(t.exitDate).getTime()
    const days = Math.max(0, (end - start) / (1000 * 60 * 60 * 24))
    weightedSum += days * t.quantity
    totalQty += t.quantity
  }
  if (totalQty <= 0) return 0
  return weightedSum / totalQty
}

export function calcPnlBySymbol(trades: Trade[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const t of trades) {
    out[t.symbol] = (out[t.symbol] ?? 0) + t.pnl
  }
  return out
}

export function fromBacktestResultToSnapshots(
  backtest: BacktestResult
): PortfolioSnapshot[] {
  return backtest.equityCurve.map((p) => ({
    date: p.date,
    equity: p.portfolioValue,
  }))
}

