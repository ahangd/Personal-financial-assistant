"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const justRegistered = searchParams.get("registered") === "1"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const valueEmail = email.trim()
    const valuePassword = password.trim()
    if (!valueEmail || !valuePassword) return

    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: valueEmail,
        password: valuePassword,
      })

      if (error) {
        throw error
      }

      setMessage("登录成功，正在跳转…")
      router.push("/")
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "登录失败，请稍后重试。"
      )
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    router.back()
  }

  const goToRegister = () => {
    router.push("/register")
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

        <h1 className="mb-2 text-2xl font-bold tracking-tight">登录账户</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          使用邮箱和密码登录；我们会在 Supabase 中持久化保存你的模拟盘订单、持仓和投资日志。
        </p>

        {justRegistered && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            注册成功，请使用刚刚设置的密码完成登录。
          </div>
        )}

        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm font-medium">邮箱密码登录</div>
            <div className="text-xs text-muted-foreground">
              请输入你注册时使用的邮箱和密码。
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
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              {message && (
                <p className="text-xs text-emerald-600">{message}</p>
              )}
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email.trim() || !password.trim()}
              >
                {loading ? "登录中…" : "登录"}
              </Button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>还没有账户？</span>
              <button
                type="button"
                onClick={goToRegister}
                className="text-xs font-medium text-primary hover:underline"
              >
                去注册
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const justRegistered = searchParams.get("registered") === "1"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) return
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: value,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })
      if (error) throw error
      setMessage("登录链接已发送到你的邮箱，请在 10 分钟内完成登录。")
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "发送登录邮件失败，请稍后重试。"
      )
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    router.back()
  }

  const goToRegister = () => {
    router.push("/register")
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

        <h1 className="mb-2 text-2xl font-bold tracking-tight">登录账户</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          使用邮箱一键登录；我们会在 Supabase 中持久化保存你的模拟盘订单、持仓和投资日志。
        </p>

        {justRegistered && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            注册成功，请使用刚刚的邮箱完成登录。
          </div>
        )}

        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm font-medium">邮箱登录</div>
            <div className="text-xs text-muted-foreground">
              我们会向你的邮箱发送一封一次性登录链接，无需密码。
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

              {message && (
                <p className="text-xs text-emerald-600">{message}</p>
              )}
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email.trim()}
              >
                {loading ? "发送中…" : "发送登录链接"}
              </Button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>还没有账户？</span>
              <button
                type="button"
                onClick={goToRegister}
                className="text-xs font-medium text-primary hover:underline"
              >
                去注册
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const justRegistered = searchParams.get("registered") === "1"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) return
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: value,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })
      if (error) throw error
      setMessage("登录链接已发送到你的邮箱，请在 10 分钟内完成登录。")
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "发送登录邮件失败，请稍后重试。"
      )
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    router.back()
  }

  const goToRegister = () => {
    router.push("/register")
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

        <h1 className="mb-2 text-2xl font-bold tracking-tight">登录账户</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          使用邮箱一键登录；我们会在 Supabase 中持久化保存你的模拟盘订单、持仓和投资日志。
        </p>

        {justRegistered && (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            注册成功，请使用刚刚的邮箱完成登录。
          </div>
        )}

        <Card>
          <CardHeader className="pb-3">
            <div className="text-sm font-medium">邮箱登录</div>
            <div className="text-xs text-muted-foreground">
              我们会向你的邮箱发送一封一次性登录链接，无需密码。
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

              {message && (
                <p className="text-xs text-emerald-600">{message}</p>
              )}
              {error && (
                <p className="text-xs text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email.trim()}
              >
                {loading ? "发送中…" : "发送登录链接"}
              </Button>
            </form>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>还没有账户？</span>
              <button
                type="button"
                onClick={goToRegister}
                className="text-xs font-medium text-primary hover:underline"
              >
                去注册
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

\"use client\"

import * as React from \"react\"
import { useRouter, useSearchParams } from \"next/navigation\"
import { Navbar } from \"@/components/navbar\"
import { Card, CardHeader, CardContent } from \"@/components/ui/card\"
import { Button } from \"@/components/ui/button\"
import { Input } from \"@/components/ui/input\"
import { supabase } from \"@/lib/supabaseClient\"

export default function LoginPage() {
  const [email, setEmail] = React.useState(\"\")
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  const justRegistered = searchParams.get(\"registered\") === \"1\"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim()
    if (!value) return
    setLoading(true)
    setMessage(null)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: value,
        options: {
          emailRedirectTo: window.location.origin,
        },
      })
      if (error) throw error
      setMessage(\"登录链接已发送到你的邮箱，请在 10 分钟内完成登录。\")
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : \"发送登录邮件失败，请稍后重试。\"
      )
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    router.back()
  }

  const goToRegister = () => {
    router.push(\"/register\")
  }

  return (
    <div className=\"min-h-screen bg-background\">
      <Navbar />
      <main className=\"mx-auto flex max-w-md flex-col px-4 py-10\">
        <button
          type=\"button\"
          onClick={goBack}
          className=\"mb-6 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground\"
        >
          返回
        </button>

        <h1 className=\"mb-2 text-2xl font-bold tracking-tight\">登录账户</h1>
        <p className=\"mb-4 text-sm text-muted-foreground\">
          使用邮箱一键登录；我们会在 Supabase 中持久化保存你的模拟盘订单、持仓和投资日志。
        </p>

        {justRegistered && (
          <div className=\"mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700\">
            注册成功，请使用刚刚的邮箱完成登录。
          </div>
        )}

        <Card>
          <CardHeader className=\"pb-3\">
            <div className=\"text-sm font-medium\">邮箱登录</div>
            <div className=\"text-xs text-muted-foreground\">
              我们会向你的邮箱发送一封一次性登录链接，无需密码。
            </div>
          </CardHeader>
          <CardContent>
            <form className=\"space-y-4\" onSubmit={handleSubmit}>
              <div className=\"space-y-1\">
                <label className=\"text-xs font-medium text-muted-foreground\">
                  邮箱地址
                </label>
                <Input
                  type=\"email\"
                  placeholder=\"you@example.com\"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete=\"email\"
                />
              </div>

              {message && (
                <p className=\"text-xs text-emerald-600\">{message}</p>
              )}
              {error && (
                <p className=\"text-xs text-destructive\">{error}</p>
              )}

              <Button
                type=\"submit\"
                className=\"w-full\"
                disabled={loading || !email.trim()}
              >
                {loading ? \"发送中…\" : \"发送登录链接\"}
              </Button>
            </form>

            <div className=\"mt-4 flex items-center justify-between text-xs text-muted-foreground\">
              <span>还没有账户？</span>
              <button
                type=\"button\"
                onClick={goToRegister}
                className=\"text-xs font-medium text-primary hover:underline\"
              >
                去注册
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

