import type { Side } from "@/lib/portfolioEngine"

export type OrderType = "MARKET" | "LIMIT" | "STOP_LOSS" | "TAKE_PROFIT"

export type RiskOrder = {
  id: string
  symbol: string
  side: Side
  type: OrderType
  quantity: number
  price?: number
  stopPrice?: number
  takeProfitPrice?: number
}

export function shouldTriggerOrder(order: RiskOrder, lastPrice: number): boolean {
  if (order.type === "MARKET") return true

  if (order.type === "LIMIT") {
    if (order.price == null) return false
    return order.side === "BUY" ? lastPrice <= order.price : lastPrice >= order.price
  }

  if (order.type === "STOP_LOSS") {
    if (order.stopPrice == null) return false
    return order.side === "BUY" ? lastPrice <= order.stopPrice : lastPrice >= order.stopPrice
  }

  if (order.type === "TAKE_PROFIT") {
    if (order.takeProfitPrice == null) return false
    return order.side === "BUY" ? lastPrice >= order.takeProfitPrice : lastPrice <= order.takeProfitPrice
  }

  return false
}

