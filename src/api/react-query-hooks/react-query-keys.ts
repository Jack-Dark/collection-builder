export const reactQueryKeys = {
  getCollectionDetailsById: 'get-collection-details',
  getNavMenuCollections: 'get-nav-menu-collections',
  getPaginatedCollections: 'get-paginated-collections',
} as const;

export const reactMutationKeys = {
  createCollectionItems: 'create-collection-items',
  createCollections: 'create-collections',
  deleteCollectionItems: 'delete-collection-items',
  deleteCollections: 'delete-collections',
  updateCollectionItems: 'update-collection-items',
  updateCollections: 'update-collections',
} as const;
