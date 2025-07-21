import { pgEnum, pgSchema, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

const usersTable = pgSchema('auth').table('users', {
  id: uuid().primaryKey().defaultRandom(),
});

export const ProfileRole = pgEnum('profile_role', [
  'USER',
  'ADMIN',
  'SUPER_ADMIN',
]);

export const profilesTable = pgTable('profiles', {
  profile_id: uuid().primaryKey().notNull().references(() => usersTable.id),
  email: text().notNull().unique(),
  role: ProfileRole().default('USER'),
  username: text().notNull().unique(),
  image: text().default(''),
  bio: text().default(''),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});
