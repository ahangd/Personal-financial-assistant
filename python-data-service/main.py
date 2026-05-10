from __future__ import annotations

import logging
from datetime import datetime
from typing import List, Literal

import akshare as ak
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Market Data Service (AkShare)", version="0.1.0")
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def to_yyyymmdd(value: str) -> str:
    value = value.strip()
    if "-" in value:
        return datetime.strptime(value, "%Y-%m-%d").strftime("%Y%m%d")
    datetime.strptime(value, "%Y%m%d")
    return value


def normalize_ashare_hist(df: pd.DataFrame) -> pd.DataFrame:
    column_aliases = {
        "日期": "date",
        "开盘": "open",
        "最高": "high",
        "最低": "low",
        "收盘": "close",
        "成交量": "volume",
    }

    missing = [source for source in column_aliases if source not in df.columns]
    if missing:
        raise ValueError(
            f"Unexpected dataframe columns. Missing={missing}; columns={list(df.columns)}"
        )

    normalized = df.rename(columns=column_aliases)[list(column_aliases.values())].copy()
    normalized["date"] = normalized["date"].astype(str).str[:10]

    for numeric_col in ("open", "high", "low", "close", "volume"):
        normalized[numeric_col] = normalized[numeric_col].astype(float)

    return normalized


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/ashare/historical")
def ashare_historical(
    symbol: str = Query(..., description="A-share symbol, e.g. 600519 / 000001"),
    startDate: str = Query(..., description="YYYY-MM-DD or YYYYMMDD"),
    endDate: str = Query(..., description="YYYY-MM-DD or YYYYMMDD"),
    adjust: Literal["qfq", "hfq", ""] = Query(
        "qfq", description="Adjustment mode: qfq / hfq / empty string"
    ),
):
    start = to_yyyymmdd(startDate)
    end = to_yyyymmdd(endDate)

    try:
        df = ak.stock_zh_a_hist(
            symbol=symbol,
            period="daily",
            start_date=start,
            end_date=end,
            adjust=adjust,
        )
    except Exception as exc:
        logger.exception(
            "AkShare request failed for symbol=%s start=%s end=%s adjust=%s",
            symbol,
            start,
            end,
            adjust,
        )
        raise HTTPException(status_code=502, detail=f"AkShare request failed: {exc}") from exc

    if df is None or df.empty:
        return []

    try:
        normalized = normalize_ashare_hist(df)
    except ValueError as exc:
        logger.exception("Unexpected AkShare dataframe columns: %s", list(df.columns))
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    out: List[dict] = normalized.to_dict(orient="records")
    return out
