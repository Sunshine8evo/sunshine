-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

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

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "bookings_select" ON public.bookings;
DROP POLICY IF EXISTS "bookings_insert" ON public.bookings;
DROP POLICY IF EXISTS "bookings_update" ON public.bookings;
DROP POLICY IF EXISTS "bookings_delete" ON public.bookings;

CREATE POLICY "bookings_select" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_update" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "bookings_delete" ON public.bookings FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- If table already exists, add checkout columns:
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tip NUMERIC DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT '';
