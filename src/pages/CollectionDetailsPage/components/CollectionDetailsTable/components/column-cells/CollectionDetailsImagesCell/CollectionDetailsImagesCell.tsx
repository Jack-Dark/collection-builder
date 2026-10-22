import type { ZoomableImagePropsDef } from '#/components/ZoomableThumbnail/ZoomableThumbnail.types';
import type { CreateOrUpdateCollectionItemFormTypeDef } from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { thumbnailSize } from '#/api/routes/cloudinary/cloudinary-url';
import { ZoomableThumbnail } from '#/components/ZoomableThumbnail';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionDetailsPage/hooks/use-editing-collection-items-row-ids';

import { CollectionDetailsImagesField } from './components/CollectionDetailsImagesField';

/** `children` should be the editing field view. */
export const CollectionDetailsImagesCell = (props: {
  form: CreateOrUpdateCollectionItemFormTypeDef;
  rowId: string;
  rowIndex: number;
}) => {
  const { form, rowId, rowIndex } = props;

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(rowId);

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {isEditingRow ? (
        <CollectionDetailsImagesField form={form} rowIndex={rowIndex} />
      ) : (
        <form.Field name={`collectionItems[${rowIndex}].name`}>
          {(nameField) => {
            return (
              <form.Field name={`collectionItems[${rowIndex}].images`}>
                {(imagesField) => {
                  return imagesField.value.length ? (
                    <>
                      {imagesField.value.map((data, index) => {
                        const isPublicId = typeof data === 'string';

                        const key: string = isPublicId ? data : data.previewUrl;

                        const image: ZoomableImagePropsDef = isPublicId
                          ? { publicId: data }
                          : { src: data.previewUrl };

                        const thumbnail: ZoomableImagePropsDef = isPublicId
                          ? {
                              height: thumbnailSize,
                              publicId: data,
                              width: thumbnailSize,
                            }
                          : { src: data.previewUrl };

                        // TODO - IMPROVEMENT: UPDATE TO SLIDESHOW
                        return (
                          <div
                            className="p-1 size-14 border border-theme-divider-3 bg-theme-surface-2 text-theme-t2 hover:border-theme-link-hover hover:text-theme-link-hover"
                            key={key}
                          >
                            <ZoomableThumbnail
                              alt={`${nameField.value} image ${index + 1}`}
                              image={image}
                              thumbnail={thumbnail}
                            />
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p>-</p>
                  );
                }}
              </form.Field>
            );
          }}
        </form.Field>
      )}
    </div>
  );
};
