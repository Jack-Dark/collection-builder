import { config } from 'dotenv';

config({ path: '.env' });

export const configs = {
  authSecret: process.env.BETTER_AUTH_SECRET!,
  authUrl: process.env.BETTER_AUTH_URL!,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY!,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET!,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET!,
  // TODO - REQUIRED FEATURE: UPDATE NETLIFY TO PRODUCTION DB URL & COPY DEV DB TO PRODUCTION
  dbUrl: process.env.DATABASE_URL!,
  resendApiKey: process.env.RESEND_API_KEY!,
  siteUrl: process.env.SITE_URL!,
} as const;
