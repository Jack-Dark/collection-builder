import { useGetUsers } from '#/api/routes/users/get-users/get-users.react-query';
import { PageWrapper } from '#/components/PageWrapper';
import { Table } from '#/components/Table';

import { columns } from './AdminUsersPage.columns';

export const AdminUsersPage = () => {
  const { data } = useGetUsers({
    placeholderData: { users: [] },
    requestArgs: {},
  });

  return (
    <PageWrapper>
      <Table columns={columns} data={data.users} />
    </PageWrapper>
  );
};
