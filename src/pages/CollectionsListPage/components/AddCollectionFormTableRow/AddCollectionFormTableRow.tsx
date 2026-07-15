import SaveIcon from '@mui/icons-material/Save';

import { Button } from '#/components/Button';
import { SwitchField } from '#/components/Fields/SwitchField';

import {
  addCollectionFormDefaultValues,
  withAddCollectionForm,
} from './constants';

export const AddCollectionFormTableRow = withAddCollectionForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionFormDefaultValues,
  props: {
    onCancel: () => {},
    tdClassNames: '',
  },
  render: ({ form, onCancel, tdClassNames }) => {
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
                        name={field.name}
                        onValueChange={field.handleChange}
                        // error={errorMsg}
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

        {([1, 2, 3] as const).map((num) => {
          return (
            <td className={tdClassNames} key={num}>
              <div className="grid gap-2">
                <form.Subscribe
                  selector={(state) => {
                    return {
                      errors: state.errors,
                      isEnabled: state.values[`customField${num}Enabled`],
                      label: state.values[`customField${num}Label`] || '',
                    };
                  }}
                >
                  {({ errors: _errors, isEnabled, label }) => {
                    return (
                      <>
                        <form.AppField name={`customField${num}Enabled`}>
                          {(field) => {
                            // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                            // const errorMsg =
                            //   errors?.[0]?.[field.name]?.[0]?.message;

                            return (
                              <SwitchField
                                checked={isEnabled}
                                // error={errorMsg}
                                label="Enable"
                                name={field.name}
                                onCheckedChange={field.handleChange}
                              />
                            );
                          }}
                        </form.AppField>

                        {isEnabled && (
                          <form.AppField name={`customField${num}Label`}>
                            {(field) => {
                              return (
                                <field.InputField
                                  onValueChange={field.handleChange}
                                  // error={errorMsg}
                                  placeholder="Field name..."
                                  required
                                  value={label}
                                />
                              );
                            }}
                          </form.AppField>
                        )}
                      </>
                    );
                  }}
                </form.Subscribe>
              </div>
            </td>
          );
        })}

        <td className={tdClassNames}>
          <div className="grid gap-2">
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
                          // error={errorMsg}
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

            <div className="flex align-items-center gap-2 justify-end">
              <Button onClick={onCancel} text="Cancel" variant="mono" />

              <form.AppForm>
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
                      <form.Button
                        className="flex flex-nowrap gap-2"
                        disabled={!isFormValid}
                        processing={form.state.isSubmitting}
                        type="submit"
                      >
                        <SaveIcon />
                        Save
                      </form.Button>
                    );
                  }}
                </form.Subscribe>
              </form.AppForm>
            </div>
          </div>
        </td>

        <td className={tdClassNames} />
      </tr>
    );
  },
});
