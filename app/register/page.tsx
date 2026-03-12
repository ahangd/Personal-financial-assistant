"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"

export default function RegisterPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirm = confirmPassword.trim()

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirm) return

    if (trimmedPassword.length < 6) {
      setError("密码长度至少为 6 位")
      return
    }

    if (trimmedPassword !== trimmedConfirm) {
      setError("两次输入的密码不一致")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: trimmedPassword,
      })

      if (error) {
        throw error
      }

      router.push("/login?registered=1")
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "注册失败，请稍后重试。"
      )
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    router.back()
  }

  const goToLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col px-4 py-10">
        <button
          type="button"
          onClick={goBack}
          className="mb-6 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          返回
        </button>

        <h1 className="mb-2 text-2xl font-bold tracking-tight">注册账户</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          创建你的账户，以便在 Supabase 中持久化保存你的模拟盘订单、持仓和投资日志。
        </p>

        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm font-medium">邮箱注册</div>
            <div className="text-xs text-muted-foreground">
              使用邮箱和密码注册一个新账户。注册成功后会自动跳转到登录页面。
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  邮箱地址
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  密码
                </label>
                <Input
                  type="password"
                  placeholder="至少 6 位"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  确认密码
                </label>
                <Input
                  type="password"
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading ||
                  !email.trim() ||
                  !password.trim() ||
                  !confirmPassword.trim()
                }
              >
                {loading ? "注册中…" : "注册"}
              </Button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>已经有账户？</span>
              <button
                type="button"
                onClick={goToLogin}
                className="text-xs font-medium text-primary hover:underline"
              >
                去登录
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

