export const configs = {
  authSecret: process.env.BETTER_AUTH_SECRET!,
  dbUrl: process.env.DATABASE_URL!,
  resendApiKey: process.env.RESEND_API_KEY!,
  siteUrl: process.env.SITE_URL!,
} as const;
