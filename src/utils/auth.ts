import { db } from '#/api/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    // make sure this is the last plugin in the array
    tanstackStartCookies(),
  ],
  // socialProviders: {
  //   google: {
  //     clientId: '',
  //     clientSecret: '',
  //   },
  // },
});
