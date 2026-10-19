import { renderToString } from 'react-dom/server';

import type { SendVerificationEmailTemplateArgs } from './send-verification-email.types';

const ResetPasswordEmailTemplate = ({
  url,
  name,
}: SendVerificationEmailTemplateArgs) => {
  return (
    <div>
      <p>Hi ${name || 'there'}!</p>
      <p>
        Click{' '}
        <a href={url} target="_blank">
          here
        </a>{' '}
        to verify your email address.
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
