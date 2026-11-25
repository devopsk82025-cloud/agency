# Agency portal: Supabase setup

## 1. Configure browser credentials
Open `js/supabase.js` and replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_PUBLISHABLE_KEY` with the Project URL and publishable key from your Supabase project's API settings. Never use a `service_role` or secret key in browser code.

## 2. Create tables and signup trigger
Run this SQL in Supabase SQL Editor:

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'student' check (role in ('admin','student','company')),
  created_at timestamptz not null default now()
);
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references public.profiles(id),
  company_name text not null,
  website text,
  description text,
  created_at timestamptz not null default now()
);
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id),
  title text not null,
  description text,
  location text,
  salary text,
  status text not null default 'open' check(status in ('open','closed')),
  created_at timestamptz not null default now()
);
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id),
  student_id uuid not null references public.profiles(id),
  status text not null default 'pending' check(status in ('pending','shortlisted','rejected','selected')),
  applied_at timestamptz not null default now(),
  unique(job_id,student_id)
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id,full_name,email,role)
  values(new.id,new.raw_user_meta_data->>'full_name',new.email,
    case when new.raw_user_meta_data->>'role'='company' then 'company' else 'student' end);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();
```

## 3. Important before production
The included pages are a UI/authentication starter, not a complete recruitment application. Enable RLS on all four tables and add tested policies for each operation before adding real student or employer data. In particular, enforce admin-only access, company ownership of jobs and applicant lists, and student ownership of applications. Do not rely on hiding links or checking roles only in JavaScript. Do not expose service-role keys.

## 4. Create your first admin
Register a normal account through `register.html`, verify the email, then run this SQL as the trusted project owner, substituting your own email:

```sql
update public.profiles set role='admin' where email='YOUR_ADMIN_EMAIL';
```

Never add an admin choice to public registration.

## 5. Run locally
Serve this folder through VS Code Live Server or another local HTTP server. Do not open the pages as `file://` URLs. Test registration, email confirmation, login, role redirection and sign-out for student, company and admin accounts.
