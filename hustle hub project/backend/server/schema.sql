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
);

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  provider_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'removed'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash CHAR(64) PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_hash CHAR(64) PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS password_reset_tokens_user_id_idx ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS password_reset_tokens_expires_at_idx ON password_reset_tokens(expires_at);

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

CREATE TABLE IF NOT EXISTS favorites (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, service_id)
);

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

CREATE UNIQUE INDEX IF NOT EXISTS payments_one_open_per_request_idx
  ON payments(request_id) WHERE status = 'pending';
