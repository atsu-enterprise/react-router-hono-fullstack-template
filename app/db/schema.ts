import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey(),
  bibsNumber: text('bibsNumber').notNull(),
  summary: text('summary'),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  status: text('status', { enum: ['open', 'move', 'close', 'active'] }).notNull().default('active'),
  result: text('result'),
});

export const runners = sqliteTable('runners', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  age: integer('age'),
});
