import pg from 'pg'
import { hashPassword } from './security.js'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      email VARCHAR(254) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'freelancer', 'admin')),
      status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended')),
      bio VARCHAR(500) NOT NULL DEFAULT '',
      skills TEXT[] NOT NULL DEFAULT '{}',
      contact_phone VARCHAR(30) NOT NULL DEFAULT '',
      available BOOLEAN NOT NULL DEFAULT TRUE,
      profile_photo BYTEA,
      profile_photo_mime_type VARCHAR(20),
      profile_photo_updated_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS bio VARCHAR(500) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS skills TEXT[] NOT NULL DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(30) NOT NULL DEFAULT '',
      ADD COLUMN IF NOT EXISTS available BOOLEAN NOT NULL DEFAULT TRUE,
      ADD COLUMN IF NOT EXISTS profile_photo BYTEA,
      ADD COLUMN IF NOT EXISTS profile_photo_mime_type VARCHAR(20),
      ADD COLUMN IF NOT EXISTS profile_photo_updated_at TIMESTAMPTZ
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id BIGSERIAL PRIMARY KEY,
      title VARCHAR(120) NOT NULL,
      category VARCHAR(60) NOT NULL,
      description VARCHAR(500) NOT NULL,
      provider_name VARCHAR(80) NOT NULL,
      provider_initials VARCHAR(2) NOT NULL,
      provider_color VARCHAR(20) NOT NULL DEFAULT 'mint',
      location VARCHAR(100) NOT NULL,
      price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
      rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
      review_count INTEGER NOT NULL DEFAULT 0,
      badge VARCHAR(30) NOT NULL DEFAULT 'New on Hustle',
      icon VARCHAR(8) NOT NULL DEFAULT '✦',
      slug VARCHAR(120) UNIQUE,
      listing_photo BYTEA,
      listing_photo_mime_type VARCHAR(20),
      listing_photo_updated_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query(`
    ALTER TABLE services
      ADD COLUMN IF NOT EXISTS provider_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'removed')),
      ADD COLUMN IF NOT EXISTS listing_photo BYTEA,
      ADD COLUMN IF NOT EXISTS listing_photo_mime_type VARCHAR(20),
      ADD COLUMN IF NOT EXISTS listing_photo_updated_at TIMESTAMPTZ
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS common_service_photos (
      service_key VARCHAR(180) PRIMARY KEY,
      photo BYTEA NOT NULL,
      mime_type VARCHAR(20) NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query(`
    UPDATE services SET status = 'removed'
    WHERE slug IN ('huble-demo-cleaning', 'huble-demo-design', 'huble-demo-plumbing')
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      token_hash CHAR(64) PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      token_hash CHAR(64) PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON password_reset_tokens(user_id);
    CREATE INDEX IF NOT EXISTS password_reset_tokens_expires_at_idx ON password_reset_tokens(expires_at);

    CREATE TABLE IF NOT EXISTS reports (
      id BIGSERIAL PRIMARY KEY,
      reporter_id BIGINT NOT NULL REFERENCES users(id),
      target_user_id BIGINT REFERENCES users(id),
      service_id BIGINT REFERENCES services(id) ON DELETE SET NULL,
      reason VARCHAR(60) NOT NULL,
      details VARCHAR(500) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'reviewing', 'resolved', 'dismissed')),
      reviewed_by BIGINT REFERENCES users(id),
      reviewed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CHECK (target_user_id IS NOT NULL OR service_id IS NOT NULL)
    );
    CREATE INDEX IF NOT EXISTS reports_status_created_at_idx ON reports(status, created_at DESC);

    CREATE TABLE IF NOT EXISTS activity_events (
      id BIGSERIAL PRIMARY KEY,
      actor_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
      action VARCHAR(60) NOT NULL,
      target_type VARCHAR(30),
      target_id VARCHAR(80),
      details JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS activity_events_created_at_idx ON activity_events(created_at DESC);
    CREATE INDEX IF NOT EXISTS services_status_created_at_idx ON services(status, created_at DESC);
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id BIGSERIAL PRIMARY KEY,
      service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
      customer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      provider_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
      location VARCHAR(100) NOT NULL,
      preferred_date DATE NOT NULL,
      details VARCHAR(500) NOT NULL,
      agreed_amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Submitted'
        CHECK (status IN ('Submitted', 'Accepted', 'Declined', 'Completed')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS service_requests_customer_idx ON service_requests(customer_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS service_requests_provider_idx ON service_requests(provider_id, created_at DESC);

    CREATE TABLE IF NOT EXISTS favorites (
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (user_id, service_id)
    );
  `)
  await pool.query('ALTER TABLE service_requests ALTER COLUMN provider_id DROP NOT NULL')
  await pool.query(`
    ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS agreed_amount NUMERIC(10, 2);
    UPDATE service_requests r SET agreed_amount = s.price
      FROM services s WHERE s.id = r.service_id AND r.agreed_amount IS NULL;
    ALTER TABLE service_requests ALTER COLUMN agreed_amount SET NOT NULL;
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY,
      request_id BIGINT NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
      callback_token_hash CHAR(64) UNIQUE,
      checkout_request_id VARCHAR(100) UNIQUE,
      merchant_request_id VARCHAR(100),
      phone VARCHAR(12) NOT NULL,
      amount INTEGER NOT NULL CHECK (amount > 0),
      status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'paid', 'failed')),
      receipt_number VARCHAR(30) UNIQUE,
      result_description VARCHAR(255),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS payments_request_idx ON payments(request_id, created_at DESC);
    CREATE UNIQUE INDEX IF NOT EXISTS payments_callback_token_hash_idx
      ON payments(callback_token_hash) WHERE callback_token_hash IS NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS payments_one_open_per_request_idx
      ON payments(request_id) WHERE status = 'pending';
  `)
  await pool.query('ALTER TABLE payments ADD COLUMN IF NOT EXISTS callback_token_hash CHAR(64)')

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD
  if (process.env.NODE_ENV === 'production' && (!adminEmail || !adminPassword)) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD before starting in production.')
  }
  if (Boolean(adminEmail) !== Boolean(adminPassword)) {
    throw new Error('Set both ADMIN_EMAIL and ADMIN_PASSWORD to bootstrap the administrator account.')
  }
  if (!adminEmail) {
    console.warn('Administrator account not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD to enable admin sign-in.')
  }
  if (adminEmail) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail) || adminPassword.length < 12) {
      throw new Error('ADMIN_EMAIL must be valid and ADMIN_PASSWORD must be at least 12 characters.')
    }
    const passwordHash = await hashPassword(adminPassword)
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, status)
       VALUES ('Hustle Hub Administrator', $1, $2, 'admin', 'active')
       ON CONFLICT (email) DO NOTHING`,
      [adminEmail, passwordHash],
    )
    const admin = await pool.query('SELECT role FROM users WHERE email = $1', [adminEmail])
    if (admin.rows[0]?.role !== 'admin') {
      throw new Error('ADMIN_EMAIL is already used by a non-admin account; choose a dedicated admin email.')
    }
  }

}
