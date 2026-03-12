"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { CompoundCalculator } from "@/components/CompoundCalculator"

export default function CompoundCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回主页
        </Link>

        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            高级复利计算器（Compound Interest Calculator）
          </h1>
          <p className="text-sm text-muted-foreground">
            支持按月追加投资、复利频率换算、通胀购买力、以及 100 条蒙特卡洛未来路径模拟（波动率 15%）。
          </p>
        </div>

        <CompoundCalculator />
      </div>
    </div>
  )
}
