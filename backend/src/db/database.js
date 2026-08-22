import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, '../../itinera.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Connected to SQLite Relational Database at:', dbPath);
  }
});

// Enable Foreign Keys and initialize Schema
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON;');

  // 1. Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar_url TEXT,
      language_preference TEXT DEFAULT 'en',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Trips Table
  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      cover_image_url TEXT,
      total_budget REAL DEFAULT 0,
      base_currency TEXT DEFAULT 'USD',
      is_public BOOLEAN DEFAULT 0,
      share_code TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // 3. Trip Stops (Cities)
  db.run(`
    CREATE TABLE IF NOT EXISTS trip_stops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      city_name TEXT NOT NULL,
      country TEXT NOT NULL,
      cost_index TEXT DEFAULT 'Moderate',
      arrival_date DATE,
      departure_date DATE,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );
  `);

  // 4. Itinerary Activities
  db.run(`
    CREATE TABLE IF NOT EXISTS itinerary_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stop_id INTEGER NOT NULL,
      trip_id INTEGER NOT NULL,
      day_number INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'Sightseeing',
      cost REAL DEFAULT 0,
      currency TEXT DEFAULT 'USD',
      duration_mins INTEGER DEFAULT 60,
      start_time TEXT,
      images_json TEXT,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (stop_id) REFERENCES trip_stops(id) ON DELETE CASCADE,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );
  `);

  // 5. Trip Expenses & Multi-person Contributions
  db.run(`
    CREATE TABLE IF NOT EXISTS trip_expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      payer_name TEXT NOT NULL,
      notes TEXT,
      expense_date DATE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );
  `);
});

// Helper database wrapper returning Promises for async/await
export const queryAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const queryOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const executeRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export default db;
