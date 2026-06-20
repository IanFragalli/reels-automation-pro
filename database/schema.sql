CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS generated_scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  titulo TEXT,
  gancho TEXT,
  desenvolvimento TEXT,
  cta TEXT,
  duracao TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scripts_user ON generated_scripts(user_id);