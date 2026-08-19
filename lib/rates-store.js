import fs from 'fs';
import path from 'path';
import { DEFAULT_VEHICLES, DEFAULT_SETTINGS } from './default-rates';

// Same "simple JSON file" approach as lib/db.js — see that file's comment
// about swapping in a real database for production/serverless hosting.

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rates.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const seed = { vehicles: DEFAULT_VEHICLES, settings: DEFAULT_SETTINGS };
    fs.writeFileSync(DATA_FILE, JSON.stringify(seed, null, 2), 'utf-8');
  }
}

export function getRatesData() {
  ensureFile();
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  try {
    const parsed = JSON.parse(raw);
    return {
      vehicles: parsed.vehicles || {},
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
    };
  } catch {
    return { vehicles: DEFAULT_VEHICLES, settings: DEFAULT_SETTINGS };
  }
}

function saveRatesData(data) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function upsertVehicle(id, vehicle) {
  const data = getRatesData();
  data.vehicles[id] = vehicle;
  saveRatesData(data);
  return data;
}

export function deleteVehicle(id) {
  const data = getRatesData();
  delete data.vehicles[id];
  saveRatesData(data);
  return data;
}

export function updateSettings(settings) {
  const data = getRatesData();
  data.settings = { ...data.settings, ...settings };
  saveRatesData(data);
  return data;
}

export function slugify(label) {
  return (
    label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || `vehicle_${Date.now()}`
  );
}
