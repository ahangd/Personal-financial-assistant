"use client"

import * as React from "react"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

type Props = {
  symbol?: string
  orderId?: string
}

type Journal = {
  id: string
  title: string
  content: string
  created_at: string
}

export function InvestmentJournal({ symbol, orderId }: Props) {
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [list, setList] = React.useState<Journal[]>([])

  const load = React.useCallback(async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) return

    let query = supabase
      .from("journal_entries")
      .select("id,title,content,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (symbol) query = query.eq("symbol", symbol)
    if (orderId) query = query.eq("order_id", orderId)

    const { data, error } = await query
    if (!error && data) setList(data as Journal[])
  }, [symbol, orderId])

  React.useEffect(() => {
    void load()
  }, [load])

  const submit = async () => {
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) throw userError

      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        symbol: symbol ?? null,
        order_id: orderId ?? null,
        title: title.trim(),
        content: content.trim(),
      })
      if (error) throw error
      setTitle("")
      setContent("")
      await load()
    } catch (e) {
      alert(`保存日志失败：${String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-sm font-semibold">投资日志</div>
        <div className="text-xs text-muted-foreground">
          记录你的交易原因、投资想法与事后复盘。
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="标题，例如：买入后估值与预期"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="写下你的交易逻辑、预期、风控计划，以及后续复盘记录。"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          <Button size="sm" onClick={submit} disabled={loading}>
            {loading ? "保存中..." : "保存日志"}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">最近日志</div>
          {list.length ? (
            <div className="space-y-2 text-xs">
              {list.map((j) => (
                <div key={j.id} className="rounded-md border border-border/60 p-2">
                  <div className="mb-1 font-semibold">{j.title}</div>
                  <div className="mb-1 whitespace-pre-wrap text-muted-foreground">{j.content}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {new Date(j.created_at).toLocaleString("zh-CN")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">暂无日志。</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

