"use client"

import * as React from "react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import type { BacktestResult } from "@/lib/backtestEngine"

function formatWan(v: number) {
  return `${(v / 10_000).toLocaleString("zh-CN", { maximumFractionDigits: 2 })}万`
}

function formatPct(v: number) {
  return `${(v * 100).toFixed(2)}%`
}

type Props = {
  result: BacktestResult | null
}

export function BacktestEngineView({ result }: Props) {
  if (!result) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        请先拉取数据并运行回测
      </div>
    )
  }

  const { equityCurve, stats } = result

  return (
    <div className="space-y-4">
      <div className="h-[360px]">
        {equityCurve.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityCurve}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={40} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatWan(Number(v))}
                width={84}
              />
              <Tooltip
                formatter={(value) =>
                  typeof value === "number"
                    ? formatWan(Number(value))
                    : String(value)
                }
              />
              <Line
                type="monotone"
                dataKey="portfolioValue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            暂无数据
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-5">
        <div>
          <div className="text-muted-foreground">总收益率</div>
          <div className="mt-1 font-semibold">
            {formatPct(stats.totalReturn)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">年化收益率</div>
          <div className="mt-1 font-semibold">
            {formatPct(stats.cagr)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">最大回撤</div>
          <div className="mt-1 font-semibold">
            {formatPct(stats.maxDrawdown)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">波动率</div>
          <div className="mt-1 font-semibold">
            {formatPct(stats.volatility)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">夏普比率</div>
          <div className="mt-1 font-semibold">
            {stats.sharpe.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}

