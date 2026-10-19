import { renderToString } from 'react-dom/server';

import type { SendVerificationEmailTemplateArgs } from './send-verification-email.types';

const ResetPasswordEmailTemplate = ({
  url,
}: SendVerificationEmailTemplateArgs) => {
  return (
    <div>
      <p>Welcome!</p>
      <p>
        Click{' '}
        <a href={url} target="_blank">
          here
        </a>{' '}
        to verify your account and start tracking your collection.
      </p>
      <br />
      <p>Best regards,</p>
      <p>The Collection Tracker Team</p>
    </div>
  );
};

export const getVerificationEmailTemplateString = (
  props: SendVerificationEmailTemplateArgs,
) => {
  return renderToString(<ResetPasswordEmailTemplate {...props} />);
};
