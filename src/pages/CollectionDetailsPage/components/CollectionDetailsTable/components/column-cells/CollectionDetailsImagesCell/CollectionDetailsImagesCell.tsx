import type { CellContext } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

import { useSelector } from '@tanstack/react-store';

import type { TTableFeatures } from '#/components/Table';
import type { ZoomableImagePropsDef } from '#/components/ZoomableThumbnail/ZoomableThumbnail.types';
import type {
  CreateOrUpdateCollectionItemFormRowDataDef,
  CreateOrUpdateCollectionItemFormTypeDef,
} from '#/pages/CollectionDetailsPage/CollectionDetailsPage.types';

import { thumbnailSize } from '#/api/routes/cloudinary/cloudinary-url';
import { ZoomableThumbnail } from '#/components/ZoomableThumbnail';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

/** `children` should be the editing field view. */
export const CollectionDetailsImagesCell = (
  props: PropsWithChildren<
    CellContext<
      TTableFeatures,
      CreateOrUpdateCollectionItemFormRowDataDef,
      CreateOrUpdateCollectionItemFormRowDataDef['images']
    > & {
      form: CreateOrUpdateCollectionItemFormTypeDef;
    }
  >,
) => {
  const { children, form, row } = props;

  const name = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[row.index].name;
  });
  const images = useSelector(form.atom, ({ values }) => {
    return values.collectionItems[row.index].images;
  });

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(row.id);

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {isEditingRow ? (
        children
      ) : images.length ? (
        <>
          {images.map((data, index) => {
            const isPublicId = typeof data === 'string';

            const key: string = isPublicId ? data : data.previewUrl;

            const image: ZoomableImagePropsDef = isPublicId
              ? { publicId: data }
              : { src: data.previewUrl };

            const thumbnail: ZoomableImagePropsDef = isPublicId
              ? { height: thumbnailSize, publicId: data, width: thumbnailSize }
              : { src: data.previewUrl };

            return (
              <div
                className="p-1 size-14 bg-white border border-gray-400 text-gray-500"
                key={key}
              >
                <ZoomableThumbnail
                  alt={`${name} image ${index + 1}`}
                  image={image}
                  thumbnail={thumbnail}
                />
              </div>
            );
          })}
        </>
      ) : (
        <p>-</p>
      )}
    </div>
  );
};
