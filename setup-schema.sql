-- Sunshine Booking System — full schema (idempotent)

CREATE TABLE IF NOT EXISTS public.staff (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT '',
  color TEXT DEFAULT '#f4f4f4',
  text_color TEXT DEFAULT '#555555',
  status TEXT DEFAULT 'on',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 60,
  type TEXT DEFAULT 'single',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  capacity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_date DATE NOT NULL,
  h INTEGER NOT NULL DEFAULT 10,
  m INTEGER NOT NULL DEFAULT 0,
  dur INTEGER NOT NULL DEFAULT 60,
  fname TEXT,
  lname TEXT,
  phone TEXT,
  name TEXT,
  svc TEXT,
  staff_col INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending',
  req BOOLEAN DEFAULT false,
  addon TEXT DEFAULT '',
  staff TEXT DEFAULT '',
  room TEXT DEFAULT '',
  intime TEXT DEFAULT '',
  outtime TEXT DEFAULT '',
  week_day INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  client_id INTEGER DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  tip NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS h INTEGER DEFAULT 10;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS m INTEGER DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS dur INTEGER DEFAULT 60;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS fname TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS lname TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS svc TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff_col INTEGER DEFAULT 1;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS req BOOLEAN DEFAULT false;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS staff TEXT DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS intime TEXT DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS outtime TEXT DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS week_day INTEGER DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_id INTEGER DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tip NUMERIC DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT '';

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['staff','services','addons','rooms','bookings'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_select', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_insert', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_update', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', t || '_delete', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (true)', t || '_select', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT WITH CHECK (true)', t || '_insert', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE USING (true)', t || '_update', t);
    EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE USING (true)', t || '_delete', t);
  END LOOP;
END $$;
