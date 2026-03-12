 "use client"

import * as React from "react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"
import {
  calcTotalReturn,
  calcCAGRFromSnapshots,
  calcMaxDrawdownFromSnapshots,
  calcSharpeFromSnapshots,
  calcPnlBySymbol,
  type PortfolioSnapshot,
  type Trade,
} from "@/lib/metrics"

type EquityPoint = {
  date: string
  equity: number
}

const COLORS = ["#0ea5e9", "#22c55e", "#eab308", "#a855f7", "#f97316", "#ef4444"]

async function fetchEquitySnapshots(): Promise<PortfolioSnapshot[]> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) return []

  // 简化版本：以 orders 表的 filled_at 为时间，粗略累积 PnL 近似权益曲线
  const { data, error } = await supabase
    .from("orders")
    .select("created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  if (error || !data?.length) return []

  // 目前没有真实权益快照表，这里先用“等步长 + 初始 10w”占位，方便前端联调
  const base = 100000
  return data.map((row, idx) => ({
    date: row.created_at,
    equity: base * (1 + idx * 0.01),
  }))
}

async function fetchTrades(): Promise<Trade[]> {
  // 占位：后续可由 fills/订单恢复 round-trip 交易
  return []
}

export function PortfolioAnalytics() {
  const [snapshots, setSnapshots] = React.useState<PortfolioSnapshot[]>([])
  const [trades, setTrades] = React.useState<Trade[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    void (async () => {
      try {
        setLoading(true)
        const [s, t] = await Promise.all([fetchEquitySnapshots(), fetchTrades()])
        setSnapshots(s)
        setTrades(t)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const equityData: EquityPoint[] = snapshots.map((s) => ({
    date: new Date(s.date).toISOString().slice(0, 10),
    equity: s.equity,
  }))

  const totalReturn = calcTotalReturn(snapshots)
  const cagr = calcCAGRFromSnapshots(snapshots)
  const maxDD = calcMaxDrawdownFromSnapshots(snapshots)
  const sharpe = calcSharpeFromSnapshots(snapshots)

  const pnlBySymbol = calcPnlBySymbol(trades)
  const pnlPieData = Object.entries(pnlBySymbol).map(([symbol, value]) => ({
    name: symbol,
    value,
  }))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="text-sm font-semibold">投资组合分析</div>
          <div className="text-xs text-muted-foreground">
            基于 Supabase 中的订单/交易数据计算权益曲线与收益指标。
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">加载中...</div>
          ) : error ? (
            <div className="text-xs text-red-600">加载失败：{error}</div>
          ) : !snapshots.length ? (
            <div className="text-sm text-muted-foreground">暂无数据，可先在模拟盘中完成几笔交易。</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
              <div className="space-y-4">
                <div className="text-xs font-medium text-muted-foreground">权益曲线</div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={equityData}>
                      <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={40} />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) =>
                          `${(Number(v) / 10_000).toLocaleString("zh-CN", {
                            maximumFractionDigits: 2,
                          })}万`
                        }
                      />
                      <Tooltip
                        formatter={(value) =>
                          typeof value === "number"
                            ? `${(value / 10_000).toLocaleString("zh-CN", {
                                maximumFractionDigits: 2,
                              })}万`
                            : String(value)
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="equity"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="font-medium text-muted-foreground">关键指标</div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">总收益率</span>
                    <span className="font-semibold">
                      {(totalReturn * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">年化收益率</span>
                    <span className="font-semibold">
                      {(cagr * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">最大回撤</span>
                    <span className="font-semibold">
                      {(maxDD * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">夏普比率</span>
                    <span className="font-semibold">{sharpe.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold">收益来源与持仓分布</div>
          <div className="text-xs text-muted-foreground">
            每只股票对组合收益的贡献与当前持仓分布（占位实现，后续可与实时持仓对接）。
          </div>
        </CardHeader>
        <CardContent>
          {pnlPieData.length ? (
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
              <div className="h-52 w-52">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pnlPieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {pnlPieData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={COLORS[index % COLORS.length] ?? COLORS[0]!}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1 text-xs">
                {pnlPieData.map((p) => (
                  <div key={p.name} className="flex justify-between gap-4">
                    <span className="text-muted-foreground">{p.name}</span>
                    <span
                      className={
                        p.value >= 0 ? "font-semibold text-emerald-600" : "font-semibold text-red-600"
                      }
                    >
                      {p.value.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">暂无可用的收益分布数据。</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

