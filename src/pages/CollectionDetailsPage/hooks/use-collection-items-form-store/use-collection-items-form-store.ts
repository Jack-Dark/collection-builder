import { createFormStore } from '../../../../helpers/create-form-store';
import { addCollectionItemFormDefaultValues } from '../../CollectionDetailsPage.form';

export const useCollectionItemsFormStore = createFormStore(
  addCollectionItemFormDefaultValues,
);
