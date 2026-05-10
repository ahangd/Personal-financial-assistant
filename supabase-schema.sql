-- Supabase schema aligned with the current app code
-- Covers:
-- 1) Supabase Auth user ownership
-- 2) Paper trading account persistence
-- 3) Order history
-- 4) Investment journal
-- 5) Optional future tables for fills and positions

create extension if not exists pgcrypto;

-- Paper trading accounts
create table if not exists public.paper_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  currency text not null default 'CNY',
  initial_balance numeric(18, 4) not null default 1000000 check (initial_balance >= 0),
  cash numeric(18, 4) not null default 1000000 check (cash >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_paper_accounts_user_id
  on public.paper_accounts (user_id);

-- Orders used by app/tools/paper and analytics
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.paper_accounts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  market text not null default 'CN',
  side text not null check (side in ('buy', 'sell')),
  order_type text not null check (order_type in ('market', 'limit', 'stop')),
  price numeric(18, 4),
  quantity numeric(18, 4) not null check (quantity > 0),
  status text not null default 'filled',
  created_at timestamptz not null default now(),
  filled_at timestamptz
);

create index if not exists idx_orders_user_id
  on public.orders (user_id);

create index if not exists idx_orders_account_id
  on public.orders (account_id);

create index if not exists idx_orders_created_at
  on public.orders (created_at desc);

-- Optional execution detail table for future use
create table if not exists public.fills (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  price numeric(18, 4) not null,
  quantity numeric(18, 4) not null check (quantity > 0),
  fee numeric(18, 4) not null default 0,
  filled_at timestamptz not null default now()
);

create index if not exists idx_fills_order_id
  on public.fills (order_id);

create index if not exists idx_fills_user_id
  on public.fills (user_id);

-- Optional position snapshot table for future use
create table if not exists public.positions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.paper_accounts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  symbol text not null,
  shares numeric(18, 4) not null default 0 check (shares >= 0),
  avg_cost numeric(18, 4) not null default 0 check (avg_cost >= 0),
  updated_at timestamptz not null default now(),
  unique (account_id, symbol)
);

create index if not exists idx_positions_user_id
  on public.positions (user_id);

-- Investment journal
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid references public.paper_accounts(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  symbol text,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_journal_entries_user_id
  on public.journal_entries (user_id);

create index if not exists idx_journal_entries_order_id
  on public.journal_entries (order_id);

-- Row Level Security
alter table public.paper_accounts enable row level security;
alter table public.orders enable row level security;
alter table public.fills enable row level security;
alter table public.positions enable row level security;
alter table public.journal_entries enable row level security;

-- Drop old policies if they exist so re-running this script is safe
drop policy if exists "paper_accounts_owner" on public.paper_accounts;
drop policy if exists "orders_owner" on public.orders;
drop policy if exists "fills_owner" on public.fills;
drop policy if exists "positions_owner" on public.positions;
drop policy if exists "journal_entries_owner" on public.journal_entries;

create policy "paper_accounts_owner"
  on public.paper_accounts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "orders_owner"
  on public.orders
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "fills_owner"
  on public.fills
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "positions_owner"
  on public.positions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "journal_entries_owner"
  on public.journal_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
