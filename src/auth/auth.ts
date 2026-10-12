import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { Resend } from 'resend';

import { db } from '#/api/db';

import * as schema from '../api/db-tables-schema';

// @ts-expect-error
const _resend = new Resend(import.meta.env.RESEND_API_KEY);

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
  // emailVerification: {
  //   sendVerificationEmail: async ({ token, url, user }, request) => {
  //     // TODO - UPDATE BACK TO void FROM await
  //     const { data, error } = await resend.emails.send({
  //       from: 'onboarding@resend.dev',
  //       html: `<p>Click the link to <a href="${import.meta.env.SITE_URL}/account?token=${token}">verify your email</a></p>`,
  //       subject: 'Hello World',
  //       to: 'decker3d@gmail.com',
  //     });
  //     if (error) {
  //       console.log('🚀 ~ error:', error);
  //     }
  //   },
  // },
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
