-- ============================================
-- Lead Management System — Supabase Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Create custom enum type for lead statuses
CREATE TYPE lead_status AS ENUM (
    'new',
    'contacted',
    'responded',
    'qualified',
    'converted',
    'lost',
    'invalid'
);

-- 2. Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);

-- 3. Leads table
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    company VARCHAR(255),
    status lead_status DEFAULT 'new',
    score INTEGER DEFAULT 0,
    followup_attempts INTEGER DEFAULT 0,
    follow_up_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    assigned_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_follow_up_at ON leads(follow_up_at);

-- 4. Conversations table
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    channel VARCHAR(50) DEFAULT 'email',
    content TEXT,
    subject VARCHAR(255),
    message_id VARCHAR(255),
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_conversations_lead_id ON conversations(lead_id);

-- 5. Status History table (audit trail)
CREATE TABLE status_history (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    from_status lead_status,
    to_status lead_status NOT NULL,
    changed_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_status_history_lead_id ON status_history(lead_id);

-- 6. Auto-update `updated_at` trigger for leads
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Done! All 4 tables are ready.
-- ============================================
