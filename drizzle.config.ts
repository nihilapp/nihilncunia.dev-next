import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './app/_entities/**/*.table.ts',
  out: './app/_sql/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
