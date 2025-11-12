-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  zip_code text,
  user_type text check (user_type in ('owner', 'caregiver')),
  bio text,
  avatar_url text,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create pets table
create table pets (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  breed text,
  age integer,
  special_needs text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create caregiver_profiles table (extended info for caregivers)
create table caregiver_profiles (
  id uuid references profiles(id) on delete cascade primary key,
  services text[] default '{}',
  availability text,
  experience_years integer,
  rating decimal(3,2) default 0.0,
  total_reviews integer default 0,
  location_lat decimal(10,8),
  location_lng decimal(11,8),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create bookings table
create table bookings (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) not null,
  caregiver_id uuid references profiles(id) not null,
  pet_id uuid references pets(id) not null,
  service_type text not null,
  booking_date date not null,
  start_time time not null,
  duration_hours integer not null,
  special_requests text,
  status text check (status in ('pending', 'accepted', 'declined', 'completed', 'cancelled')) default 'pending',
  meet_and_greet boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) not null,
  receiver_id uuid references profiles(id) not null,
  booking_id uuid references bookings(id),
  content text not null,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  reviewer_id uuid references profiles(id) not null,
  reviewee_id uuid references profiles(id) not null,
  booking_id uuid references bookings(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(booking_id, reviewer_id)
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table pets enable row level security;
alter table caregiver_profiles enable row level security;
alter table bookings enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Pets policies
create policy "Pet owners can view their pets"
  on pets for select
  using (auth.uid() = owner_id);

create policy "Pet owners can insert their pets"
  on pets for insert
  with check (auth.uid() = owner_id);

create policy "Pet owners can update their pets"
  on pets for update
  using (auth.uid() = owner_id);

create policy "Pet owners can delete their pets"
  on pets for delete
  using (auth.uid() = owner_id);

-- Caregiver profiles policies
create policy "Caregiver profiles are viewable by everyone"
  on caregiver_profiles for select
  using (true);

create policy "Caregivers can update own profile"
  on caregiver_profiles for update
  using (auth.uid() = id);

create policy "Caregivers can insert own profile"
  on caregiver_profiles for insert
  with check (auth.uid() = id);

-- Bookings policies
create policy "Users can view their bookings"
  on bookings for select
  using (auth.uid() = owner_id or auth.uid() = caregiver_id);

create policy "Owners can create bookings"
  on bookings for insert
  with check (auth.uid() = owner_id);

create policy "Users can update their bookings"
  on bookings for update
  using (auth.uid() = owner_id or auth.uid() = caregiver_id);

-- Messages policies
create policy "Users can view their messages"
  on messages for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can send messages"
  on messages for insert
  with check (auth.uid() = sender_id);

-- Reviews policies
create policy "Reviews are viewable by everyone"
  on reviews for select
  using (true);

create policy "Users can create reviews for completed bookings"
  on reviews for insert
  with check (
    auth.uid() = reviewer_id and
    exists (
      select 1 from bookings
      where id = booking_id
      and status = 'completed'
      and (owner_id = auth.uid() or caregiver_id = auth.uid())
    )
  );

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

create trigger update_bookings_updated_at before update on bookings
  for each row execute procedure update_updated_at_column();
