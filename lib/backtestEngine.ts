import type { OHLCV } from "@/lib/marketData"

export type StrategyType = "DCA" | "MA_CROSS" | "BUY_HOLD" | "RSI"

export type BacktestConfig = {
  strategy: StrategyType
  startDate: string
  endDate: string
  initialCapital: number
  dcaMonthlyAmount?: number
}

export type EquityPoint = {
  date: string
  portfolioValue: number
  cash: number
  shares: number
}

export type BacktestStats = {
  totalReturn: number
  cagr: number
  maxDrawdown: number
  volatility: number
  sharpe: number
}

export type TradePoint = {
  symbol: string
  entryDate: string
  exitDate: string
  entryPrice: number
  exitPrice: number
  quantity: number
  pnl: number
}

export type BacktestResult = {
  equityCurve: EquityPoint[]
  stats: BacktestStats
  trades: TradePoint[]
}

function calcCAGR(startValue: number, endValue: number, days: number): number {
  if (startValue <= 0 || endValue <= 0 || days <= 0) return 0
  const years = days / 365
  return Math.pow(endValue / startValue, 1 / years) - 1
}

function calcMaxDrawdown(values: number[]): number {
  let peak = values[0] ?? 0
  let maxDD = 0
  for (const v of values) {
    if (v > peak) peak = v
    const dd = peak > 0 ? (v - peak) / peak : 0
    if (dd < maxDD) maxDD = dd
  }
  return Math.abs(maxDD)
}

function calcVolatility(dailyReturns: number[]): number {
  if (dailyReturns.length <= 1) return 0
  const mean = dailyReturns.reduce((s, r) => s + r, 0) / dailyReturns.length
  const variance =
    dailyReturns.reduce((s, r) => s + Math.pow(r - mean, 2), 0) /
    (dailyReturns.length - 1)
  const dailyStd = Math.sqrt(variance)
  return dailyStd * Math.sqrt(252)
}

function calcSharpe(dailyReturns: number[], riskFreeRate = 0.02): number {
  if (!dailyReturns.length) return 0
  const vol = calcVolatility(dailyReturns)
  if (vol === 0) return 0
  const avgDaily = dailyReturns.reduce((s, r) => s + r, 0) / dailyReturns.length
  const rfDaily = Math.pow(1 + riskFreeRate, 1 / 252) - 1
  const excess = avgDaily - rfDaily
  return (excess * 252) / vol
}

function movingAverage(data: OHLCV[], window: number): number[] {
  const ma: number[] = []
  let sum = 0
  for (let i = 0; i < data.length; i++) {
    sum += data[i].close
    if (i >= window) sum -= data[i - window].close
    ma[i] = i >= window - 1 ? sum / window : Number.NaN
  }
  return ma
}

export function runBacktest(data: OHLCV[], cfg: BacktestConfig): BacktestResult {
  if (!data.length) {
    return {
      equityCurve: [],
      stats: { totalReturn: 0, cagr: 0, maxDrawdown: 0, volatility: 0, sharpe: 0 },
      trades: [],
    }
  }

  const equityCurve: EquityPoint[] = []
  const trades: TradePoint[] = []

  let cash = cfg.initialCapital
  let shares = 0

  const ma20 = cfg.strategy === "MA_CROSS" ? movingAverage(data, 20) : []
  const ma60 = cfg.strategy === "MA_CROSS" ? movingAverage(data, 60) : []

  let lastMonth = new Date(data[0].date).getMonth()

  const dailyReturns: number[] = []
  let prevEquity = cfg.initialCapital

  let rsiPeriod = 14
  const gains: number[] = []
  const losses: number[] = []

  for (let i = 0; i < data.length; i++) {
    const bar = data[i]
    const date = new Date(bar.date)

    if (cfg.strategy === "DCA") {
      const m = date.getMonth()
      if (m !== lastMonth) {
        lastMonth = m
        const amount = cfg.dcaMonthlyAmount ?? Math.max(0, cfg.initialCapital / 12)
        const invest = Math.min(amount, cash)
        if (invest > 0) {
          shares += invest / bar.close
          cash -= invest
        }
      }
    } else if (cfg.strategy === "BUY_HOLD") {
      if (i === 0 && cash > 0) {
        shares = cash / bar.close
        cash = 0
      }
    } else if (cfg.strategy === "MA_CROSS") {
      const m20 = ma20[i]
      const m60 = ma60[i]
      const prev20 = ma20[i - 1]
      const prev60 = ma60[i - 1]
      if (
        Number.isFinite(prev20) &&
        Number.isFinite(prev60) &&
        Number.isFinite(m20) &&
        Number.isFinite(m60)
      ) {
        if (prev20 <= prev60 && m20 > m60 && cash > 0) {
          shares += cash / bar.close
          cash = 0
        }
        if (prev20 >= prev60 && m20 < m60 && shares > 0) {
          cash += shares * bar.close
          shares = 0
        }
      }
    } else if (cfg.strategy === "RSI") {
      if (i > 0) {
        const change = bar.close - data[i - 1]!.close
        gains.push(Math.max(0, change))
        losses.push(Math.max(0, -change))
        if (gains.length > rsiPeriod) gains.shift()
        if (losses.length > rsiPeriod) losses.shift()
      }

      if (gains.length === rsiPeriod && losses.length === rsiPeriod) {
        const avgGain = gains.reduce((s, g) => s + g, 0) / rsiPeriod
        const avgLoss = losses.reduce((s, l) => s + l, 0) / rsiPeriod
        const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss
        const rsi = 100 - 100 / (1 + rs)

        if (rsi < 30 && cash > 0) {
          const qty = cash / bar.close
          trades.push({
            symbol: data[0]!.symbol ?? "",
            entryDate: bar.date,
            exitDate: bar.date,
            entryPrice: bar.close,
            exitPrice: bar.close,
            quantity: qty,
            pnl: 0,
          })
          shares += qty
          cash = 0
        } else if (rsi > 70 && shares > 0) {
          const value = shares * bar.close
          trades.push({
            symbol: data[0]!.symbol ?? "",
            entryDate: data[0]!.date,
            exitDate: bar.date,
            entryPrice: data[0]!.close,
            exitPrice: bar.close,
            quantity: shares,
            pnl: value - cfg.initialCapital,
          })
          cash += value
          shares = 0
        }
      }
    }

    const equity = cash + shares * bar.close
    if (i > 0 && prevEquity > 0) {
      dailyReturns.push((equity - prevEquity) / prevEquity)
    }
    prevEquity = equity

    equityCurve.push({
      date: bar.date,
      portfolioValue: equity,
      cash,
      shares,
    })
  }

  const values = equityCurve.map((p) => p.portfolioValue)
  const totalReturn = values[0] ? values[values.length - 1] / values[0] - 1 : 0

  const days =
    (new Date(data[data.length - 1].date).getTime() - new Date(data[0].date).getTime()) /
    (1000 * 60 * 60 * 24)

  const cagr = calcCAGR(values[0] ?? 0, values[values.length - 1] ?? 0, days)
  const maxDrawdown = calcMaxDrawdown(values)
  const volatility = calcVolatility(dailyReturns)
  const sharpe = calcSharpe(dailyReturns)

  return { equityCurve, stats: { totalReturn, cagr, maxDrawdown, volatility, sharpe }, trades }
}

