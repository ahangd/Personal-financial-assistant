"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { ensureDefaultPortfolio, insertOrder } from "@/lib/repositories"

import { getHistoricalData } from "@/lib/marketData"
import { applyOrder, calcPortfolioMetrics, type PortfolioState, type Side } from "@/lib/portfolioEngine"
import { RiskOrderPanel } from "@/components/RiskOrderPanel"

function formatMoneyWan(v: number) {
  return `${(v / 10_000).toLocaleString("zh-CN", { maximumFractionDigits: 2 })}万`
}

export default function PaperTradingPage() {
  const [symbol, setSymbol] = React.useState("600519")
  const [initialBalance] = React.useState(100_000)
  const [portfolio, setPortfolio] = React.useState<PortfolioState>({
    initialBalance,
    cash: initialBalance,
    positions: [],
    orderHistory: [],
  })
  const portfolioRef = React.useRef(portfolio)
  React.useEffect(() => {
    portfolioRef.current = portfolio
  }, [portfolio])

  const [side, setSide] = React.useState<Side>("BUY")
  const [price, setPrice] = React.useState<number>(0)
  const [qty, setQty] = React.useState<number>(100)

  // 拉最近一段数据用于“最新价”（收盘价）
  const today = new Date()
  const endDate = today.toISOString().slice(0, 10)
  const startDate = new Date(today.getTime() - 120 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  const histQuery = useQuery({
    queryKey: ["akshare", "latest", symbol, startDate, endDate, "qfq"],
    queryFn: () =>
      getHistoricalData({
        symbol,
        startDate,
        endDate,
        adjust: "qfq",
      }),
    enabled: Boolean(symbol),
  })

  const latestClose = React.useMemo(() => {
    const arr = histQuery.data ?? []
    return arr.length ? arr[arr.length - 1].close : 0
  }, [histQuery.data])

  React.useEffect(() => {
    if (latestClose > 0 && price === 0) setPrice(latestClose)
  }, [latestClose, price])

  const metrics = React.useMemo(() => {
    const prices = latestClose > 0 ? { [symbol]: latestClose } : {}
    return calcPortfolioMetrics(portfolio, prices)
  }, [latestClose, portfolio, symbol])

  const submit = () => {
    if (!symbol.trim()) return
    if (price <= 0 || qty <= 0) return
    void (async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError || !user) throw new Error("请先登录后再使用持久化模拟盘")

        const portfolioId = await ensureDefaultPortfolio()

        const order = {
          id: Math.random().toString(36).slice(2),
          symbol: symbol.trim(),
          side,
          price,
          quantity: qty,
          date: new Date().toISOString(),
        } as const

        const next = applyOrder(portfolioRef.current, order)
        setPortfolio(next)

        await insertOrder({
          portfolio_id: portfolioId,
          user_id: user.id,
          symbol: order.symbol,
          side: order.side,
          type: "MARKET",
          quantity: order.quantity,
          limit_price: null,
          stop_price: null,
          take_profit_price: null,
          status: "FILLED",
        })
      } catch (e) {
        alert((e as Error).message)
      }
    })()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回主页
        </Link>

        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">模拟盘（Paper Trading）</h1>
          <p className="text-sm text-muted-foreground">
            本地教育用模拟交易：使用 AkShare（前复权 qfq）获取最新收盘价估值，并记录订单/持仓变化。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <RiskOrderPanel
            symbol={symbol}
            latestPrice={latestClose}
            onSubmit={({ side: submitSide, type }) => {
              setSide(submitSide)
              submit()
            }}
          />

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">账户概览（单位：万）</div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
                <div>
                  <div className="text-muted-foreground">总资产</div>
                  <div className="mt-1 font-semibold tabular-nums">{formatMoneyWan(metrics.totalEquity)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">现金</div>
                  <div className="mt-1 font-semibold tabular-nums">{formatMoneyWan(portfolio.cash)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">持仓市值</div>
                  <div className="mt-1 font-semibold tabular-nums">{formatMoneyWan(metrics.positionsValue)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">累计收益率</div>
                  <div className="mt-1 font-semibold tabular-nums">
                    {(metrics.totalProfitPercent * 100).toFixed(2)}%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">持仓</div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {metrics.rows.length ? (
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-border/60 text-muted-foreground">
                      <tr>
                        <th className="py-2 pr-3 font-medium">代码</th>
                        <th className="py-2 pr-3 font-medium">股数</th>
                        <th className="py-2 pr-3 font-medium">成本</th>
                        <th className="py-2 pr-3 font-medium">现价</th>
                        <th className="py-2 pr-3 font-medium">浮盈亏</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.rows.map((r) => (
                        <tr key={r.symbol} className="border-b border-border/40">
                          <td className="py-2 pr-3">
                            <Link
                              href={`/stocks/${encodeURIComponent(r.symbol)}`}
                              className="text-primary underline-offset-2 hover:underline"
                            >
                              {r.symbol}
                            </Link>
                          </td>
                          <td className="py-2 pr-3 tabular-nums">{r.shares.toFixed(2)}</td>
                          <td className="py-2 pr-3 tabular-nums">{r.avgCost.toFixed(2)}</td>
                          <td className="py-2 pr-3 tabular-nums">{r.price.toFixed(2)}</td>
                          <td className="py-2 pr-3 tabular-nums">
                            <span className={r.profit >= 0 ? "text-emerald-600" : "text-red-600"}>
                              {formatMoneyWan(r.profit)}（{(r.profitPercent * 100).toFixed(2)}%）
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-sm text-muted-foreground">暂无持仓</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="text-sm font-semibold">订单历史</div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {portfolio.orderHistory.length ? (
                  portfolio.orderHistory.slice(0, 20).map((o) => (
                    <div key={o.id} className="flex items-center justify-between gap-4">
                      <div className="text-muted-foreground">
                        {o.side === "BUY" ? "买入" : "卖出"} {o.symbol} × {o.quantity} @ {o.price}
                      </div>
                      <div className="tabular-nums">{new Date(o.date).toLocaleString("zh-CN")}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">暂无订单</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

