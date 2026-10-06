export const reactQueryKeys = {
  getCollectionDetailsById: 'get-collection-details',
  getCollectionItemsWithCustomFieldValue:
    'get-collection-items-with-custom-field-value',
  getCollectionsWithCustomFields: 'get-collections-with-custom-fields',
  getCustomFields: 'get-custom-fields',
  getCustomFieldValuesByCustomFieldId:
    'get-custom-field-values-by-custom-field-id',
  getNavMenuCollections: 'get-nav-menu-collections',
  getPaginatedCollections: 'get-paginated-collections',
} as const;

export const reactMutationKeys = {
  collectionItems: (type: MutationKeyType) => {
    return `${type}-collection-items` as const;
  },
  collections: (type: MutationKeyType) => {
    return `${type}-collections` as const;
  },
  /** @deprecated */
  createCollectionItems: 'create-collection-items',
  /** @deprecated */
  createCollections: 'create-collections',
  /** @deprecated */
  createCustomFields: 'create-custom-fields',
  customFields: (type: MutationKeyType) => {
    return `${type}-custom-fields` as const;
  },
  customFieldValues: (type: MutationKeyType) => {
    return `${type}-custom-field-values` as const;
  },
  /** @deprecated */
  deleteCollectionItems: 'delete-collection-items',
  /** @deprecated */
  deleteCollections: 'delete-collections',
  /** @deprecated */
  deleteCustomFields: 'delete-custom-field',
  /** @deprecated */
  updateCollectionItems: 'update-collection-items',
  /** @deprecated */
  updateCollections: 'update-collections',
  /** @deprecated */
  updateCustomFields: 'update-custom-fields',
} as const;

type MutationKeyType = 'create' | 'delete' | 'update';
