"use client"

import * as React from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { getHistoricalData, type OHLCV } from "@/lib/marketData"
import { StockChart } from "@/components/StockChart"
import { InvestmentJournal } from "@/components/InvestmentJournal"

type Props = {
  symbol: string
}

export function StockDetailPage({ symbol }: Props) {
  const [data, setData] = React.useState<OHLCV[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const today = new Date()
        const endDate = today.toISOString().slice(0, 10)
        const startDate = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10)
        const hist = await getHistoricalData({
          symbol,
          startDate,
          endDate,
          adjust: "qfq",
        })
        setData(hist)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    })()
  }, [symbol])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="text-sm font-semibold">股票概览：{symbol}</div>
          <div className="text-xs text-muted-foreground">
            最近一年日 K 线与均线（示例实现，可扩展公司信息与财务数据）。
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">加载中...</div>
          ) : error ? (
            <div className="text-xs text-red-600">加载失败：{error}</div>
          ) : !data.length ? (
            <div className="text-sm text-muted-foreground">暂无历史行情数据。</div>
          ) : (
            <StockChart data={data} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold">公司信息与基本面</div>
          <div className="text-xs text-muted-foreground">
            这里可以接入第三方 API 或 Supabase 中的 `stock_fundamentals` 表展示公司名称、行业、财务指标等。
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            占位内容：后续可扩展为详细的财务与业务分析卡片。
          </div>
        </CardContent>
      </Card>

      <InvestmentJournal symbol={symbol} />
    </div>
  )
}

