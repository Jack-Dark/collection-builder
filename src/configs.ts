export const configs = {
  authSecret: process.env.BETTER_AUTH_SECRET!,
  authUrl: process.env.BETTER_AUTH_URL!,
  dbUrl: process.env.DATABASE_URL!,
} as const;
