ALTER TABLE IF EXISTS letters ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending';
ALTER TABLE IF EXISTS letters ALTER COLUMN generated_letter DROP NOT NULL;
ALTER TABLE IF EXISTS letters ALTER COLUMN key_summary DROP NOT NULL;