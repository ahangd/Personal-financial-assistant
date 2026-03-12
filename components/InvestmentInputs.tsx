"use client"

import * as React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

import type { CompoundInputs } from "@/utils/calcCompound"

type Props = {
  value: CompoundInputs
  onChange: (next: CompoundInputs) => void
}

function formatPercent(p: number) {
  return `${(p * 100).toFixed(2)}%`
}

function clamp(v: number, min: number, max: number) {
  if (!Number.isFinite(v)) return min
  return Math.min(max, Math.max(min, v))
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-sm font-medium">{label}</div>
          {hint ? <div className="text-xs text-muted-foreground">{hint}</div> : null}
        </div>
      </div>
      {children}
    </div>
  )
}

export function InvestmentInputs({ value, onChange }: Props) {
  const compoundsOptions = [
    { label: "每年 1 次（年复利）", value: 1 },
    { label: "每年 4 次（季度复利）", value: 4 },
    { label: "每年 12 次（按月复利）", value: 12 },
    { label: "每年 365 次（按日复利）", value: 365 },
  ]

  const set = (patch: Partial<CompoundInputs>) => onChange({ ...value, ...patch })

  const annualPct = value.annualReturnRate * 100
  const inflationPct = (value.inflationRate ?? 0) * 100

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="text-base font-semibold tracking-tight">参数设置</div>
        <div className="text-sm text-muted-foreground">
          左侧调整假设，右侧实时展示资产曲线（支持缩放查看任意年份）。
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Field label="初始本金" hint="一次性投入金额（元）">
          <Input
            type="number"
            min={0}
            value={value.initialInvestment}
            onChange={(e) =>
              set({ initialInvestment: clamp(Number(e.target.value), 0, 1e12) })
            }
          />
        </Field>

        <Field label="每月追加投资" hint="每月固定追加（元/月）">
          <Input
            type="number"
            min={0}
            value={value.monthlyContribution}
            onChange={(e) =>
              set({ monthlyContribution: clamp(Number(e.target.value), 0, 1e10) })
            }
          />
        </Field>

        <Field
          label="年化收益率"
          hint={`当前：${formatPercent(value.annualReturnRate)}（用于主预测与模拟均值）`}
        >
          <div className="grid grid-cols-[1fr_110px] items-center gap-3">
            <Slider
              value={[annualPct]}
              min={-10}
              max={30}
              step={0.1}
              onValueChange={([v]) => set({ annualReturnRate: clamp(v, -10, 30) / 100 })}
            />
            <Input
              type="number"
              step={0.1}
              value={annualPct}
              onChange={(e) =>
                set({ annualReturnRate: clamp(Number(e.target.value), -10, 30) / 100 })
              }
            />
          </div>
        </Field>

        <Field label="投资年限" hint="最长支持 60 年">
          <div className="grid grid-cols-[1fr_110px] items-center gap-3">
            <Slider
              value={[value.years]}
              min={1}
              max={60}
              step={1}
              onValueChange={([v]) => set({ years: Math.round(v) })}
            />
            <Input
              type="number"
              min={1}
              max={60}
              value={value.years}
              onChange={(e) => set({ years: clamp(Number(e.target.value), 1, 60) })}
            />
          </div>
        </Field>

        <Field label="复利频率" hint="名义复利次数（用于换算月度有效收益）">
          <select
            className="flex h-10 w-full rounded-lg border border-input bg-background/60 px-3.5 py-2 text-sm shadow-sm shadow-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            value={value.compoundsPerYear}
            onChange={(e) => set({ compoundsPerYear: Number(e.target.value) })}
          >
            {compoundsOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="通胀率（可选）" hint="用于计算实际购买力（扣除通胀）">
          <div className="grid grid-cols-[1fr_110px] items-center gap-3">
            <Slider
              value={[inflationPct]}
              min={0}
              max={15}
              step={0.1}
              onValueChange={([v]) => set({ inflationRate: clamp(v, 0, 15) / 100 })}
            />
            <Input
              type="number"
              step={0.1}
              value={inflationPct}
              onChange={(e) =>
                set({ inflationRate: clamp(Number(e.target.value), 0, 15) / 100 })
              }
            />
          </div>
        </Field>

        <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
          注：主预测曲线使用“按月有效收益率”逐月滚动计算，并按年汇总展示。
        </div>
      </CardContent>
    </Card>
  )
}

