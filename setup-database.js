/**
 * Sunshine Booking System — Supabase database setup
 * Creates tables (if missing), enables RLS, and seeds sample data.
 *
 * Uses SUPABASE_URL + SUPABASE_KEY for data operations.
 * For DDL (CREATE TABLE), set SUPABASE_DB_PASSWORD or DATABASE_URL.
 */

import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bjzhmdpuzfbpkvohntjx.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqemhtZHB1emZicGt2b2hudGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTMyNTEsImV4cCI6MjA5NTU2OTI1MX0.9TkTHUbwFY7MbL6yrv32-5mJfjkVk04TV6QX8LnpQnE';

const PROJECT_REF = 'bjzhmdpuzfbpkvohntjx';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SCHEMA_SQL = `
-- staff
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

-- services
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 60,
  type TEXT DEFAULT 'single',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- addons
CREATE TABLE IF NOT EXISTS public.addons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- rooms
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  capacity INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- bookings
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

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS tip NUMERIC DEFAULT 0;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT '';

-- RLS
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
`;

const SEED_STAFF = [
  { name: 'Pam', full_name: 'Pamrin Suksong', role: 'Massage Therapist', color: '#fdf0f3', text_color: '#8a1a30', status: 'on', sort_order: 1 },
  { name: 'Noon', full_name: 'Nuchnat Meesuk', role: 'Spa Therapist', color: '#eaf3fc', text_color: '#0c447c', status: 'on', sort_order: 2 },
  { name: 'Min', full_name: 'Minta Dee-ngam', role: 'Hair Stylist', color: '#eaf6ef', text_color: '#185a32', status: 'on', sort_order: 3 },
  { name: 'Jane', full_name: 'Jennifer Thongdee', role: 'Massage Therapist', color: '#fdf6e7', text_color: '#7d5a00', status: 'on', sort_order: 4 },
  { name: 'Bo', full_name: 'Bo Suayngam', role: 'Head Spa', color: '#f4f0fe', text_color: '#3c3489', status: 'leave', sort_order: 5 },
];

const SEED_SERVICES = [
  { name: 'Thai Massage 60 min', price: 65, duration: 60, type: 'single', sort_order: 1 },
  { name: 'Oil Massage 90 min', price: 95, duration: 90, type: 'single', sort_order: 2 },
  { name: 'Spa Body Treatment', price: 120, duration: 90, type: 'single', sort_order: 3 },
  { name: 'Facial', price: 85, duration: 60, type: 'single', sort_order: 4 },
  { name: 'Couple Massage 90 min', price: 160, duration: 90, type: 'couple', sort_order: 5 },
  { name: 'Haircut', price: 35, duration: 45, type: 'single', sort_order: 6 },
];

const SEED_ADDONS = [
  { name: 'Aromatherapy', price: 12, sort_order: 1 },
  { name: 'Hot Stones', price: 25, sort_order: 2 },
  { name: 'Thai Herbs', price: 18, sort_order: 3 },
  { name: 'Body Scrub', price: 28, sort_order: 4 },
  { name: 'Vitamin C Mask', price: 15, sort_order: 5 },
  { name: 'Eye Treatment', price: 10, sort_order: 6 },
];

