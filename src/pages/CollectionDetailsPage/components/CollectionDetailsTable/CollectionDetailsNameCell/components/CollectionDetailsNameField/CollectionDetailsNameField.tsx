import {
  withCollectionDetailsForm,
  addCollectionItemFormDefaultValues,
} from '#/pages/CollectionDetailsPage/CollectionDetailsPage.form';

export const CollectionDetailsNameField = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  props: { index: 0 },
  render: ({ form, index }) => {
    return (
      <form.AppField mode="array" name="collectionItems">
        {() => {
          return (
            <form.AppField name={`collectionItems[${index}].name`}>
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
