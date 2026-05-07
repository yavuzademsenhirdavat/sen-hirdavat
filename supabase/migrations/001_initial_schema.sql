-- Kategoriler
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories(id) on delete set null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Ürünler
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10,2) not null,
  compare_price numeric(10,2),
  stock int not null default 0,
  category_id uuid references categories(id) on delete set null,
  images text[] default '{}',
  sku text,
  barcode text,
  unit text default 'adet',
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Siparişler
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default 'SH-' || to_char(now(), 'YYYYMMDD') || '-' || floor(random()*10000)::text,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  shipping_address jsonb,
  status text not null default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled')),
  total numeric(10,2) not null,
  payment_method text not null default 'card' check (payment_method in ('card','whatsapp')),
  payment_id text,
  payment_status text default 'pending' check (payment_status in ('pending','paid','failed','refunded')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sipariş kalemleri
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  product_sku text,
  quantity int not null,
  unit_price numeric(10,2) not null,
  total_price numeric(10,2) not null
);

-- Admin kullanıcılar (Supabase Auth ile)
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz default now()
);

-- RLS Politikaları
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table admin_users enable row level security;

-- Herkes kategorileri okuyabilir
create policy "categories_public_read" on categories for select using (true);

-- Herkes aktif ürünleri okuyabilir
create policy "products_public_read" on products for select using (is_active = true);

-- Admin her şeyi yapabilir (service role)
create policy "admin_all_categories" on categories for all using (auth.role() = 'service_role');
create policy "admin_all_products" on products for all using (auth.role() = 'service_role');
create policy "admin_all_orders" on orders for all using (auth.role() = 'service_role');
create policy "admin_all_order_items" on order_items for all using (auth.role() = 'service_role');

-- Sipariş oluşturma (herkes)
create policy "orders_insert_public" on orders for insert with check (true);
create policy "order_items_insert_public" on order_items for insert with check (true);

-- Admin tablosu
create policy "admin_users_read" on admin_users for select using (auth.uid() = id);

-- Storage bucket (ürün görselleri)
insert into storage.buckets (id, name, public) values ('products', 'products', true);
create policy "products_images_public" on storage.objects for select using (bucket_id = 'products');
create policy "products_images_admin" on storage.objects for insert with check (bucket_id = 'products');

-- Slug otomatik güncelleme
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

-- İndeksler
create index products_category_idx on products(category_id);
create index products_slug_idx on products(slug);
create index products_active_idx on products(is_active);
create index orders_status_idx on orders(status);
create index categories_slug_idx on categories(slug);
