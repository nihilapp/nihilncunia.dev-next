import { pgEnum, pgSchema, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const usersTable = pgSchema('auth').table('users', { id: uuid().primaryKey().defaultRandom(), });

export const profileRole = pgEnum('profile_role', [
  'USER',
  'ADMIN',
  'SUPER_ADMIN',
]);

export const profileTable = pgTable('profiles', {
  profile_id: uuid().primaryKey().references(
    () => usersTable.id,
    { onDelete: 'cascade', }
  ),
  email: text().notNull().unique(),
  username: text().notNull().unique(),
  role: profileRole().notNull().default('USER'),
  image_url: text().default(''),
  bio: text().default(''),
  otp_secret: text().default(''),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});

export type Profile = typeof profileTable.$inferSelect;
export type NewProfile = typeof profileTable.$inferInsert;
export type ProfileRole = (typeof profileRole.enumValues)[number];
