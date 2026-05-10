"use client"

import * as React from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceDot,
} from "recharts"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { MilestoneHit, YearlyPoint } from "@/utils/calcCompound"

type Props = {
  data: YearlyPoint[]
  milestones: MilestoneHit[]
}

function formatWan(v: number) {
  const wan = v / 10_000
  // 更易读：少于 10 万显示 1 位小数，否则整数
  return wan < 10 ? wan.toFixed(1) : wan.toFixed(0)
}

function formatWanWithUnit(v: number) {
  const wan = v / 10_000
  return `${wan.toLocaleString("zh-CN", { maximumFractionDigits: 2 })} 万`
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ dataKey?: string; value?: number }>
  label?: number
}) {
  if (!active || !payload?.length) return null
  const get = (key: string) =>
    payload.find((p) => p.dataKey === key)?.value ?? 0

  const principal = get("principal")
  const profit = get("profit")
  const total = get("total")

  return (
    <div className="rounded-lg border bg-popover/95 p-3 text-sm shadow-sm shadow-black/10">
      <div className="text-xs font-medium text-muted-foreground">第 {label} 年</div>
      <div className="mt-2 space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">本金</span>
          <span className="font-medium tabular-nums">{formatWanWithUnit(principal)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">累计收益</span>
          <span className="font-medium tabular-nums">{formatWanWithUnit(profit)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-muted-foreground">总资产</span>
          <span className="font-semibold tabular-nums">{formatWanWithUnit(total)}</span>
        </div>
      </div>
    </div>
  )
}

export function InvestmentChart({ data, milestones }: Props) {
  const fullscreenRef = React.useRef<HTMLDivElement | null>(null)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    const handler = () => {
      const el = fullscreenRef.current
      setIsFullscreen(Boolean(el && document.fullscreenElement === el))
    }
    document.addEventListener("fullscreenchange", handler)
    return () => document.removeEventListener("fullscreenchange", handler)
  }, [])

  const toggleFullscreen = async () => {
    const el = fullscreenRef.current
    if (!el) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await el.requestFullscreen()
  }

  const [range, setRange] = React.useState<[number, number]>([
    0,
    Math.max(0, data.length - 1),
  ])
  React.useEffect(() => {
    setRange([0, Math.max(0, data.length - 1)])
  }, [data.length])

  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null)
  const dragRef = React.useRef<{
    dragging: boolean
    startHoverIndex: number | null
    startRange: [number, number]
  }>({ dragging: false, startHoverIndex: null, startRange: [0, 0] })

  const clampRange = React.useCallback(
    (next: [number, number]) => {
      const max = Math.max(0, data.length - 1)
      const minWindow = Math.min(2, data.length || 0)
      let s = Math.min(max, Math.max(0, next[0]))
      let e = Math.min(max, Math.max(0, next[1]))
      if (s > e) [s, e] = [e, s]
      if (e - s + 1 < minWindow) {
        e = Math.min(max, s + minWindow - 1)
      }
      return [s, e] as [number, number]
    },
    [data.length]
  )

  const resetZoom = () => setRange([0, Math.max(0, data.length - 1)])

  const onWheelZoom = (e: React.WheelEvent) => {
    if (data.length < 3) return
    e.preventDefault()
    const direction = e.deltaY > 0 ? 1 : -1 // +: zoom out, -: zoom in
    const [s, t] = range
    const windowSize = t - s + 1
    const center = hoverIndex ?? Math.round((s + t) / 2)

    const factor = direction > 0 ? 1.15 : 0.85
    const nextSize = Math.max(2, Math.min(data.length, Math.round(windowSize * factor)))

    let ns = center - Math.floor(nextSize / 2)
    let ne = ns + nextSize - 1

    const max = data.length - 1
    if (ns < 0) {
      ns = 0
      ne = nextSize - 1
    }
    if (ne > max) {
      ne = max
      ns = max - nextSize + 1
    }
    setRange(clampRange([ns, ne]))
  }

  const beginDrag = () => {
    dragRef.current = {
      dragging: true,
      startHoverIndex: hoverIndex,
      startRange: range,
    }
  }

  const endDrag = () => {
    dragRef.current.dragging = false
  }

  const onDragMove = () => {
    const st = dragRef.current
    if (!st.dragging) return
    if (st.startHoverIndex === null || hoverIndex === null) return
    const delta = st.startHoverIndex - hoverIndex
    const [s, e] = st.startRange
    setRange(clampRange([s + delta, e + delta]))
  }

  return (
    <div ref={fullscreenRef}>
      {isFullscreen ? (
        <div className="fixed right-4 top-4 z-50">
          <Button variant="secondary" size="sm" onClick={toggleFullscreen}>
            退出全屏
          </Button>
        </div>
      ) : null}

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="text-base font-semibold tracking-tight">资产增长图</div>
            <div className="text-sm text-muted-foreground">
              鼠标滚轮缩放、拖拽平移；悬停查看任意年份资金状态；里程碑自动标记。
            </div>
          </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetZoom}>
                重置缩放
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="shrink-0"
              >
                {isFullscreen ? "退出全屏" : "全屏"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className={isFullscreen ? "p-4" : "h-[420px] p-4"}>
          <div
            className={isFullscreen ? "h-[calc(100vh-120px)]" : "h-full"}
            onWheel={onWheelZoom}
            onMouseDown={beginDrag}
            onMouseUp={endDrag}
            onMouseLeave={() => {
              endDrag()
              setHoverIndex(null)
            }}
          >
            {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 10, right: 16, bottom: 0, left: 0 }}
                onMouseMove={(s) => {
                  const idx =
                    typeof s.activeTooltipIndex === "number" ? s.activeTooltipIndex : null
                  setHoverIndex(idx)
                  onDragMove()
                }}
                onMouseUp={endDrag}
              >
                <defs>
                  <linearGradient id="gPrincipal" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                  <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={[
                    data[range[0]]?.year ?? 1,
                    data[range[1]]?.year ?? data[data.length - 1]?.year ?? 1,
                  ]}
                  allowDataOverflow
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(v) => `${v}年`}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(v) => formatWan(Number(v))}
                  stroke="hsl(var(--muted-foreground))"
                  width={78}
                  label={{
                    value: "单位：万",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Core series (areas) */}
                <Area
                  type="monotone"
                  dataKey="principal"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#gPrincipal)"
                  fillOpacity={1}
                  dot={false}
                  isAnimationActive
                  animationDuration={650}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#gProfit)"
                  fillOpacity={1}
                  dot={false}
                  isAnimationActive
                  animationDuration={650}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#60a5fa"
                  strokeWidth={2.5}
                  fill="url(#gTotal)"
                  fillOpacity={1}
                  dot={false}
                  isAnimationActive
                  animationDuration={650}
                />

                {/* Milestones */}
                {milestones.map((m) => (
                  <ReferenceDot
                    key={m.level}
                    x={m.year}
                    y={m.total}
                    r={5}
                    fill="hsl(var(--foreground))"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                    label={{
                      value: `${formatWan(m.level)}万 达成`,
                      position: "top",
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
