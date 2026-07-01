import type { RouteComponent } from '@tanstack/react-router';

import { useState } from 'react';

import { Button } from '#/components/Button';
import { Table } from '#/components/Table';
import { PageWrapper } from '#/page-wrapper';
import { Route as CollectionRoute } from '#/routes/_protected/collections/$id';

import { getCollectionItemsTableColumns } from './columns';
import { AddCollectionItemForm } from './components/AddCollectionItemForm';

export const CollectionPage: RouteComponent = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const { collection, customFields, items, lastAddedItem } =
    CollectionRoute.useLoaderData();

  const toggleForm = () => {
    setShowAddForm((prev) => {
      return !prev;
    });
  };

  return (
    <PageWrapper childrenClassName="grid gap-8" title={collection?.name || '-'}>
      {showAddForm ? (
        <div className="grid gap-4">
          <Button
            className="justify-self-start flex flex-nowrap gap-2"
            onClick={toggleForm}
            text="Cancel"
            variant="secondary"
          />

          <AddCollectionItemForm
            collectionId={collection.id}
            customField1Enabled={collection.customField1Enabled}
            customField1Label={collection.customField1Label || ''}
            customField2Enabled={collection.customField2Enabled}
            customField2Label={collection.customField2Label || ''}
            customField3Enabled={collection.customField3Enabled}
            customField3Label={collection.customField3Label || ''}
            customFields={customFields}
            lastAddedItem={lastAddedItem}
          />
        </div>
      ) : (
        <Button
          className="justify-self-start"
          onClick={toggleForm}
          text="Add Item"
          variant="primary"
        />
      )}

      <Table
        columns={getCollectionItemsTableColumns(collection)}
        data={items || []}
      />
    </PageWrapper>
  );
};
