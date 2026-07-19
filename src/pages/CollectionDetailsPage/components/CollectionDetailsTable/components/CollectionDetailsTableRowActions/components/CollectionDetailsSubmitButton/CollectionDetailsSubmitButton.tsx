import SaveIcon from '@mui/icons-material/Save';

import {
  collectionDetailsFormDefaultValues,
  withCollectionDetailsForm,
} from '../../../../../../CollectionDetailsPage.form';

export const CollectionDetailsSubmitButton = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionDetailsFormDefaultValues,
  render: ({ form }) => {
    return (
      <form.Subscribe
        selector={(state) => {
          const { isFormValid, isPristine } = state;

          return {
            isFormValid,
            isPristine,
          };
        }}
      >
        {({ isFormValid, isPristine }) => {
          return (
            <form.AppForm>
              <form.Button
                className="flex flex-nowrap gap-2"
                disabled={isPristine || !isFormValid}
                Icon={SaveIcon}
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
