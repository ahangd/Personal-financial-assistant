# 精美的 Shadcn UI 落地页

一个使用 Next.js、Tailwind CSS、Shadcn UI 和 Shadcn UI Blocks 构建的现代化、响应式落地页模板。

## 演示

[在线演示](https://shadcn-ui.botbio.site)


## 特性

- 🎨 现代简约的设计风格
- 📱 完全响应式布局
- 🎯 基于 Next.js 15 构建
- 💅 使用 Tailwind CSS `3.4` 和 `4.0` 样式
- 🧩 基于 [Shadcn UI](https://ui.shadcn.com) 和 [Shadcn UI Blocks](https://shadcnui-blocks.com) 构建
- 🌙 支持深色模式

## 开始使用

1. 克隆仓库：

```bash
git clone https://github.com/akash3444/shadcn-ui-landing-page.git
cd shadcn-ui-landing-page
```

2. 使用 Tailwind CSS v4.0：

- 确保使用 Node.js 20 或更高版本
- 切换到 tailwind-v4 分支：

```bash
git checkout tailwind-v4
```

3. 安装依赖：

```bash
npm install
```

4. 启动开发服务器：

```bash
npm run dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 自定义

1. 替换占位图片为您自己的内容
2. 修改组件中的文本和样式以匹配您的品牌和消息
3. 根据需要添加您自己的功能和部分

## 更新记录

### 2026-03-11（高级复利计算器）

- **新增高级复利计算器页面**：访问路径为 `/tools/compound`，支持按月追加投资、复利频率、通胀购买力、KPI 指标卡片与资产增长图联动展示。
- **资产增长图增强**：
  - **全屏模式**：支持进入/退出全屏，并在全屏状态提供独立悬浮“退出全屏”按钮。
  - **鼠标缩放与平移**：滚轮缩放、拖拽平移，支持查看任意年份的资金状态（配合 Hover Tooltip）。
  - **单位统一**：图表（纵轴、Tooltip、里程碑标记）资金单位统一为 **“万”**，并优化纵轴宽度避免数值遮挡。
  - **横轴单位**：横轴年份显示从 `y` 调整为 `年`。
- **功能收敛**：
  - **移除“定投收益模拟功能”**（含相关入口与图表模拟路径展示）。
  - 打开“理财工具”页面（`/tools`）将 **直接跳转** 到复利计算器详情页（`/tools/compound`）。
  - 复利详情页“返回工具”按钮已改为 **返回主页**（`/`）。

  


## Python 行情数据服务（AkShare）

本项目内置一个基于 FastAPI + AkShare 的本地行情数据服务，目录为 `python-data-service`，供前端回测 / 模拟盘调用。

### 启动步骤（Windows / PowerShell）

```bash
cd python-data-service
python -m venv .venv             # 仅首次需要
.\.venv\Scripts\activate
pip install -r requirements.txt  # 仅首次或依赖变更时需要
uvicorn main:app --reload --port 8000
```

服务启动后，可通过以下方式验证：

- **健康检查**：在浏览器访问 `http://127.0.0.1:8000/api/health`，若返回 `{"ok": true}` 则表示服务正常。
- **历史数据示例接口**：

  ```text
  http://127.0.0.1:8000/api/ashare/historical?symbol=600519&startDate=2018-01-01&endDate=2024-01-01&adjust=qfq
  ```

## 为什么选择这个模板？

这个项目是一个落地页的基础模板。它使用 Next.js、Tailwind CSS、Shadcn UI 和 Shadcn UI Blocks 构建。这是一个很好的落地页起点。您可以根据需要自定义内容和媒体文件。它不是一个完整的落地页解决方案，而是作为落地页开发的起点。
