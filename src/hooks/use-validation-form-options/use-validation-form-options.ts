import type { StandardSchemaV1, ValidatorTrigger } from '@tanstack/react-form';

import { formOptions } from '@tanstack/react-form';
import { useMemo, useState } from 'react';

/**
 * Creates form options that will render validation errors after the first submission attempt and update errors on change.
 *
 * @example
 * const validationFormOptions = useValidationFormOptions({
 *   defaultValues: YOUR_DEFAULT_VALUES,
 *   schema: YOUR_SCHEMA,
 * });
 *
 * const form = useForm({
 *   ...validationFormOptions,
 *   onSubmit: async ({ value }) => {
 *     // ...
 *   },
 * });
 */
export const useValidationFormOptions = <
  TData extends Record<any, any>,
>(props: {
  defaultValues: TData;
  schema: StandardSchemaV1<TData>;
}) => {
  const { defaultValues, schema } = props;

  const [validationTriggers, setValidationTriggers] = useState<
    ValidatorTrigger[]
  >([]);

  const formObject = useMemo(() => {
    return formOptions({
      defaultValues,
      errorVisibility: ({ state }) => {
        return !!state.submissionAttempts;
      },
      onSubmitInvalid: () => {
        setValidationTriggers(['change']);
      },
      validators: [
        {
          run: schema,
          triggers: validationTriggers,
        },
      ],
    });
  }, [defaultValues, validationTriggers]);

  return formObject;
};
