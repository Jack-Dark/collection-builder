import SaveIcon from '@mui/icons-material/Save';

import { Button } from '#/components/Button';
import { Popover } from '#/components/Popover';

import {
  addCollectionItemFormDefaultValues,
  withAddCollectionItemForm,
} from './constants';

export const AddCollectionItemFormTableRow = withAddCollectionItemForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  props: {
    customField1Enabled: false,
    customField1Label: '',
    customField2Enabled: false,
    customField2Label: '',
    customField3Enabled: false,
    customField3Label: '',
    customFields: {
      customField1Values: [''],
      customField2Values: [''],
      customField3Values: [''],
    },
    onCancel: () => {},
    tdClassNames: '',
  },
  render: ({ customFields, form, onCancel, tdClassNames, ...rest }) => {
    const enabledFieldNums = [
      rest.customField1Enabled && 1,
      rest.customField2Enabled && 2,
      rest.customField3Enabled && 3,
    ].filter(Boolean) as (1 | 2 | 3)[];

    return (
      <tr className="align-top">
        <td className={tdClassNames}>
          <form.AppField name="name">
            {(field) => {
              return (
                <form.Subscribe
                  selector={(state) => {
                    return {
                      errors: state.errors,
                      value: state.values.name,
                    };
                  }}
                >
                  {({ errors: _errors, value }) => {
                    // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                    // const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      <field.InputField
                        autoFocus
                        error={field.state.meta.errors.join(',')}
                        name={field.name}

                        onValueChange={field.handleChange}
                        placeholder="Input name..."
                        required
                        value={value}
                      />
                    );
                  }}
                </form.Subscribe>
              );
            }}
          </form.AppField>
        </td>

        {enabledFieldNums.map((num) => {
          const isFieldEnabled = rest[`customField${num}Enabled`];
          const fieldLabel = rest[`customField${num}Label`];
          const fieldName = `customField${num}Value` as const;

          return (
            <form.AppField key={fieldName} name={fieldName}>
              {(field) => {
                // const errorMsg =
                // errors?.[0]?.[field.name]?.[0]?.message;

                return (
                  <td className={tdClassNames}>
                    {isFieldEnabled && (
                      <form.Subscribe
                        selector={(state) => {
                          return {
                            errors: state.errors,
                            value: state.values[`customField${num}Value`],
                          };
                        }}
                      >
                        {({ errors: _errors, value }) => {
                          return (
                            <div className="flex gap-1 items-center">
                              <field.ComboboxField
                                allowCreatable
                                defaultValue={{ id: value, label: value }}
                                error={field.state.meta.errors.join(',')}
                                hideLabel
                                items={customFields[
                                  `customField${num}Values`
                                ].map((label) => {
                                  return { id: label, label };
                                })}
                                label={fieldLabel}
                                onValueChange={(value) => {
                                  field.setValue(String(value?.id));
                                }}
                                placeholder={`${fieldLabel || ''}...`}
                                required
                              />
                              <Popover
                                Description={`Want to add a new item to the list? Just type it out and click on the "Add" option.`}
                              />
                            </div>
                          );
                        }}
                      </form.Subscribe>
                    )}
                  </td>
                );
              }}
            </form.AppField>
          );
        })}

        <td className={tdClassNames}>
          <form.AppField
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
              return (
                <form.Subscribe
                  selector={(state) => {
                    return {
                      errors: state.errors,
                      value: state.values.isSpecialEdition,
                    };
                  }}
                >
                  {({ errors: _errors, value }) => {
                    // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                    // const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      <field.CheckboxField
                        checked={value}
                        error={field.state.meta.errors.join(',')}
                        label="Is this a special edition?"
                        onCheckedChange={field.handleChange}
                      />
                    );
                  }}
                </form.Subscribe>
              );
            }}
          </form.AppField>
          <form.AppField name="editionDetails">
            {(field) => {
              return (
                <form.Subscribe
                  selector={(state) => {
                    return {
                      errors: state.errors,
                      isSpecialEdition: state.values.isSpecialEdition,
                      value: state.values.editionDetails,
                    };
                  }}
                >
                  {({ errors: _errors, isSpecialEdition, value }) => {
                    // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                    // const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      isSpecialEdition && (
                        <field.TextAreaField
                          error={field.state.meta.errors.join(',')}
                          label="Edition details"
                          name={field.name}
                          onValueChange={field.handleChange}
                          required
                          value={value}
                        />
                      )
                    );
                  }}
                </form.Subscribe>
              );
            }}
          </form.AppField>
        </td>

        <td className={tdClassNames}>
          <form.AppField name="notes">
            {(field) => {
              return (
                <form.Subscribe
                  selector={(state) => {
                    return {
                      errors: state.errors,
                      value: state.values.notes,
                    };
                  }}
                >
                  {({ errors: _errors, value }) => {
                    // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                    // const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    return (
                      <field.TextAreaField
                        error={field.state.meta.errors.join(',')}
                        name={field.name}
                        onValueChange={field.handleChange}
                        placeholder="Input notes..."
                        value={value}
                      />
                    );
                  }}
                </form.Subscribe>
              );
            }}
          </form.AppField>
        </td>

        <td className={tdClassNames}>-</td>
        <td className={tdClassNames}>
          <div className="flex align-items-center gap-2 justify-end">
            <Button onClick={onCancel} text="Cancel" variant="mono" />

            <form.AppForm>
              <form.Button
                className="flex flex-nowrap gap-2"
                disabled={!form.state.isFormValid}
                processing={form.state.isSubmitting}
                type="submit"
              >
                <SaveIcon />
                Save
              </form.Button>
            </form.AppForm>
          </div>
        </td>
      </tr>
    );
  },
});
