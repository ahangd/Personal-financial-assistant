import { NextRequest, NextResponse } from "next/server";

const DIFY_API_BASE = process.env.DIFY_API_BASE_URL || process.env.NEXT_PUBLIC_DIFY_API_BASE_URL;
const DIFY_API_KEY = process.env.DIFY_API_KEY;

export async function POST(req: NextRequest) {
  if (!DIFY_API_KEY || !DIFY_API_BASE) {
    return NextResponse.json(
      { error: "DIFY 未配置，请在 .env.local 中设置 DIFY_API_KEY 和 DIFY API Base URL" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { query, conversation_id = "", user = "default-user" } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "缺少 query 参数" }, { status: 400 });
    }

    const response = await fetch(`${DIFY_API_BASE.replace(/\/$/, "")}/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {},
        query: query.trim(),
        response_mode: "streaming",
        conversation_id,
        user,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json(
        { error: `DIFY API 错误: ${response.status}`, details: err },
        { status: response.status }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (e) {
    console.error("Chat API error:", e);
    return NextResponse.json(
      { error: "服务异常", details: String(e) },
      { status: 500 }
    );
  }
}
