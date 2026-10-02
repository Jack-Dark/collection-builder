import type { FormattedServerResponseDef } from '#/api/react-query-hooks/react-query.types';

export const formatServerResponse = async <TData>(
  callback: () => Promise<TData>,
) => {
  try {
    const data = await callback();

    return { data, success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server Error';
    console.error('Error:', error);

    return { data: undefined, error: message, success: false };
  }

  // const { data, error, success } = await formatServerResponse_INNER(callback);

  // if (!success) {
  //   throw new Error(error);
  // }

  // return data;
};

export const formatServerResponse_INNER = async <TData>(
  callback: () => Promise<TData>,
): FormattedServerResponseDef<TData> => {
  try {
    const data = await callback();

    return { data, success: true };
  } catch (error) {
    console.error('Error:', error);

    const message = error instanceof Error ? error.message : '';

    return { data: undefined, error: message, success: false };
  }
};
