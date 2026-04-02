import { authClient } from '#/auth/auth-client';
import { ReasonPhrases } from 'http-status-codes';

export const useGetUserId = () => {
  const { data: session } = authClient.useSession();

  const userId = session?.user?.id;

  const validateUserToCallback = async <T>(
    callback: (userId: string) => Promise<T>,
  ) => {
    if (userId) {
      return callback(userId);
    }
    throw new Error(ReasonPhrases.UNAUTHORIZED);
  };

  return { userId, validateUserToCallback };
};
