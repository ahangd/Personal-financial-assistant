"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface MonthPoint {
  month: number;
  value: number;
}

function formatAxisValue(v: number): string {
  if (v >= 10000) return (v / 10000).toFixed(1) + "万";
  if (v >= 1000) return (v / 1000).toFixed(1) + "千";
  return v.toFixed(0);
}

export default function DCACalculatorPage() {
  const [principal, setPrincipal] = useState("0");
  const [monthly, setMonthly] = useState("1000");
  const [rate, setRate] = useState("8");
  const [months, setMonths] = useState("60");
  const [result, setResult] = useState<{
    total: number;
    principal: number;
    profit: number;
    initialPrincipal: number;
    monthlyTotal: number;
  } | null>(null);
  const [curveData, setCurveData] = useState<MonthPoint[]>([]);

  const calculate = () => {
    const p0 = parseFloat(principal) || 0;
    const m = parseFloat(monthly);
    const r = parseFloat(rate) / 100 / 12;
    const n = parseInt(months, 10);
    if (isNaN(m) || isNaN(r) || isNaN(n) || m <= 0 || n <= 0) return;
    const monthlyTotal = m * n;
    const totalPrincipal = p0 + monthlyTotal;
    let total = p0 * Math.pow(1 + r, n);
    const points: MonthPoint[] = [{ month: 0, value: p0 }];
    let balance = p0;
    for (let i = 1; i <= n; i++) {
      balance = (balance + m) * (1 + r);
      points.push({ month: i, value: balance });
    }
    total = balance;
    setResult({
      total,
      principal: totalPrincipal,
      profit: total - totalPrincipal,
      initialPrincipal: p0,
      monthlyTotal,
    });
    setCurveData(points);
  };

  const chartInfo = useMemo(() => {
    if (curveData.length < 2) return null;
    const values = curveData.map((d) => d.value);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const range = maxV - minV || 1;
    const width = 360;
    const height = 200;
    const padding = { top: 16, right: 16, bottom: 36, left: 52 };
    const innerW = width - padding.left - padding.right;
    const innerH = height - padding.top - padding.bottom;
    const points = curveData.map((d, i) => {
      const x = padding.left + (i / (curveData.length - 1)) * innerW;
      const y = padding.top + innerH - ((d.value - minV) / range) * innerH;
      return `${x},${y}`;
    });
    const totalMonths = curveData[curveData.length - 1]?.month ?? 0;
    const monthStep =
      totalMonths <= 12 ? 3 :
      totalMonths <= 24 ? 6 :
      totalMonths <= 60 ? 12 :
      totalMonths <= 120 ? 24 : Math.ceil(totalMonths / 5);
    const xTicks: number[] = [];
    for (let t = 0; t <= totalMonths; t += monthStep) xTicks.push(t);
    if (xTicks[xTicks.length - 1] !== totalMonths) xTicks.push(totalMonths);
    const yTickCount = 5;
    const yTicks: number[] = [];
    for (let i = 0; i <= yTickCount; i++) {
      yTicks.push(minV + (range * i) / yTickCount);
    }
    return {
      points: points.join(" "),
      minV,
      maxV,
      width,
      height,
      padding,
      innerW,
      innerH,
      xTicks,
      yTicks,
      totalMonths,
    };
  }, [curveData]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-12">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          返回工具
        </Link>
        <h1 className="text-2xl font-bold mb-2">定投收益模拟</h1>
        <p className="text-muted-foreground mb-8">
          可填写初始本金与每月定投金额，在假设年化收益率下模拟期末总资产。每月收益率 = 年化收益率 / 12。
        </p>

        <Card>
          <CardHeader>
            <h2 className="font-semibold">计算参数</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">初始本金（元）</label>
              <Input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="0（可不填）"
              />
              <p className="text-xs text-muted-foreground mt-1">
                期初一次性投入的金额，无则填 0
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">每月定投金额（元）</label>
              <Input
                type="number"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                placeholder="1000"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">预期年化收益率（%）</label>
              <Input
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="8"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">定投月数</label>
              <Input
                type="number"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                placeholder="60"
              />
            </div>
            <Button className="w-full" onClick={calculate}>
              计算
            </Button>
          </CardContent>
        </Card>

        {result !== null && (
          <>
            <Card className="mt-6">
              <CardHeader>
                <h2 className="font-semibold">模拟结果</h2>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-bold text-primary">
                  期末总资产：{result.total.toLocaleString("zh-CN", { maximumFractionDigits: 2 })} 元
                </p>
                <p className="text-sm text-muted-foreground">
                  累计投入：{result.principal.toLocaleString("zh-CN", { maximumFractionDigits: 2 })} 元
                  {result.initialPrincipal > 0 && (
                    <span className="ml-1">
                      （初始本金 {result.initialPrincipal.toLocaleString("zh-CN", { maximumFractionDigits: 2 })} 元
                      + 定投 {result.monthlyTotal.toLocaleString("zh-CN", { maximumFractionDigits: 2 })} 元）
                    </span>
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  预期收益：{result.profit.toLocaleString("zh-CN", { maximumFractionDigits: 2 })} 元
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  以上为理论模拟，实际收益会因市场波动而不同。历史业绩不代表未来表现。
                </p>
              </CardContent>
            </Card>

            {chartInfo && curveData.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <h2 className="font-semibold">资金变化曲线</h2>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <svg
                      viewBox={`0 0 ${chartInfo.width} ${chartInfo.height}`}
                      className="w-full min-w-[300px] max-w-full h-auto"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {chartInfo.yTicks.map((v, i) => {
                        const y =
                          chartInfo.padding.top +
                          chartInfo.innerH -
                          ((v - chartInfo.minV) / (chartInfo.maxV - chartInfo.minV || 1)) * chartInfo.innerH;
                        return (
                          <g key={`y-${i}`}>
                            <line
                              x1={chartInfo.padding.left}
                              y1={y}
                              x2={chartInfo.width - chartInfo.padding.right}
                              y2={y}
                              stroke="hsl(var(--border))"
                              strokeWidth="0.5"
                              strokeDasharray="2 2"
                            />
                            <text
                              x={chartInfo.padding.left - 6}
                              y={y + 4}
                              textAnchor="end"
                              className="text-[10px] fill-muted-foreground"
                            >
                              {formatAxisValue(v)}
                            </text>
                          </g>
                        );
                      })}
                      {chartInfo.xTicks.map((t, i) => {
                        const ratio = chartInfo.totalMonths > 0 ? t / chartInfo.totalMonths : 0;
                        const x = chartInfo.padding.left + ratio * chartInfo.innerW;
                        const label = t >= 12 ? `${Math.floor(t / 12)}年` : `${t}月`;
                        return (
                          <g key={`x-${i}`}>
                            <line
                              x1={x}
                              y1={chartInfo.height - chartInfo.padding.bottom}
                              x2={x}
                              y2={chartInfo.padding.top}
                              stroke="hsl(var(--border))"
                              strokeWidth="0.5"
                              strokeDasharray="2 2"
                            />
                            <text
                              x={x}
                              y={chartInfo.height - 8}
                              textAnchor="middle"
                              className="text-[10px] fill-muted-foreground"
                            >
                              {label}
                            </text>
                          </g>
                        );
                      })}
                      <polyline
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={chartInfo.points}
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    横轴：定投月数；纵轴：资产（元）
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
