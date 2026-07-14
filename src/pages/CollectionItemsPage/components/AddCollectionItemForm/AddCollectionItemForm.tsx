import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useRef } from 'react';

import { Button } from '#/components/Button';
import { Popover } from '#/components/Popover';
import { SimpleErrorBoundary } from '#/components/SimpleErrorBoundary';

import {
  addCollectionItemFormDefaultValues,
  withAddCollectionItemForm,
} from './add-or-update-collection-item-form.schema';

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

        <td className={tdClassNames}>
          <form.AppField name="images">
            {(field) => {
              return (
                <form.Subscribe
                  selector={(state) => {
                    return {
                      errors: state.errors,
                      name: state.values.name,
                      value: state.values.images,
                    };
                  }}
                >
                  {({ errors: _errors, name, value }) => {
                    // TODO - EXTRACT ERROR MESSAGE (AND IDEALLY SUBSCRIBE) LOGIC
                    // const errorMsg = errors?.[0]?.[field.name]?.[0]?.message;

                    const inputRef = useRef<HTMLInputElement>(null);

                    return (
                      <div className="flex gap-2 flex-wrap">
                        {value.map((file, index) => {
                          const src =
                            typeof file === 'string' ? file : file.previewUrl;

                          return (
                            <SimpleErrorBoundary key={src}>
                              <div className="grid grid-rows-[auto_1fr] items-center w-25 h-25  bg-white border border-gray-400 text-gray-500">
                                <div className="flex justify-end p-1 border-b border-gray-400">
                                  <DeleteIcon
                                    className="cursor-pointer"
                                    fontSize="small"
                                    onClick={() => {
                                      return field.handleChange(
                                        value.filter((string) => {
                                          return string !== src;
                                        }),
                                      );
                                    }}
                                  />
                                </div>
                                <div className="w-full h-full overflow-hidden">
                                  <img
                                    alt={`${field.name} thumbnail ${index + 1}`}
                                    className="w-full h-full object-contain"
                                    src={src}
                                  />
                                </div>
                              </div>
                            </SimpleErrorBoundary>
                          );
                        })}
                        <SimpleErrorBoundary>
                          <div
                            className="grid items-center justify-center w-25 h-25 border border-gray-400 text-gray-500 cursor-pointer"
                            onClick={() => {
                              inputRef.current?.click();
                            }}
                            title="Upload"
                          >
                            <AddIcon fontSize="large" />
                          </div>
                          <input
                            accept="image/*"
                            autoFocus
                            capture="environment"
                            className="size-0 overflow-hidden"
                            multiple
                            name={field.name}
                            onChange={async (event) => {
                              const selectedFiles = event?.target?.files || [];

                              const files = [...selectedFiles].map((file) => {
                                return {
                                  file,
                                  previewUrl: URL.createObjectURL(file),
                                };
                              });

                              return field.handleChange([...value, ...files]);
                            }}
                            placeholder="Input name..."
                            ref={inputRef}
                            required
                            type="file"
                          />
                        </SimpleErrorBoundary>
                      </div>
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
                          const value = state.values[`customField${num}Value`];

                          return {
                            errors: state.errors,
                            value,
                          };
                        }}
                      >
                        {({ errors: _errors, value }) => {
                          const items = customFields[`customField${num}Values`];

                          return (
                            <div className="flex gap-1 items-center">
                              <field.ComboboxField
                                createCreatable={(query) => {
                                  return query;
                                }}
                                error={field.state.meta.errors.join(',')}
                                hideLabel
                                inputValue={value}
                                isItemEqualToValue={(item, value) => {
                                  return item === value;
                                }}
                                items={items}
                                itemToStringLabel={(item) => {
                                  return item;
                                }}
                                itemToStringValue={(item) => {
                                  return item;
                                }}
                                label={fieldLabel}
                                onValueChange={(value) => {
                                  field.setValue(value || '');
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
          <div className="grid gap-2">
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
                        <field.SwitchField
                          checked={value}
                          error={field.state.meta.errors.join(',')}
                          label="Special edition"
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
          </div>
        </td>

        <td className={tdClassNames} colSpan={2}>
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
          </div>
        </td>

        <td className={tdClassNames} />
      </tr>
    );
  },
});
