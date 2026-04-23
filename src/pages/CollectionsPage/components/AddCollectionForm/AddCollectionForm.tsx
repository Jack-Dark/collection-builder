import SaveIcon from '@mui/icons-material/Save';
import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { useRef } from 'react';

import { useCreateCollection } from '#/api/routes/collections/client/hooks';
import { createCollectionSchema } from '#/api/routes/collections/server/serverFns';
import { Button } from '#/components/Button';
import { InputField } from '#/components/InputField';

import { defaultValues } from './constants';

export const AddCollectionForm = () => {
  const router = useRouter();

  const nameInputRef = useRef<HTMLInputElement>(null);

  const { onCreateCollection } = useCreateCollection();

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onCreateCollection({
        data: value,
      });

      form.reset();

      await router.invalidate();

      nameInputRef?.current?.focus();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: createCollectionSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        <form.Subscribe
          selector={(state) => {
            return {
              errors: state.errors,
              value: state.values.name,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field name="name">
                {(field) => {
                  // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <InputField
                      autoFocus
                      error={errorMsg}
                      label="Name"
                      name={field.name}
                      onValueChange={field.handleChange}
                      ref={nameInputRef}
                      required
                      value={value}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>

        <form.Subscribe
          selector={(state) => {
            return {
              errors: state.errors,
              value: state.values.notes,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field name="notes">
                {(field) => {
                  // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <InputField
                      autoFocus
                      error={errorMsg}
                      label="Notes"
                      name={field.name}
                      onValueChange={field.handleChange}
                      required
                      value={value}
                    />
                  );
                }}
              </form.Field>
            );
          }}
        </form.Subscribe>
        <form.Subscribe
          selector={(state) => {
            return {
              isFormValid: state.isFormValid,
              values: state.values,
            };
          }}
        >
          {(state) => {
            const { isFormValid } = state;

            return (
              <Button
                className="flex flex-nowrap gap-2"
                disabled={!isFormValid}
                type="submit"
              >
                <SaveIcon />
                Save
              </Button>
            );
          }}
        </form.Subscribe>
      </div>
    </form>
  );
};

// const ReactiveInputField = <
//   TFormData,
//   TOnMount extends FormValidateOrFn<TFormData>,
//   TOnChange extends FormValidateOrFn<TFormData>,
//   TOnChangeAsync extends FormAsyncValidateOrFn<TFormData>,
//   TOnBlur extends FormValidateOrFn<TFormData>,
//   TOnBlurAsync extends FormAsyncValidateOrFn<TFormData>,
//   TOnSubmit extends FormValidateOrFn<TFormData>,
//   TOnSubmitAsync extends FormAsyncValidateOrFn<TFormData>,
//   TOnDynamic extends FormValidateOrFn<TFormData>,
//   TOnDynamicAsync extends FormAsyncValidateOrFn<TFormData>,
//   TOnServer extends FormAsyncValidateOrFn<TFormData>,
//   TSubmitMeta,
// >(props: {
//   form: ReactFormExtendedApi<
//     TFormData,
//     TOnMount,
//     TOnChange,
//     TOnChangeAsync,
//     TOnBlur,
//     TOnBlurAsync,
//     TOnSubmit,
//     TOnSubmitAsync,
//     TOnDynamic,
//     TOnDynamicAsync,
//     TOnServer,
//     TSubmitMeta
//   >;
//   getValueFromState: <TValue = string | number | readonly string[] | undefined>(
//     state: NoInfer<
//       FormState<
//         TFormData,
//         TOnMount,
//         TOnChange,
//         TOnChangeAsync,
//         TOnBlur,
//         TOnBlurAsync,
//         TOnSubmit,
//         TOnSubmitAsync,
//         TOnDynamic,
//         TOnDynamicAsync,
//         TOnServer
//       >
//     >,
//   ) => {
//     errors: (typeof state)['errors'][];
//     value: TValue;
//   };
//   label?: string;
//   name: DeepKeys<TFormData>;
//   ref?: React.Ref<HTMLElement>;
// }) => {
//   const { form, getValueFromState, label, name, ref } = props;

//   return (
//     <form.Subscribe
//       selector={(state) => {
//         const result = getValueFromState(state);

//         return result;

//         // return {
//         //   errors: state.errors,
//         //   value: eval(`state.values.${name}`),
//         // };
//       }}
//     >
//       {({ errors, value }) => {
//         return (
//           <form.Field name={name}>
//             {(field) => {
//               // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
//               const errorMsg = eval(
//                 `${errors}?.[0]?.[${field.name}]?.[0]?.message`,
//               );

//               return (
//                 <InputField
//                   autoFocus
//                   error={errorMsg}
//                   label={label}
//                   name={field.name}
//                   onValueChange={(value, eventDetails) => {
//                     return field.handleChange(value);
//                   }}
//                   ref={ref}
//                   required
//                   value={value}
//                 />
//               );
//             }}
//           </form.Field>
//         );
//       }}
//     </form.Subscribe>
//   );
// };
