export const reactQueryKeys = {
  getCollectionDetailsById: 'get-collection-details',
  getCollectionsWithCustomFields: 'get-collections-with-custom-fields',
  getCustomFields: 'get-custom-fields',
  getNavMenuCollections: 'get-nav-menu-collections',
  getPaginatedCollections: 'get-paginated-collections',
} as const;

export const reactMutationKeys = {
  createCollectionItems: 'create-collection-items',
  createCollections: 'create-collections',
  createCustomFields: 'create-custom-fields',
  deleteCollectionItems: 'delete-collection-items',
  deleteCollections: 'delete-collections',
  deleteCustomFields: 'delete-custom-field',
  updateCollectionItems: 'update-collection-items',
  updateCollections: 'update-collections',
  updateCustomFields: 'update-custom-fields',
} as const;
