import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { Resend } from 'resend';

import { db } from '#/api/db';
import { configs } from '#/configs';

import * as schema from '../api/db-tables-schema';

const resend = new Resend(configs.resendApiKey);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      account: schema.accountsTable,
      session: schema.sessionsTable,
      user: schema.usersTable,
      verification: schema.verificationsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendOnSignIn: true,
    sendVerificationEmail: async ({ url, user }) => {
      const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        html: `Click the link to verify your email: ${url}`,
        subject: 'Verify your email address',
        to: [user.email],
      });

      if (error) {
        throw new Error(error.message);
      }
    },
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
