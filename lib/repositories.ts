import { supabase } from "@/lib/supabaseClient"

export type DbOrder = {
  id: string
  portfolio_id: string
  user_id: string
  symbol: string
  side: "BUY" | "SELL"
  type: "MARKET" | "LIMIT" | "STOP_LOSS" | "TAKE_PROFIT"
  quantity: number
  limit_price: number | null
  stop_price: number | null
  take_profit_price: number | null
  status: "NEW" | "WORKING" | "PARTIALLY_FILLED" | "FILLED" | "CANCELED" | "REJECTED"
  created_at: string
  filled_at: string | null
}

export async function ensureDefaultPortfolio(): Promise<string> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) throw new Error("未登录，无法使用持久化模拟盘")

  const { data, error } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  if (error && error.code !== "PGRST116") throw error

  if (data?.id) return data.id

  const { data: inserted, error: insertError } = await supabase
    .from("portfolios")
    .insert({
      user_id: user.id,
      name: "默认组合",
      base_currency: "CNY",
      initial_cash: 100000,
    })
    .select("id")
    .single()

  if (insertError || !inserted) throw insertError ?? new Error("创建默认组合失败")
  return inserted.id
}

export async function insertOrder(row: Omit<DbOrder, "id" | "created_at" | "filled_at">) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      portfolio_id: row.portfolio_id,
      user_id: row.user_id,
      symbol: row.symbol,
      side: row.side,
      type: row.type,
      quantity: row.quantity,
      limit_price: row.limit_price,
      stop_price: row.stop_price,
      take_profit_price: row.take_profit_price,
      status: row.status,
    })
    .select("*")
    .single()

  if (error || !data) throw error ?? new Error("创建订单失败")
  return data as DbOrder
}

