-- Autom8 MVP schema
-- Run this in Supabase's SQL editor (or any Postgres instance) before starting the bot.

create table merchants (
  id serial primary key,
  name text not null,
  is_open boolean not null default true,
  created_at timestamptz not null default now()
);

create table products (
  id serial primary key,
  merchant_id integer not null references merchants(id),
  name text not null,
  price numeric(10,2) not null,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

-- Global customer identity (not per-merchant) — see build sequence doc for why.
create table customers (
  id serial primary key,
  channel text not null,                 -- e.g. 'telegram'
  channel_user_id text not null,         -- Telegram chat_id, kept as text
  name text,
  phone text,
  delivery_address text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (channel, channel_user_id)
);

create table orders (
  id serial primary key,
  merchant_id integer not null references merchants(id),
  customer_id integer not null references customers(id),
  channel text not null,
  items jsonb not null,                  -- [{ "product_id":7, "name":"Adobo rice bowl", "qty":2, "price":120 }]
  total numeric(10,2) not null,
  status text not null default 'pending', -- pending | preparing | ready | completed | cancelled
  created_at timestamptz not null default now()
);

create table conversations (
  id serial primary key,
  merchant_id integer references merchants(id),
  customer_id integer references customers(id),
  channel text not null,
  direction text not null,               -- 'in' | 'out'
  message text not null,
  classified_as text,                    -- 'faq' | 'order' | 'unclassified' | null (set later, Phase 3)
  created_at timestamptz not null default now()
);

create table knowledge_entries (
  id serial primary key,
  merchant_id integer not null references merchants(id),
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

-- Seed one merchant + product so you have something to test against immediately.
insert into merchants (name) values ('Pilot Merchant') returning id;
-- Grab the id printed above and use it below, or just assume 1 on a fresh database:
insert into products (merchant_id, name, price) values (1, 'Adobo rice bowl', 120.00);
insert into products (merchant_id, name, price) values (1, 'Halo-halo', 90.00);
