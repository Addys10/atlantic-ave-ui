-- Atlantic Eshop — Supabase schema

create table products (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description_html text not null default '',
  price         numeric(10,2) not null,
  images        text[] not null default '{}',
  category      text not null default 'Oblečení',
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

create table product_variants (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size       text not null,
  stock      integer not null default 0,
  created_at timestamptz not null default now(),
  unique(product_id, size)
);

create table orders (
  id                uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  status            text not null default 'pending',
  total             integer not null, -- haléře (CZK × 100)
  shipping          integer not null,
  customer_email    text,
  customer_name     text,
  shipping_address  jsonb,
  created_at        timestamptz not null default now()
);

create table order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid not null references product_variants(id),
  size       text not null,
  quantity   integer not null,
  price      integer not null -- haléře
);

-- RLS: products and variants are publicly readable
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public products read"
  on products for select using (active = true);

create policy "Public variants read"
  on product_variants for select using (true);

-- Atomic stock decrement — called by the Stripe webhook after a successful payment.
-- Uses greatest(0, ...) to prevent stock going negative.
create or replace function decrement_stock(p_variant_id uuid, p_qty integer)
returns void language sql security definer as $$
  update product_variants
  set stock = greatest(0, stock - p_qty)
  where id = p_variant_id;
$$;
