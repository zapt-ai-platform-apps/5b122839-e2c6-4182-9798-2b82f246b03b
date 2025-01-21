CREATE TABLE letters (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  ticket_number TEXT NOT NULL,
  ticket_date DATE NOT NULL,
  ticket_reason TEXT NOT NULL,
  circumstances TEXT NOT NULL,
  generated_letter TEXT NOT NULL,
  key_summary TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);