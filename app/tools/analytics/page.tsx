"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { RequireAuth } from "@/components/auth/RequireAuth"
import { PortfolioAnalytics } from "@/components/PortfolioAnalytics"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <RequireAuth>
        <main className="mx-auto max-w-5xl px-4 py-10">
          <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回主页
        </Link>

        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">投资组合分析</h1>
          <p className="text-sm text-muted-foreground">
            从 Supabase 中读取你的模拟盘交易数据，计算权益曲线与关键风险收益指标。
          </p>
        </div>

        <PortfolioAnalytics />
        </main>
      </RequireAuth>
    </div>
  )
}

