import SaveIcon from '@mui/icons-material/Save';

import {
  collectionDetailsFormDefaultValues,
  withCollectionDetailsForm,
} from '../../../../../../CollectionDetailsPage.form';

export const CollectionDetailsSubmitButton = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionDetailsFormDefaultValues,
  props: {
    resetRowSelection: () => {},
  },
  render: ({ form, resetRowSelection }) => {
    return (
      <form.Subscribe
        selector={(state) => {
          const { isFormValid, isPristine, isSubmitting } = state;

          return {
            isFormValid,
            isPristine,
            isSubmitting,
          };
        }}
      >
        {({ isFormValid, isPristine, isSubmitting }) => {
          return (
            <form.AppForm>
              <form.Button
                className="flex flex-nowrap gap-2"
                disabled={isPristine || !isFormValid}
                Icon={SaveIcon}
                onClick={(e) => {
                  e.preventDefault();

                  form.handleSubmit();
                  resetRowSelection();
                }}
                processing={isSubmitting}
                text="Save"
                type="submit"
              />
            </form.AppForm>
          );
        }}
      </form.Subscribe>
    );
  },
});
