import type { CellContext } from '@tanstack/react-table';
import type { PropsWithChildren } from 'react';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/collection-item.types';

import { thumbnailSize } from '#/api/routes/cloudinary/cloudinary-url';
import { ZoomableThumbnail } from '#/components/ZoomableThumbnail';
import { useEditingCollectionItemsRowIds } from '#/pages/CollectionsListPage/hooks/use-editing-collections-row-ids';

/** `children` should be the editing field view. */
export const CollectionDetailsImagesCell = (
  props: PropsWithChildren<CellContext<CollectionItemRecordDef, string[]>>,
) => {
  const { children, getValue, row } = props;

  const images = getValue();

  const { getIsEditingRowId } = useEditingCollectionItemsRowIds();
  const isEditingRow = getIsEditingRowId(row.id);

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {isEditingRow ? (
        children
      ) : images.length ? (
        <>
          {images.map((publicId, index) => {
            return (
              <div
                className="p-1 size-14 bg-white border border-gray-400 text-gray-500"
                key={publicId}
              >
                <ZoomableThumbnail
                  alt={`${row.original.name} image ${index + 1}`}
                  image={{
                    publicId,
                  }}
                  thumbnail={{
                    height: thumbnailSize,
                    publicId,
                    width: thumbnailSize,
                  }}
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
