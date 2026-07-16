import { createFormStore } from '../../../../helpers/create-form-store';
import { addCollectionItemFormDefaultValues } from '../../components/CreateOrUpdateCollectionItemForm/CreateOrUpdateCollectionItemForm.form';

export const useCollectionItemsFormStore = createFormStore(
  addCollectionItemFormDefaultValues,
);
