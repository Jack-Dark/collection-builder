export const CollectionsListCustomFieldCell = (props: { value: string }) => {
  const { value } = props;

  return <p>{value || '-'}</p>;
};
