import { Resend } from 'resend';

import { configs } from '#/configs';

export const resend = new Resend(configs.resendApiKey);

export const resendEmailFrom =
  'Collection Tracker <noreply@collectiontracker.app>';
