import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useRef } from 'react';

import { createCloudinaryUrl } from '#/api/routes/cloudinary/cloudinary-url';
import { Button } from '#/components/Button';
import { Image } from '#/components/Image';
import { Popover } from '#/components/Popover';
import { SimpleErrorBoundary } from '#/components/SimpleErrorBoundary';

import { getFieldError } from '../../../../helpers/get-field-error';
import {
  addCollectionItemFormDefaultValues,
  withAddCollectionItemForm,
} from './CreateOrUpdateCollectionItemForm.form';

export const CreateOrUpdateCollectionItemFormNameField =
  withAddCollectionItemForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
    render: ({ form }) => {
      return (
        <form.AppField name="name">
          {(field) => {
            return (
              <field.InputField
                autoFocus
                error={getFieldError(field)}
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
    },
  });

export const CreateOrUpdateCollectionItemFormImagesField =
  withAddCollectionItemForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
    render: ({ form }) => {
      const fileInputRef = useRef<HTMLInputElement>(null);

      return (
        <form.AppField name="images">
          {(field) => {
            const { value } = field.state;

            return (
              <>
                {value.map((image, index) => {
                  let publicId = '';
                  let previewUrl = '';

                  if (typeof image === 'string') {
                    publicId = image;
                  } else {
                    previewUrl = image.previewUrl;
                  }

                  const src = previewUrl || createCloudinaryUrl({ publicId });

                  return (
                    <SimpleErrorBoundary key={src}>
                      <div className="relative grid grid-rows-[auto_1fr] items-center p-1 size-14 bg-white border border-gray-400 text-gray-500">
                        <div
                          className="absolute right-0 top-0 flex justify-end p-4px bg-white border-l border-b border-gray-400 rounded-bl-sm text-lg hover:text-red-600 cursor-pointer"
                          onClick={() => {
                            const images = [...value];
                            images.splice(index, 1);

                            return field.handleChange(images);
                          }}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </div>
                        <div className="w-full h-full overflow-hidden">
                          <Image
                            alt={`${field.name} thumbnail ${index + 1}`}
                            src={src}
                          />
                        </div>
                      </div>
                    </SimpleErrorBoundary>
                  );
                })}
                <SimpleErrorBoundary>
                  <div
                    className="grid items-center justify-center size-14 border border-gray-400 text-gray-500 cursor-pointer"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    title="Upload"
                  >
                    <AddIcon fontSize="large" />
                  </div>
                  <input
                    accept=".jpg,.jpeg,.png,.webp"
                    autoFocus
                    capture="environment"
                    className="hidden"
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
                    ref={fileInputRef}
                    type="file"
                  />
                </SimpleErrorBoundary>
              </>
            );
          }}
        </form.AppField>
      );
    },
  });

export const CreateOrUpdateCollectionItemFormCustomField =
  withAddCollectionItemForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
    props: {
      fieldName: '',
      items: [''],
      label: '',
    },
    render: ({ fieldName, form, items, label }) => {
      const name = fieldName as `customField${1 | 2 | 3}Value`;

      return (
        <form.AppField name={name}>
          {(field) => {
            return (
              <div className="flex gap-1 items-center">
                <field.ComboboxField
                  createCreatable={(query) => {
                    return query;
                  }}
                  error={getFieldError(field)}
                  hideLabel
                  inputValue={field.state.value}
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
                  label={label}
                  onValueChange={(value) => {
                    field.setValue(value || '');
                  }}
                  placeholder={`${label || ''}...`}
                  required
                />
                <Popover
                  Description={`Want to add a new item to the list? Just type it out and click on the "Add" option.`}
                />
              </div>
            );
          }}
        </form.AppField>
      );
    },
  });

export const CreateOrUpdateCollectionItemFormEditionFields =
  withAddCollectionItemForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,

    render: ({ form }) => {
      return (
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
                <field.SwitchField
                  checked={field.state.value}
                  error={getFieldError(field)}
                  label="Special edition"
                  onCheckedChange={field.handleChange}
                />
              );
            }}
          </form.AppField>

          <form.AppField name="editionDetails">
            {(field) => {
              return (
                <form.Subscribe
                  selector={(state) => {
                    return {
                      isSpecialEdition: state.values.isSpecialEdition,
                    };
                  }}
                >
                  {({ isSpecialEdition }) => {
                    return (
                      isSpecialEdition && (
                        <field.TextAreaField
                          error={getFieldError(field)}
                          name={field.name}
                          onValueChange={field.handleChange}
                          required
                          value={field.state.value}
                        />
                      )
                    );
                  }}
                </form.Subscribe>
              );
            }}
          </form.AppField>
        </div>
      );
    },
  });

export const CreateOrUpdateCollectionItemFormNoteField =
  withAddCollectionItemForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
    render: ({ form }) => {
      return (
        <form.AppField name="notes">
          {(field) => {
            return (
              <field.TextAreaField
                error={getFieldError(field)}
                name={field.name}
                onValueChange={field.handleChange}
                placeholder="Input notes..."
                value={field.state.value}
              />
            );
          }}
        </form.AppField>
      );
    },
  });

export const CreateOrUpdateCollectionItemFormActions =
  withAddCollectionItemForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
    props: {
      onCancel: () => {},
    },
    render: ({ form, onCancel }) => {
      return (
        <div className="grid gap-2 justify-start">
          <CreateOrUpdateCollectionItemSubmitButton form={form} />

          <Button
            Icon={ClearIcon}
            onClick={onCancel}
            text="Cancel"
            variant="mono"
          />
        </div>
      );
    },
  });

export const CreateOrUpdateCollectionItemSubmitButton =
  withAddCollectionItemForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
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
