"use client"

import * as React from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Side } from "@/lib/portfolioEngine"
import type { OrderType } from "@/lib/riskEngine"

type Props = {
  symbol: string
  latestPrice: number
  onSubmit: (params: {
    side: Side
    type: OrderType
    price: number
    quantity: number
    stopPrice?: number
    takeProfitPrice?: number
  }) => void
}

export function RiskOrderPanel({ symbol, latestPrice, onSubmit }: Props) {
  const [side, setSide] = React.useState<Side>("BUY")
  const [type, setType] = React.useState<OrderType>("MARKET")
  const [price, setPrice] = React.useState<number>(latestPrice || 0)
  const [qty, setQty] = React.useState<number>(100)
  const [stopPrice, setStopPrice] = React.useState<number | undefined>()
  const [takeProfitPrice, setTakeProfitPrice] = React.useState<number | undefined>()

  React.useEffect(() => {
    if (!price && latestPrice > 0) setPrice(latestPrice)
  }, [latestPrice, price])

  const submit = () => {
    if (!symbol.trim()) return
    if (qty <= 0) return
    const finalPrice = type === "MARKET" ? latestPrice : price
    if (!finalPrice || finalPrice <= 0) return

    onSubmit({
      side,
      type,
      price: finalPrice,
      quantity: qty,
      stopPrice,
      takeProfitPrice,
    })
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="text-sm font-semibold">下单（含风控）</div>
        <div className="text-xs text-muted-foreground">
          最新价：{latestPrice ? `${latestPrice} 元` : "—"}，支持市价/限价与止损止盈。
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">股票代码</div>
          <Input value={symbol} readOnly />
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant={side === "BUY" ? "default" : "outline"} onClick={() => setSide("BUY")}>
            买入
          </Button>
          <Button size="sm" variant={side === "SELL" ? "default" : "outline"} onClick={() => setSide("SELL")}>
            卖出
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["MARKET", "LIMIT", "STOP_LOSS", "TAKE_PROFIT"] as const).map((t) => (
            <Button
              key={t}
              type="button"
              size="xs"
              variant={type === t ? "default" : "outline"}
              onClick={() => setType(t)}
            >
              {t === "MARKET" && "市价"}
              {t === "LIMIT" && "限价"}
              {t === "STOP_LOSS" && "止损单"}
              {t === "TAKE_PROFIT" && "止盈单"}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {type !== "MARKET" && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">价格（元）</div>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
              />
            </div>
          )}
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">数量（股）</div>
            <Input
              type="number"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">止损价</div>
            <Input
              type="number"
              value={stopPrice ?? ""}
              onChange={(e) =>
                setStopPrice(e.target.value ? Number(e.target.value) || 0 : undefined)
              }
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">止盈价</div>
            <Input
              type="number"
              value={takeProfitPrice ?? ""}
              onChange={(e) =>
                setTakeProfitPrice(
                  e.target.value ? Number(e.target.value) || 0 : undefined
                )
              }
            />
          </div>
        </div>

        <Button className="w-full" onClick={submit}>
          提交订单
        </Button>
      </CardContent>
    </Card>
  )
}

