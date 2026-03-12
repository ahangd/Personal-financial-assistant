"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useQuery } from "@tanstack/react-query"
import { getHistoricalData } from "@/lib/marketData"
import { runBacktest, type StrategyType } from "@/lib/backtestEngine"
import { BacktestEngineView } from "@/components/BacktestEngine"

function formatPct(v: number) {
  return `${(v * 100).toFixed(2)}%`
}

function formatWan(v: number) {
  return `${(v / 10_000).toLocaleString("zh-CN", { maximumFractionDigits: 2 })}万`
}

export default function BacktestPage() {
  const [symbol, setSymbol] = React.useState("600519")
  const [startDate, setStartDate] = React.useState("2018-01-01")
  const [endDate, setEndDate] = React.useState("2024-01-01")
  const [initialCapital, setInitialCapital] = React.useState(100000)
  const [strategy, setStrategy] = React.useState<StrategyType>("BUY_HOLD")
  const [dcaMonthlyAmount, setDcaMonthlyAmount] = React.useState(2000)

  const histQuery = useQuery({
    queryKey: ["akshare", "daily", symbol, startDate, endDate, "qfq"],
    queryFn: () =>
      getHistoricalData({
        symbol,
        startDate,
        endDate,
        adjust: "qfq",
      }),
    enabled: Boolean(symbol && startDate && endDate),
  })

  const backtest = React.useMemo(() => {
    if (!histQuery.data?.length) return null
    return runBacktest(histQuery.data, {
      strategy,
      startDate,
      endDate,
      initialCapital,
      dcaMonthlyAmount: strategy === "DCA" ? dcaMonthlyAmount : undefined,
    })
  }, [dcaMonthlyAmount, endDate, histQuery.data, initialCapital, startDate, strategy])

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
          <h1 className="text-2xl font-bold tracking-tight">历史回测（Backtesting）</h1>
          <p className="text-sm text-muted-foreground">
            使用 AkShare（前复权 qfq）拉取 A 股历史日线并回测策略。输入示例：600519。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <Card>
            <CardHeader className="space-y-1">
              <div className="text-sm font-semibold">策略配置</div>
              <div className="text-xs text-muted-foreground">
                需要先启动本地 Python 数据服务（端口 8000）。
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">股票代码</div>
                <Input value={symbol} onChange={(e) => setSymbol(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">开始日期</div>
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">结束日期</div>
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">初始资金（元）</div>
                <Input
                  type="number"
                  value={initialCapital}
                  onChange={(e) => setInitialCapital(Number(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">策略</div>
                <div className="flex flex-wrap gap-2">
                  {([
                    ["BUY_HOLD", "Buy & Hold"],
                    ["DCA", "定投 DCA"],
                    ["MA_CROSS", "MA20/MA60 均线"],
                  ] as const).map(([v, label]) => (
                    <Button
                      key={v}
                      type="button"
                      size="sm"
                      variant={strategy === v ? "default" : "outline"}
                      onClick={() => setStrategy(v)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>

              {strategy === "DCA" ? (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-muted-foreground">每月定投金额（元）</div>
                  <Input
                    type="number"
                    value={dcaMonthlyAmount}
                    onChange={(e) => setDcaMonthlyAmount(Number(e.target.value) || 0)}
                  />
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => histQuery.refetch()}
                >
                  重新拉取数据
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/tools/paper">去模拟盘</Link>
                </Button>
              </div>

              {histQuery.isError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-muted-foreground">
                  拉取失败：{String(histQuery.error)}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <div className="text-sm font-semibold">净值曲线与回测指标</div>
                <div className="text-xs text-muted-foreground">
                  {histQuery.isFetching
                    ? "正在拉取历史数据..."
                    : histQuery.data?.length
                      ? `已获取 ${histQuery.data.length} 根日线`
                      : "暂无数据"}
                </div>
              </CardHeader>
              <CardContent>
                <BacktestEngineView result={backtest} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

