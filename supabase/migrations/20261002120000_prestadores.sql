-- Cadastro de prestadores (formulário "Seja cuidador").
-- Só o servidor do site grava e lê esta tabela, usando a service role.
-- O navegador nunca acessa o banco diretamente.

create table public.prestadores (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'em_analise'
    check (status in ('em_analise', 'aprovado', 'recusado')),
  category text not null
    check (category in ('Cuidador', 'Pet shop', 'Veterinário', 'Banho e tosa', 'Loja de ração')),
  name text not null check (char_length(name) between 1 and 120),
  business text not null default '' check (char_length(business) <= 120),
  email text not null check (char_length(email) between 3 and 120),
  phone text not null check (char_length(phone) <= 120),
  crmv text not null default '' check (char_length(crmv) <= 120),
  cep text not null check (char_length(cep) <= 120),
  city text not null check (char_length(city) <= 120),
  address text not null default '' check (char_length(address) <= 120),
  region text not null check (char_length(region) <= 120),
  about text not null default '' check (char_length(about) <= 1000),
  services text[] not null check (cardinality(services) between 1 and 20),
  photo_path text
);

comment on table public.prestadores is
  'Cadastros enviados pelo formulário de prestadores, aguardando análise.';

create index prestadores_status_created_at_idx
  on public.prestadores (status, created_at desc);
create index prestadores_email_idx on public.prestadores (lower(email));

-- RLS ligado e sem políticas: anon e authenticated não leem nem gravam nada.
alter table public.prestadores enable row level security;

-- Fotos dos prestadores: bucket privado, só imagens de até 5 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'prestadores-fotos',
  'prestadores-fotos',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;
