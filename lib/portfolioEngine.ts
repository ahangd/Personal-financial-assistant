export type Side = "BUY" | "SELL"

export type Order = {
  id: string
  symbol: string
  side: Side
  price: number
  quantity: number
  date: string // ISO
}

export type Position = {
  symbol: string
  shares: number
  avgCost: number
}

export type PortfolioState = {
  initialBalance: number
  cash: number
  positions: Position[]
  orderHistory: Order[]
}

export function applyOrder(state: PortfolioState, order: Order): PortfolioState {
  const cost = order.price * order.quantity
  let cash = state.cash
  let positions = [...state.positions]

  if (order.side === "BUY") {
    if (cost > cash) throw new Error("现金不足")
    cash -= cost
    const idx = positions.findIndex((p) => p.symbol === order.symbol)
    if (idx === -1) {
      positions.push({ symbol: order.symbol, shares: order.quantity, avgCost: order.price })
    } else {
      const p = positions[idx]
      const newShares = p.shares + order.quantity
      const newAvg = (p.avgCost * p.shares + cost) / newShares
      positions[idx] = { ...p, shares: newShares, avgCost: newAvg }
    }
  } else {
    const idx = positions.findIndex((p) => p.symbol === order.symbol)
    if (idx === -1) throw new Error("无持仓可卖")
    const p = positions[idx]
    if (order.quantity > p.shares) throw new Error("卖出数量超过持仓")
    cash += cost
    const remaining = p.shares - order.quantity
    if (remaining <= 0) {
      positions = positions.filter((x) => x.symbol !== order.symbol)
    } else {
      positions[idx] = { ...p, shares: remaining }
    }
  }

  return {
    ...state,
    cash,
    positions,
    orderHistory: [order, ...state.orderHistory],
  }
}

export function calcPortfolioMetrics(
  state: PortfolioState,
  prices: Record<string, number>
) {
  const rows = state.positions.map((p) => {
    const price = prices[p.symbol] ?? p.avgCost
    const marketValue = price * p.shares
    const profit = (price - p.avgCost) * p.shares
    const profitPercent = p.avgCost > 0 ? (price - p.avgCost) / p.avgCost : 0
    return { ...p, price, marketValue, profit, profitPercent }
  })

  const positionsValue = rows.reduce((s, r) => s + r.marketValue, 0)
  const totalEquity = state.cash + positionsValue
  const totalProfit = rows.reduce((s, r) => s + r.profit, 0)
  const totalProfitPercent = state.initialBalance > 0 ? (totalEquity - state.initialBalance) / state.initialBalance : 0

  return { rows, positionsValue, totalEquity, totalProfit, totalProfitPercent }
}

