# Python 行情数据服务（AkShare）

用于本地开发：通过 AkShare 提供 A 股历史日线（前复权 qfq 等），供 Next.js 回测/模拟盘调用。

## 安装与启动

```bash
cd python-data-service
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

健康检查：`http://127.0.0.1:8000/api/health`

历史数据接口示例：

`/api/ashare/historical?symbol=600519&startDate=2018-01-01&endDate=2024-01-01&adjust=qfq`

返回：

```json
[
  {"date":"2018-01-02","open":...,"high":...,"low":...,"close":...,"volume":...}
]
```