const SEED_ROOMS = [
  { name: 'Room 1', capacity: 1, status: 'active', sort_order: 1 },
  { name: 'Room 2', capacity: 1, status: 'active', sort_order: 2 },
  { name: 'Room 3', capacity: 1, status: 'active', sort_order: 3 },
  { name: 'VIP Room', capacity: 1, status: 'active', sort_order: 4 },
  { name: 'Couple Room', capacity: 2, status: 'active', sort_order: 5 },
  { name: 'Group Room', capacity: 2, status: 'active', sort_order: 6 },
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function buildSeedBookings(date) {
  return [
    { booking_date: date, h: 9, m: 0, dur: 60, fname: 'Somying', lname: 'Thani', phone: '089-876-5432', name: 'Somying', svc: 'Thai Massage', staff_col: 1, status: 'done', req: false, addon: 'Aroma', staff: 'Pam', room: 'Room 1', intime: '09:02', outtime: '10:05', week_day: 2, notes: '', client_id: 2 },
    { booking_date: date, h: 10, m: 0, dur: 90, fname: 'Vipha', lname: 'Sukjai', phone: '081-234-5678', name: 'Vipha', svc: 'Spa Body Treatment', staff_col: 2, status: 'inservice', req: true, addon: 'Scrub', staff: 'Noon', room: 'Room 2', intime: '10:00', outtime: '', week_day: 3, notes: 'Allergies: Lavender', client_id: 1 },
    { booking_date: date, h: 11, m: 0, dur: 60, fname: 'Porn', lname: 'Srisawat', phone: '095-111-2233', name: 'Porn', svc: 'Oil Massage', staff_col: 4, status: 'confirm', req: true, addon: '', staff: 'Jane', room: 'VIP Room', intime: '', outtime: '', week_day: 3, notes: '', client_id: 4 },
    { booking_date: date, h: 13, m: 0, dur: 90, fname: 'Manee', lname: 'Prasert', phone: '091-777-8899', name: 'Manee+', svc: 'Couple Massage', staff_col: 2, status: 'pending', req: false, addon: 'Stones', staff: '', room: 'Couple Room', intime: '', outtime: '', week_day: 4, notes: '', client_id: 6 },
    { booking_date: date, h: 14, m: 30, dur: 60, fname: 'Jira', lname: 'Wongchai', phone: '084-555-6677', name: 'Jira', svc: 'Facial', staff_col: 1, status: 'confirm', req: false, addon: 'Vit C', staff: '', room: 'Room 2', intime: '', outtime: '', week_day: 3, notes: '', client_id: 5 },
  ];
}

function getPgConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const password = process.env.SUPABASE_DB_PASSWORD;
  if (!password) return null;
  const host = process.env.SUPABASE_DB_HOST || `db.${PROJECT_REF}.supabase.co`;
  const port = process.env.SUPABASE_DB_PORT || '5432';
  const user = process.env.SUPABASE_DB_USER || 'postgres';
  const database = process.env.SUPABASE_DB_NAME || 'postgres';
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

async function runSchemaSql() {
  const connStr = getPgConnectionString();
  if (!connStr) {
    console.log('⚠  SUPABASE_DB_PASSWORD / DATABASE_URL not set — skipping DDL.');
    console.log('   Tables must already exist (run supabase-setup.sql in SQL Editor).');
    return false;
  }

  const client = new pg.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(SCHEMA_SQL);
    console.log('✓ Schema created / updated via PostgreSQL');
    return true;
  } finally {
    await client.end();
  }
}

async function tableExists(table) {
  const { error } = await supabase.from(table).select('id', { count: 'exact', head: true });
  if (!error) return true;
  if (error.code === 'PGRST205' || error.message?.includes('does not exist') || error.message?.includes('Could not find')) {
    return false;
  }
  throw new Error(`${table}: ${error.message}`);
}

async function seedIfEmpty(table, rows) {
  const { count, error: countErr } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (countErr) throw new Error(`${table} count: ${countErr.message}`);
  if (count > 0) {
    console.log(`  · ${table}: already has ${count} row(s), skip seed`);
    return 0;
  }
  const { error } = await supabase.from(table).insert(rows);
  if (error) throw new Error(`${table} insert: ${error.message}`);
  console.log(`  ✓ ${table}: inserted ${rows.length} row(s)`);
  return rows.length;
}

async function main() {
  console.log('Sunshine — Supabase Database Setup');
  console.log('URL:', SUPABASE_URL);
  console.log('');

  await runSchemaSql();

  const tables = ['staff', 'services', 'addons', 'rooms', 'bookings'];
  for (const t of tables) {
    const exists = await tableExists(t);
    if (!exists) {
      console.error(`✗ Table "${t}" does not exist.`);
      console.error('  Set SUPABASE_DB_PASSWORD (Project Settings → Database) and re-run,');
      console.error('  or paste supabase-setup.sql + this script schema into Supabase SQL Editor.');
      process.exit(1);
    }
  }
  console.log('✓ All 5 tables are accessible');

  console.log('\nSeeding sample data...');
  let total = 0;
  total += await seedIfEmpty('staff', SEED_STAFF);
  total += await seedIfEmpty('services', SEED_SERVICES);
  total += await seedIfEmpty('addons', SEED_ADDONS);
  total += await seedIfEmpty('rooms', SEED_ROOMS);
  total += await seedIfEmpty('bookings', buildSeedBookings(todayISO()));

  console.log(`\nDone. ${total} new row(s) inserted.`);
}

main().catch((err) => {
  console.error('\nSetup failed:', err.message || err);
  process.exit(1);
});
