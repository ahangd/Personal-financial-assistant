import { NextRequest, NextResponse } from "next/server"

function mustGet(searchParams: URLSearchParams, key: string) {
  const v = searchParams.get(key)
  if (!v) throw new Error(`缺少参数 ${key}`)
  return v
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const symbol = mustGet(searchParams, "symbol")
    const startDate = mustGet(searchParams, "startDate")
    const endDate = mustGet(searchParams, "endDate")
    const adjust = searchParams.get("adjust") ?? "qfq"

    const base =
      process.env.MARKET_DATA_SERVICE_URL ??
      process.env.NEXT_PUBLIC_MARKET_DATA_SERVICE_URL ??
      "http://127.0.0.1:8000"

    const url = new URL("/api/ashare/historical", base)
    url.searchParams.set("symbol", symbol)
    url.searchParams.set("startDate", startDate)
    url.searchParams.set("endDate", endDate)
    url.searchParams.set("adjust", adjust)

    const resp = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })

    if (!resp.ok) {
      const text = await resp.text()
      return NextResponse.json(
        { error: `MarketData 服务错误: ${resp.status}`, details: text },
        { status: 502 }
      )
    }

    const data = await resp.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json(
      { error: "请求失败", details: String(e) },
      { status: 400 }
    )
  }
}

