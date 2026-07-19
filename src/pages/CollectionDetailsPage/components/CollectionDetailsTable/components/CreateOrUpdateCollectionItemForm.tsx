import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { useRef } from 'react';

import { createCloudinaryUrl } from '#/api/routes/cloudinary/cloudinary-url';
import { Button } from '#/components/Button';
import { Image } from '#/components/Image';
import { SimpleErrorBoundary } from '#/components/SimpleErrorBoundary';
import { getFieldError } from '#/helpers/get-field-error';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';
import { Route } from '#/routes/_protected/collections/$id';

import {
  addCollectionItemFormDefaultValues,
  createNewCollectionItem,
  withCollectionDetailsForm,
} from '../../../CollectionDetailsPage.form';

export const CreateOrUpdateCollectionItemFormNameField =
  withCollectionDetailsForm({
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

export const CreateOrUpdateCollectionItemFormImagesField =
  withCollectionDetailsForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
    props: { index: 0 },
    render: ({ form, index }) => {
      const fileInputRef = useRef<HTMLInputElement>(null);

      return (
        <form.AppField mode="array" name="collectionItems">
          {() => {
            return (
              <form.AppField name={`collectionItems[${index}].images`}>
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

                        const src =
                          previewUrl || createCloudinaryUrl({ publicId });

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
          }}
        </form.AppField>
      );
    },
  });

export const CreateOrUpdateCollectionItemFormEditionFields =
  withCollectionDetailsForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
    props: { index: 0 },
    render: ({ form, index }) => {
      return (
        <form.AppField mode="array" name="collectionItems">
          {() => {
            return (
              <div className="grid gap-2">
                <form.AppField
                  listeners={{
                    onChange: ({ value: isSpecialEdition }) => {
                      form.setFieldValue(
                        `collectionItems[${index}].editionDetails`,
                        isSpecialEdition ? "Collector's Edition" : '',
                      );
                    },
                  }}
                  name={`collectionItems[${index}].isSpecialEdition`}
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

                <form.AppField
                  name={`collectionItems[${index}].editionDetails`}
                >
                  {(field) => {
                    return (
                      <form.Subscribe
                        selector={(state) => {
                          return {
                            isSpecialEdition:
                              state.values.collectionItems[index]
                                .isSpecialEdition,
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
          }}
        </form.AppField>
      );
    },
  });

export const CreateOrUpdateCollectionItemFormNotesField =
  withCollectionDetailsForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
    props: { index: 0 },
    render: ({ form, index }) => {
      return (
        <form.AppField mode="array" name="collectionItems">
          {() => {
            return (
              <form.AppField name={`collectionItems[${index}].notes`}>
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
          }}
        </form.AppField>
      );
    },
  });

export const CreateOrUpdateCollectionItemFormActions =
  withCollectionDetailsForm({
    /** These values are only used for type-checking, and are not used at runtime */
    defaultValues: addCollectionItemFormDefaultValues,
    props: {
      index: 0,
    },
    render: ({ form, index }) => {
      const { getLastNewRecordIndex, removeFromIsEditingRowIds } =
        useEditingCollectionItemsRowIds();

      const isLastNewRecordIndex = getLastNewRecordIndex() === index;

      return (
        <form.AppField mode="array" name="collectionItems">
          {(collectionItemsField) => {
            return (
              <div className="grid gap-2 justify-start">
                <form.AppField name={`collectionItems[${index}]`}>
                  {(field) => {
                    return (
                      <>
                        <Button
                          Icon={ClearIcon}
                          onClick={() => {
                            collectionItemsField.removeValue(index);
                            removeFromIsEditingRowIds(
                              String(field.state.value.id),
                            );
                          }}
                          text="Remove"
                          variant="mono"
                        />

                        {isLastNewRecordIndex && (
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
                                  <AddNewCollectionItemButton
                                    disabled={isPristine || !isFormValid}
                                    form={form}
                                    insertAtIndex={index + 1}
                                    text="Another"
                                  />
                                </form.AppForm>
                              );
                            }}
                          </form.Subscribe>
                        )}
                      </>
                    );
                  }}
                </form.AppField>
              </div>
            );
          }}
        </form.AppField>
      );
    },
  });

export const AddNewCollectionItemButton = withCollectionDetailsForm({
  /** These values are only used for type-checking, and are not used at runtime */
  defaultValues: addCollectionItemFormDefaultValues,
  props: {
    disabled: false,
    insertAtIndex: 0,
    text: '',
  },
  render: ({ disabled, form, insertAtIndex, text }) => {
    const { id } = Route.useParams();

    const { addToEditingRowIds } = useEditingCollectionItemsRowIds();

    return (
      <form.AppField mode="array" name="collectionItems">
        {(collectionItemsField) => {
          return (
            <Button
              disabled={disabled}
              Icon={AddIcon}
              onClick={() => {
                const newCollectionItem = createNewCollectionItem({
                  collectionId: Number(id),
                });

                collectionItemsField.insertValue(
                  insertAtIndex,
                  newCollectionItem,
                );

                addToEditingRowIds(newCollectionItem.id);
              }}
              text={text}
              variant="secondary"
            />
          );
        }}
      </form.AppField>
    );
  },
});

export const CreateOrUpdateCollectionItemSubmitButton =
  withCollectionDetailsForm({
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
