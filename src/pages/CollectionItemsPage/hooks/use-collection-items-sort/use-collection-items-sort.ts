import type { CollectionItemsTableColumn } from '#/api/routes/collection-items/collection-item.types';
import type { CollectionRecordDef } from '#/api/routes/collections/collection.types';

import { sortDirectionOptions } from '#/api/pagination/pagination.constants';

import {
  useOnUpdateCollectionItemsQueries,
  useFormatSortProps,
} from '../../components/CollectionItemsFiltersContent';

export const useCollectionItemsSort = (props: {
  collection: CollectionRecordDef;
}) => {
  const { collection } = props;

  const { onUpdateCollectionItemsQueries, searchQueries } =
    useOnUpdateCollectionItemsQueries();

  const sortProps = useFormatSortProps<CollectionItemsTableColumn>({
    items: [
      {
        bidirectional: true,
        field: 'name',
        label: 'Name',
      },
      { separator: true },
      {
        bidirectional: true,
        field: 'customField1Value',
        hide: !collection.customField1Enabled,
        label: collection.customField1Label,
      },
      { hide: !collection.customField1Enabled, separator: true },
      {
        bidirectional: true,
        field: 'customField2Value',
        hide: !collection.customField2Enabled,
        label: collection.customField2Label,
      },
      { hide: !collection.customField2Enabled, separator: true },
      {
        bidirectional: true,
        field: 'customField3Value',
        hide: !collection.customField3Enabled,
        label: collection.customField3Label,
      },
      { hide: !collection.customField3Enabled, separator: true },
      {
        bidirectional: true,
        field: 'createdAt',
        label: 'Date added',
      },
    ],
    onChange: (sort) => {
      onUpdateCollectionItemsQueries({
        sort: {
          direction: sort?.direction || sortDirectionOptions.asc,
          field: sort?.field || 'name',
        },
      });
    },
    searchQueries,
  });

  return sortProps;
};
