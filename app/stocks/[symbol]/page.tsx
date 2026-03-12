"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { Navbar } from "@/components/navbar"
import { StockDetailPage } from "@/components/StockDetailPage"

export default function StockPage() {
  const params = useParams<{ symbol: string }>()
  const symbol = params?.symbol ?? ""

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link
          href="/tools/paper"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          返回模拟盘
        </Link>

        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">股票详情：{symbol}</h1>
          <p className="text-sm text-muted-foreground">
            查看该股票的 K 线走势、基本信息与后续可扩展的财务数据。
          </p>
        </div>

        {symbol ? (
          <StockDetailPage symbol={symbol} />
        ) : (
          <div className="text-sm text-muted-foreground">缺少股票代码。</div>
        )}
      </main>
    </div>
  )
}

