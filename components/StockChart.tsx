"use client"

import * as React from "react"
import * as echarts from "echarts"
import type { OHLCV } from "@/lib/marketData"

type Props = {
  data: OHLCV[]
}

function calcMA(values: number[], window: number): (number | null)[] {
  const out: (number | null)[] = []
  let sum = 0
  for (let i = 0; i < values.length; i++) {
    sum += values[i]!
    if (i >= window) sum -= values[i - window]!
    out[i] = i >= window - 1 ? sum / window : null
  }
  return out
}

export function StockChart({ data }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)

    const dates = data.map((d) => d.date)
    const ohlc = data.map((d) => [d.open, d.close, d.low, d.high])
    const closes = data.map((d) => d.close)

    const ma20 = calcMA(closes, 20)
    const ma60 = calcMA(closes, 60)

    chart.setOption({
      animation: false,
      tooltip: {
        trigger: "axis",
      },
      axisPointer: {
        link: [{ xAxisIndex: "all" }],
      },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0, 1],
          start: 50,
          end: 100,
        },
        {
          show: true,
          type: "slider",
          xAxisIndex: [0, 1],
          bottom: 0,
          start: 50,
          end: 100,
        },
      ],
      xAxis: {
        type: "category",
        data: dates,
        boundaryGap: false,
      },
      yAxis: {
        scale: true,
      },
      series: [
        {
          type: "candlestick",
          name: "K线",
          data: ohlc,
        },
        {
          type: "line",
          name: "MA20",
          data: ma20,
          smooth: true,
          showSymbol: false,
        },
        {
          type: "line",
          name: "MA60",
          data: ma60,
          smooth: true,
          showSymbol: false,
        },
      ],
    })

    const handler = () => {
      chart.resize()
    }
    window.addEventListener("resize", handler)

    return () => {
      window.removeEventListener("resize", handler)
      chart.dispose()
    }
  }, [data])

  return <div ref={ref} className="h-80 w-full" />
}

