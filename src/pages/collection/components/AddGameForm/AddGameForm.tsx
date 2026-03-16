import type { RouteComponent } from '@tanstack/react-router';

import { revalidateLogic, useForm } from '@tanstack/react-form';
import { useRouter } from '@tanstack/react-router';
import { apiRoutes } from '#/api/routes';
import { Button } from '#/components/Button';
import { CheckboxField } from '#/components/CheckboxField';
import { ComboboxField } from '#/components/ComboboxField';
import { InputField } from '#/components/InputField';
import { authClient } from '#/utils/auth-client';

import { systemsList, defaultValues } from './constants';

export const AddGameForm: RouteComponent = () => {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  const form = useForm({
    defaultValues: defaultValues,
    onSubmit: async ({ value }) => {
      const response = await apiRoutes.games.create({
        ...value,
        // TODO - FIX
        userId: session?.user?.id as string,
      });
      console.log('🚀 ~ AddGameForm ~ response:', response);
      router.invalidate();
    },
    validationLogic: revalidateLogic({
      mode: 'submit',
      modeAfterSubmission: 'change',
    }),
    validators: {
      onSubmit: apiRoutes.games.createSchema,
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
            };
          }}
        >
          {({ errors }) => {
            return (
              <form.Field name="name">
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <InputField
                      defaultValue={defaultValues[field.name]}
                      error={errorMsg}
                      label="Name"
                      name={field.name}
                      onValueChange={(value) => {
                        field.handleChange(value);
                      }}
                      required
                      // valid={!!errorMsg}
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
              value: state.values.system,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field name="system">
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <ComboboxField
                      items={systemsList}
                      onValueChange={(value) => {
                        // @ts-expect-error
                        field.setValue(value!);
                      }}
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
              value: state.values.isSpecialEdition,
            };
          }}
        >
          {({ errors, value }) => {
            return (
              <form.Field
                listeners={{
                  onChange: ({ value: isSpecialEdition }) => {
                    form.setFieldValue(
                      'editionDetails',
                      isSpecialEdition ? "Collector's Edition" : '',
                    );
                  },
                }}
                name="isSpecialEdition"
              >
                {(field) => {
                  const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                  return (
                    <CheckboxField
                      checked={value}
                      error={errorMsg}
                      label="Is this a special edition?"
                      onCheckedChange={field.handleChange}
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
              editionDetails: state.values.editionDetails,
              errors: state.errors,
              isSpecialEdition: state.values.isSpecialEdition,
            };
          }}
        >
          {({ editionDetails, errors, isSpecialEdition }) => {
            return (
              isSpecialEdition && (
                <form.Field name="editionDetails">
                  {(field) => {
                    const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      <InputField
                        defaultValue={defaultValues[field.name]}
                        error={errorMsg}
                        label="Edition details"
                        name={field.name}
                        onValueChange={(value) => {
                          field.handleChange(value);
                        }}
                        required
                      />
                    );
                  }}
                </form.Field>
              )
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
            const { isFormValid, values } = state;
            console.clear();
            console.log('🚀 ~ AddGameForm ~ values:', values);

            return (
              <Button disabled={!isFormValid} type="submit">
                Submit
              </Button>
            );
          }}
        </form.Subscribe>
      </div>
    </form>
  );
};
