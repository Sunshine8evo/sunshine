/**
 * Sunshine Booking System — Supabase setup
 * Creates tables (staff, services, addons, rooms, bookings) and seeds sample data.
 *
 * Credentials (in order of use for CREATE TABLE):
 *   1. DATABASE_URL or SUPABASE_DB_PASSWORD
 *   2. SUPABASE_ACCESS_TOKEN (Supabase Management API)
 *
 * Data insert uses SUPABASE_URL + SUPABASE_KEY (anon key).
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import pg from 'pg';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://bjzhmdpuzfbpkvohntjx.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqemhtZHB1emZicGt2b2hudGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5OTMyNTEsImV4cCI6MjA5NTU2OTI1MX0.9TkTHUbwFY7MbL6yrv32-5mJfjkVk04TV6QX8LnpQnE';

const PROJECT_REF = 'bjzhmdpuzfbpkvohntjx';

function createSupabaseClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY;
  return createClient(SUPABASE_URL, key);
}

const supabase = createSupabaseClient();

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

function parseCliPassword() {
  const arg = process.argv.find((a) => a.startsWith('--db-password='));
  return arg ? arg.split('=').slice(1).join('=') : process.env.SUPABASE_DB_PASSWORD || null;
}

function getPgConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const password = parseCliPassword();
  if (!password) return null;
  const host = process.env.SUPABASE_DB_HOST || `db.${PROJECT_REF}.supabase.co`;
  const port = process.env.SUPABASE_DB_PORT || '5432';
  const user = process.env.SUPABASE_DB_USER || 'postgres';
  const database = process.env.SUPABASE_DB_NAME || 'postgres';
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
}

function loadSchemaSql() {
  return readFileSync(join(__dirname, 'setup-schema.sql'), 'utf8');
}

async function runSchemaViaPg() {
  const connStr = getPgConnectionString();
  if (!connStr) return false;

  const client = new pg.Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(loadSchemaSql());
    console.log('✓ Schema applied via PostgreSQL');
    return true;
  } finally {
    await client.end();
  }
}

async function runSchemaViaManagementApi() {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  if (!token) return false;

  const sql = loadSchemaSql();
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Management API ${res.status}: ${body}`);
  }
  console.log('✓ Schema applied via Supabase Management API');
  return true;
}

async function ensureSchema() {
  if (await runSchemaViaPg()) return true;
  if (await runSchemaViaManagementApi()) return true;

  const missing = await listMissingTables();
  if (missing.length === 0) return true;

  console.log('⚠  Cannot run CREATE TABLE with anon key only.');
  console.log('   Missing tables:', missing.join(', '));
  console.log('   Option A: set SUPABASE_DB_PASSWORD and re-run');
  console.log('           $env:SUPABASE_DB_PASSWORD="your-db-password"; node setup-database.js');
  console.log('   Option B: paste setup-schema.sql into Supabase Dashboard → SQL Editor → Run');
  return false;
}

async function tableExists(table) {
  const { error } = await supabase.from(table).select('id').limit(1);
  if (!error) return true;
  const msg = error.message || '';
  if (msg.includes('does not exist') || msg.includes('Could not find') || error.code === 'PGRST205') {
    return false;
  }
  throw new Error(`${table}: ${msg}`);
}

async function listMissingTables() {
  const tables = ['staff', 'services', 'addons', 'rooms', 'bookings'];
  const missing = [];
  for (const t of tables) {
    if (!(await tableExists(t))) missing.push(t);
  }
  return missing;
}

async function detectBookingColumns() {
  const probe = {
    booking_date: '2026-06-01',
    h: 9,
    m: 0,
    dur: 60,
    fname: 'X',
    lname: 'Y',
    phone: '000',
    name: 'X Y',
    svc: 'Thai Massage',
    staff_col: 1,
    status: 'pending',
    req: false,
    addon: '',
    staff: 'Pam',
    room: 'Room 1',
    intime: '',
    outtime: '',
    week_day: 0,
    notes: '',
    client_id: 0,
    discount: 0,
    tip: 0,
    payment_method: '',
  };
  const valid = {};
  let row = { ...probe };
  for (let guard = 0; guard < 30; guard++) {
    const { error } = await supabase.from('bookings').insert(row);
    if (!error) {
      await supabase.from('bookings').delete().eq('booking_date', '2026-06-01').eq('phone', '000');
      return Object.keys(row);
    }
    const missing = error.message?.match(/'([^']+)' column/);
    if (missing) {
      delete row[missing[1]];
      continue;
    }
    if (error.message?.includes('row-level security')) {
      return Object.keys(row);
    }
    throw new Error(`bookings probe: ${error.message}`);
  }
  return Object.keys(row);
}

function pickColumns(row, allowed) {
  const out = {};
  for (const key of allowed) {
    if (row[key] !== undefined) out[key] = row[key];
  }
  return out;
}

async function seedIfEmpty(table, rows) {
  const { count, error: countErr } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (countErr) throw new Error(`${table} count: ${countErr.message}`);
  if (count > 0) {
    console.log(`  · ${table}: ${count} row(s) already — skip seed`);
    return 0;
  }

  let payload = rows;
  if (table === 'bookings') {
    const cols = await detectBookingColumns();
    payload = rows.map((r) => pickColumns(r, cols));
  }

  const { error } = await supabase.from(table).insert(payload);
  if (error) {
    if (error.message?.includes('row-level security')) {
      throw new Error(
        `${table} insert blocked by RLS. Run setup-schema.sql in Supabase SQL Editor, or set SUPABASE_DB_PASSWORD / SUPABASE_SERVICE_ROLE_KEY and re-run.`
      );
    }
    throw new Error(`${table} insert: ${error.message}`);
  }
  console.log(`  ✓ ${table}: inserted ${payload.length} row(s)`);
  return payload.length;
}

const TABLE_SEEDS = {
  staff: SEED_STAFF,
  services: SEED_SERVICES,
  addons: SEED_ADDONS,
  rooms: SEED_ROOMS,
  bookings: () => buildSeedBookings(todayISO()),
};

async function main() {
  console.log('Sunshine — Supabase Database Setup');
  console.log('Project:', PROJECT_REF);
  console.log('');

  await ensureSchema();
  const missing = await listMissingTables();
  const ready = ['staff', 'services', 'addons', 'rooms', 'bookings'].filter((t) => !missing.includes(t));

  if (missing.length > 0) {
    console.log('⚠  Tables not ready:', missing.join(', '));
    if (ready.length === 0) process.exit(1);
    console.log('   Continuing seed for existing tables:', ready.join(', '));
  } else {
    console.log('✓ All tables ready: staff, services, addons, rooms, bookings');
  }

  console.log('\nSeeding sample data...');

  let total = 0;
  for (const table of ready) {
    const rows = typeof TABLE_SEEDS[table] === 'function' ? TABLE_SEEDS[table]() : TABLE_SEEDS[table];
    total += await seedIfEmpty(table, rows);
  }

  console.log(`\nDone. ${total} new row(s) inserted.`);
  if (missing.length > 0) {
    console.log('\nTo create missing tables, set your database password and re-run:');
    console.log('  $env:SUPABASE_DB_PASSWORD="<password>"; node setup-database.js');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\nSetup failed:', err.message || err);
  process.exit(1);
});
