import type {
  AccessorKeyColumnDefBase,
  CellContext,
} from '@tanstack/react-table';

import { createColumnHelper } from '@tanstack/react-table';
import formatDate, { masks } from 'dateformat';

import type { CollectionItemRecordDef } from '#/api/routes/collection-items/collection-item.types';
import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';

import { createCloudinaryThumbnail } from '#/api/routes/cloudinary/cloudinary-url';
import { useDeleteCollectionItemById } from '#/api/routes/collection-items/delete-collection-item-by-id/delete-collection-item-by-id.react-query';
import { useInvalidateGetCollectionDetailsById } from '#/api/routes/collection-items/get-collection-details-by-id/get-collection-details-by-id.react-query';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { TableCellActionsMenu } from '../../components/TableCellActionsMenu';
import { useEditingCollectionItemsRowIds } from '../CollectionsListPage/hooks/use-editing-collections-row-ids';
import { useCollectionItemsFormStore } from './CollectionItemsPage';

const columnHelper = createColumnHelper<CollectionItemRecordDef>();

export const getCollectionItemsTableColumns = (props: CollectionRecordDef) => {
  const {
    customField1Enabled,
    customField1Label,
    customField2Enabled,
    customField2Label,
    customField3Enabled,
    customField3Label,
  } = props;

  return [
    columnHelper.accessor('name', {
      cell: ({ getValue }) => {
        return <p>{getValue()}</p>;
      },
      header: 'Name',
      size: 200,
    }),
    columnHelper.accessor('images', {
      cell: ({ getValue, row }) => {
        const images = getValue();

        return images.length ? (
          <div className="flex flex-wrap gap-1 items-center">
            {images.map((publicId, index) => {
              return (
                <div
                  className="p-1 size-14 bg-white border border-gray-400 text-gray-500"
                  key={publicId}
                >
                  <div className="w-full h-full overflow-hidden">
                    <img
                      alt={`${row.original.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-contain"
                      src={createCloudinaryThumbnail({
                        publicId,
                      })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>-</p>
        );
      },
      header: 'Images',
      minSize: 200,
    }),
    customField1Enabled &&
      columnHelper.accessor('customField1Value', {
        cell: ({ getValue }) => {
          return <p>{getValue()}</p>;
        },
        header: customField1Label || '',
        minSize: 200,
      }),
    customField2Enabled &&
      columnHelper.accessor('customField2Value', {
        cell: ({ getValue }) => {
          return <p>{getValue()}</p>;
        },
        header: customField2Label || '',
        minSize: 200,
      }),
    customField3Enabled &&
      columnHelper.accessor('customField3Value', {
        cell: ({ getValue }) => {
          return <p>{getValue()}</p>;
        },
        header: customField3Label || '',
        minSize: 200,
      }),
    columnHelper.accessor('editionDetails', {
      cell: ({ getValue }) => {
        return <p>{getValue() || '-'}</p>;
      },
      header: 'Edition',
      minSize: 200,
    }),
    columnHelper.accessor('notes', {
      cell: ({ getValue }) => {
        return <p>{getValue() || '-'}</p>;
      },
      header: 'Notes',
      minSize: 210,
    }),
    columnHelper.accessor('createdAt', {
      cell: ({ getValue }) => {
        const date = getValue();

        return date ? <p>{formatDate(date, masks.paddedShortDate)}</p> : null;
      },
      header: 'Added',
      size: 120,
    }),
    columnHelper.accessor('id', {
      cell: (context) => {
        return <CollectionDetailsActionsCell {...context} />;
      },
      header: '',
      id: 'actions',
      size: 40,
    }),
  ].filter(Boolean) as AccessorKeyColumnDefBase<CollectionItemRecordDef>[];
};

const CollectionDetailsActionsCell = ({
  getValue,
  row,
}: CellContext<CollectionItemRecordDef, number>) => {
  const invalidateGetCollectionDetailsById =
    useInvalidateGetCollectionDetailsById();

  const { id } = CollectionRoute.useParams();
  const collectionId = Number(id);

  const { isPending: isDeletePending, onDeleteCollectionItemById } =
    useDeleteCollectionItemById({
      onSuccess: async () => {
        await invalidateGetCollectionDetailsById({
          id: collectionId,
        });
      },
    });

  const { resetFormValues, setFormValues } = useCollectionItemsFormStore();

  const collectionItemId = getValue();

  const { getIsEditingRowId, resetEditingRowIds, setEditingRowIds } =
    useEditingCollectionItemsRowIds();

  const isEditingRow = getIsEditingRowId(collectionItemId);

  return (
    <TableCellActionsMenu
      deleteIsDisabled={isDeletePending}
      deleteOnClick={async () => {
        await onDeleteCollectionItemById({
          collectionItemId,
        });
      }}
      editIsDisabled={isDeletePending}
      editOnClick={async (record) => {
        setFormValues(record);
        setEditingRowIds([collectionItemId]);
      }}
      isEditing={isEditingRow}
      onCancelEdit={() => {
        resetFormValues();
        resetEditingRowIds();
      }}
      row={row}
    />
  );
};
