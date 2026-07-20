import {
  withCollectionsListForm,
  collectionsListFormDefaultValues,
} from '#/pages/CollectionsListPage/CollectionsListPage.form';

export const CollectionsListNameField = withCollectionsListForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: collectionsListFormDefaultValues,
  props: { index: 0 },
  render: ({ form, index }) => {
    return (
      <form.AppField mode="array" name="records">
        {() => {
          return (
            <form.AppField name={`records[${index}].name`}>
              {(field) => {
                return (
                  <field.InputField
                    autoFocus
                    // error={getFieldError(field)}
                    hideLabel
                    name={field.name}
                    onValueChange={field.handleChange}
                    placeholder="Input name..."
                    required
                    value={field.state.value}
                  />
                );
              }}
            </form.AppField>
          );
        }}
      </form.AppField>
    );
  },
});
