import { createFormStore } from '../../../../helpers/create-form-store';
import { addCollectionItemFormDefaultValues } from '../../add-or-update-collection-item-form.form';

export const useCollectionItemsFormStore = createFormStore(
  addCollectionItemFormDefaultValues,
);
