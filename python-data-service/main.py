from __future__ import annotations

from datetime import datetime
from typing import List, Literal, Optional

import akshare as ak
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Market Data Service (AkShare)", version="0.1.0")

# 本地开发允许跨域（前端也可直接访问）；正式建议走 Next.js 代理接口
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def to_yyyymmdd(d: str) -> str:
    # accept: YYYY-MM-DD or YYYYMMDD
    d = d.strip()
    if "-" in d:
        return datetime.strptime(d, "%Y-%m-%d").strftime("%Y%m%d")
    datetime.strptime(d, "%Y%m%d")  # validate
    return d


class OHLCV(dict):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: float


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/ashare/historical")
def ashare_historical(
    symbol: str = Query(..., description="A股代码，例如 600519 / 000001"),
    startDate: str = Query(..., description="YYYY-MM-DD 或 YYYYMMDD"),
    endDate: str = Query(..., description="YYYY-MM-DD 或 YYYYMMDD"),
    adjust: Literal["qfq", "hfq", ""] = Query("qfq", description="复权：qfq 前复权 / hfq 后复权 / 空字符串不复权"),
):
    start = to_yyyymmdd(startDate)
    end = to_yyyymmdd(endDate)

    df = ak.stock_zh_a_hist(
        symbol=symbol,
        period="daily",
        start_date=start,
        end_date=end,
        adjust=adjust,
    )

    if df is None or df.empty:
        return []

    # AkShare 常见列：日期 开盘 收盘 最高 最低 成交量
    col_map = {
        "日期": "date",
        "开盘": "open",
        "最高": "high",
        "最低": "low",
        "收盘": "close",
        "成交量": "volume",
    }

    for k in col_map.keys():
        if k not in df.columns:
            raise ValueError(f"Unexpected dataframe columns, missing: {k}. columns={list(df.columns)}")

    out: List[dict] = []
    for _, row in df.iterrows():
        out.append(
            {
                "date": str(row["日期"])[:10],
                "open": float(row["开盘"]),
                "high": float(row["最高"]),
                "low": float(row["最低"]),
                "close": float(row["收盘"]),
                "volume": float(row["成交量"]),
            }
        )
    return out

