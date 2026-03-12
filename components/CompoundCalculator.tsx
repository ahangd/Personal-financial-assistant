"use client"

import * as React from "react"

import { InvestmentInputs } from "@/components/InvestmentInputs"
import { InvestmentChart } from "@/components/InvestmentChart"
import { KpiCards } from "@/components/KpiCards"

import {
  calcCompound,
  EXAMPLE_INPUTS,
  type CompoundInputs,
} from "@/utils/calcCompound"

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(t)
  }, [value, delayMs])
  return debounced
}

export function CompoundCalculator({
  defaultValue,
}: {
  defaultValue?: CompoundInputs
}) {
  const [inputs, setInputs] = React.useState<CompoundInputs>(
    defaultValue ?? EXAMPLE_INPUTS
  )

  const debouncedInputs = useDebouncedValue(inputs, 180)

  const { chartData, milestones, kpis } = React.useMemo(() => {
    const base = calcCompound(debouncedInputs)
    return {
      chartData: base.yearly,
      milestones: base.milestones,
      kpis: base.kpis,
    }
  }, [debouncedInputs])

  return (
    <div className="w-full">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start">
          <InvestmentInputs value={inputs} onChange={setInputs} />
        </div>

        <div className="space-y-4">
          <KpiCards
            finalTotal={kpis.finalTotal}
            totalProfit={kpis.totalProfit}
            multiple={kpis.multiple}
            realPurchasingPower={kpis.realPurchasingPower}
          />
          <InvestmentChart
            data={chartData}
            milestones={milestones}
          />
        </div>
      </div>
    </div>
  )
}

