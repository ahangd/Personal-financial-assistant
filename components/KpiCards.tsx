"use client"

import * as React from "react"
import { animate, motion, useMotionValue, useTransform } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"

type Props = {
  finalTotal: number
  totalProfit: number
  multiple: number
  realPurchasingPower?: number
}

function useAnimatedNumber(value: number, options?: { duration?: number }) {
  const mv = useMotionValue(value)
  React.useEffect(() => {
    const controls = animate(mv, value, { duration: options?.duration ?? 0.7 })
    return () => controls.stop()
  }, [mv, value, options?.duration])
  return mv
}

function formatCurrency(v: number) {
  return v.toLocaleString("zh-CN", { maximumFractionDigits: 0 })
}

function formatMultiple(v: number) {
  if (!Number.isFinite(v)) return "—"
  return `${v.toFixed(2)}x`
}

function KpiCard({
  title,
  value,
  sub,
  tone,
  formatter,
}: {
  title: string
  value: number
  sub?: string
  tone: "primary" | "profit" | "muted"
  formatter: (v: number) => string
}) {
  const mv = useAnimatedNumber(value, { duration: 0.8 })
  const display = useTransform(mv, (v) => formatter(v))

  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "profit"
        ? "text-emerald-500"
        : "text-foreground"

  return (
    <Card>
      <CardContent className="p-5">
        <div className="text-xs font-medium text-muted-foreground">{title}</div>
        <motion.div
          className={`mt-2 text-2xl font-semibold tracking-tight tabular-nums ${toneClass}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.span>{display}</motion.span>
        </motion.div>
        {sub ? <div className="mt-1 text-xs text-muted-foreground">{sub}</div> : null}
      </CardContent>
    </Card>
  )
}

export function KpiCards({ finalTotal, totalProfit, multiple, realPurchasingPower }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="最终资产"
        value={finalTotal}
        tone="primary"
        formatter={(v) => `${formatCurrency(v)} 元`}
      />
      <KpiCard
        title="总收益"
        value={totalProfit}
        tone="profit"
        formatter={(v) => `${formatCurrency(v)} 元`}
      />
      <KpiCard
        title="收益倍数"
        value={multiple}
        tone="muted"
        formatter={(v) => formatMultiple(v)}
      />
      <KpiCard
        title="实际购买力"
        value={realPurchasingPower ?? 0}
        tone="muted"
        formatter={(v) =>
          realPurchasingPower === undefined ? "—" : `${formatCurrency(v)} 元`
        }
        sub={realPurchasingPower === undefined ? "未启用通胀率" : "已扣除通胀影响"}
      />
    </div>
  )
}

