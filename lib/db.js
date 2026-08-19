import fs from 'fs';
import path from 'path';

// Simple JSON-file "database" for bookings. This keeps the app dependency
// free and easy to run locally. For a production deployment on a serverless
// host (Vercel etc.) swap this out for a real database (Postgres, Mongo,
// Supabase...) since the filesystem there is read-only/ephemeral.

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'bookings.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

export function getBookings() {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBookings(bookings) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
}

export function addBooking(booking) {
  const bookings = getBookings();
  bookings.unshift(booking);
  saveBookings(bookings);
  return booking;
}

export function updateBookingStatus(id, status) {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx].status = status;
  bookings[idx].updatedAt = new Date().toISOString();
  saveBookings(bookings);
  return bookings[idx];
}

export function makeBookingId() {
  const d = new Date();
  const stamp = d.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NTT-${stamp}-${rand}`;
}
