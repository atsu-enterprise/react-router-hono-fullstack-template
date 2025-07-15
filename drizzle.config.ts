import type { Config } from 'drizzle-kit';

export default {
  schema: './app/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    wranglerConfigPath: './wrangler.jsonc',
    dbName: 'my-database',
  },
} satisfies Config;
