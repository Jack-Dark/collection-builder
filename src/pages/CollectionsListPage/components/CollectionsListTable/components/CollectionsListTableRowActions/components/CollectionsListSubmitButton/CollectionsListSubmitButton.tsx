import SaveIcon from '@mui/icons-material/Save';

import {
  collectionsListFormDefaultValues,
  withCollectionsListForm,
} from '#/pages/CollectionsListPage/CollectionsListPage.form';

export const CollectionsListSubmitButton = withCollectionsListForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionsListFormDefaultValues,
  render: ({ form }) => {
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
