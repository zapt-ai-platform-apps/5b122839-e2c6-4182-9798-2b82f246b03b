import { pgTable, serial, text, timestamp, uuid, date } from 'drizzle-orm/pg-core';

export const jokes = pgTable('jokes', {
  id: serial('id').primaryKey(),
  setup: text('setup').notNull(),
  punchline: text('punchline').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
});

export const letters = pgTable('letters', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull(),
  vehicleMake: text('vehicle_make').notNull(),
  vehicleModel: text('vehicle_model').notNull(),
  vehicleReg: text('vehicle_reg'),
  ticketNumber: text('ticket_number').notNull(),
  ticketDate: date('ticket_date').notNull(),
  ticketReason: text('ticket_reason').notNull(),
  circumstances: text('circumstances').notNull(),
  country: text('country'),
  keeperAddress: text('keeper_address'),
  companyAddress: text('company_address'),
  generatedLetter: text('generated_letter'),
  keySummary: text('key_summary'),
  paymentStatus: text('payment_status').default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
});