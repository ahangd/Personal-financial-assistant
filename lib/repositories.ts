import { supabase } from "@/lib/supabaseClient"

export type DbOrder = {
  id: string
  account_id: string
  symbol: string
  market: string | null
  side: "buy" | "sell" | null
  order_type: "market" | "limit" | "stop" | null
  price: number | null
  quantity: number | null
  status: string | null
  created_at: string
}

export async function ensureDefaultPortfolio(): Promise<string> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) throw new Error("未登录，无法使用持久化模拟盘")

  const { data, error } = await supabase
    .from("paper_accounts")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  if (error && error.code !== "PGRST116") throw error

  if (data?.id) return data.id

  const { data: inserted, error: insertError } = await supabase
    .from("paper_accounts")
    .insert({
      user_id: user.id,
      name: "Paper Trading Account",
      currency: "CNY",
      initial_balance: 1_000_000,
      cash: 1_000_000,
    })
    .select("id")
    .single()

  if (insertError || !inserted) throw insertError ?? new Error("创建默认组合失败")
  return inserted.id
}

export async function insertOrder(row: Omit<DbOrder, "id" | "created_at">) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) throw userError ?? new Error("未登录，无法创建订单")

  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      account_id: row.account_id,
      symbol: row.symbol,
      market: row.market ?? "CN",
      side: row.side,
      order_type: row.order_type,
      price: row.price,
      quantity: row.quantity,
      status: row.status ?? "filled",
    })
    .select("*")
    .single()

  if (error || !data) throw error ?? new Error("创建订单失败")
  return data as DbOrder
}

