export const getFieldError = (field: {
  state: { meta: { errors: any[] } };
}) => {
  return field?.state?.meta?.errors
    ?.map((error: { message: string }) => {
      return error?.message;
    })
    ?.join(' ');
};
