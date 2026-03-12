-- Supabase schema for PaperTrading professional platform
-- 账户/组合
create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  base_currency text not null default 'CNY',
  initial_cash numeric(18, 4) not null,
  created_at timestamptz not null default now()
);

-- 订单
create type public.order_side as enum ('BUY', 'SELL');
create type public.order_type as enum ('MARKET', 'LIMIT', 'STOP_LOSS', 'TAKE_PROFIT');
create type public.order_status as enum ('NEW', 'WORKING', 'PARTIALLY_FILLED', 'FILLED', 'CANCELED', 'REJECTED');

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  side public.order_side not null,
  type public.order_type not null,
  quantity numeric(18, 4) not null check (quantity > 0),
  limit_price numeric(18, 4),
  stop_price numeric(18, 4),
  take_profit_price numeric(18, 4),
  status public.order_status not null default 'NEW',
  created_at timestamptz not null default now(),
  filled_at timestamptz
);

create index if not exists idx_orders_user on public.orders (user_id);
create index if not exists idx_orders_portfolio on public.orders (portfolio_id);

-- 成交明细
create table if not exists public.fills (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  price numeric(18, 4) not null,
  quantity numeric(18, 4) not null,
  fee numeric(18, 4) not null default 0,
  filled_at timestamptz not null default now()
);

create index if not exists idx_fills_order on public.fills (order_id);

-- 当前持仓快照（可选）
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  portfolio_id uuid not null references public.portfolios(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  shares numeric(18, 4) not null,
  avg_cost numeric(18, 4) not null,
  updated_at timestamptz not null default now(),
  unique (portfolio_id, symbol)
);

create index if not exists idx_positions_user on public.positions (user_id);

-- 投资日志
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  portfolio_id uuid references public.portfolios(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  symbol text,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_journal_user on public.journal_entries (user_id);

-- 公司/基本面缓存（可选）
create table if not exists public.stock_fundamentals (
  symbol text primary key,
  name text,
  sector text,
  industry text,
  exchange text,
  data jsonb,
  updated_at timestamptz not null default now()
);

-- RLS
alter table public.portfolios enable row level security;
alter table public.orders enable row level security;
alter table public.fills enable row level security;
alter table public.positions enable row level security;
alter table public.journal_entries enable row level security;

-- 仅允许用户访问自己的数据
create policy "portfolios_owner" on public.portfolios
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "orders_owner" on public.orders
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "fills_via_orders" on public.fills
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "positions_owner" on public.positions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "journal_owner" on public.journal_entries
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

