"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

type Props = {
  children: React.ReactNode
}

export function RequireAuth({ children }: Props) {
  const [loading, setLoading] = React.useState(true)
  const [hasUser, setHasUser] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!cancelled) {
          setHasUser(Boolean(user))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
        正在检查登录状态…
      </div>
    )
  }

  if (!hasUser) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium">请先登录 / 注册后再使用本功能</p>
          <p className="text-xs text-muted-foreground">
            为了安全与数据同步，我们需要先确认你的账户身份。
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/login")}>去登录 / 注册</Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            返回首页
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

