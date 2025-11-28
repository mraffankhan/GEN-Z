-- Create ads table
create table if not exists public.ads (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  image_url text not null,
  redirect_url text,
  active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.ads enable row level security;

-- Create policy to allow read access for all users
create policy "Ads are viewable by everyone"
  on public.ads for select
  using ( true );

-- Insert some dummy ads for testing
insert into public.ads (title, image_url, redirect_url, active)
values 
  ('Summer Sale', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=800&q=80', 'https://example.com/sale', true),
  ('New Collection', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', 'https://example.com/new', true),
  ('Join Premium', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', 'https://example.com/premium', true);
