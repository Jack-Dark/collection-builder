import { getCreateDefaultZustandStore } from '#/helpers/get-create-default-zustand-state';

const createCollectionDetailsCustomFieldsStore = () => {
  const createNotificationsStore = getCreateDefaultZustandStore<{
    customField1Values: string[];
    customField2Values: string[];
    customField3Values: string[];
  }>({
    customField1Values: [],
    customField2Values: [],
    customField3Values: [],
  });

  return () => {
    const { setValue: setCustomFields, value: customFields } =
      createNotificationsStore();

    const addToCustomField1Values = (newValue: string) => {
      const customFields1Set = new Set(customFields.customField1Values);

      if (newValue) {
        customFields1Set.add(newValue);
      }

      const customField1Values = [...customFields1Set].sort();

      setCustomFields((prev) => {
        return {
          ...prev,
          customField1Values,
        };
      });
    };

    const addToCustomField2Values = (newValue: string) => {
      const customFields2Set = new Set(customFields.customField2Values);

      if (newValue) {
        customFields2Set.add(newValue);
      }

      const customField2Values = [...customFields2Set].sort();

      setCustomFields((prev) => {
        return {
          ...prev,
          customField2Values,
        };
      });
    };

    const addToCustomField3Values = (newValue: string) => {
      const customFields3Set = new Set(customFields.customField3Values);

      if (newValue) {
        customFields3Set.add(newValue);
      }

      const customField3Values = [...customFields3Set].sort();

      setCustomFields((prev) => {
        return {
          ...prev,
          customField3Values,
        };
      });
    };

    return {
      addToCustomField1Values,
      addToCustomField2Values,
      addToCustomField3Values,
      customFields,
      setCustomFields,
    };
  };
};

export const useCollectionDetailsCustomFieldsStore =
  createCollectionDetailsCustomFieldsStore();
