-- DigProg waitlist (Neon / Postgres)
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id              BIGSERIAL PRIMARY KEY,
  email           TEXT NOT NULL,
  name            TEXT,
  interest        TEXT,
  discount_code   TEXT NOT NULL,
  source          TEXT DEFAULT 'landing',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS waitlist_signups_created_idx
  ON waitlist_signups (created_at DESC);

CREATE INDEX IF NOT EXISTS waitlist_signups_code_idx
  ON waitlist_signups (discount_code);
