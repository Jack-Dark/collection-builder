import { db } from '#/api/db';
import { configs } from '#/configs';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { tanstackStartCookies } from 'better-auth/tanstack-start';
import { Resend } from 'resend';

const resend = new Resend(configs.resendApiKey);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ token, url, user }, request) => {
      // TODO - UPDATE BACK TO void FROM await
      const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        html: `<p>Click the link to <a href="${configs.authUrl}/account?token=${token}">verify your email</a></p>`,
        subject: 'Hello World',
        to: 'decker3d@gmail.com',
      });
      if (error) {
        console.log('🚀 ~ error:', error);
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
