import AdminLayout from "../../../layouts/AdminLayout";
import useUsers from "../../../hooks/useUsers";
import { getUsersColumns } from "../../../constants/tablecolumns/getUsersColumn";
import TableWithPagination from "../../../components/common/TableWithPagination";

function UserListPage() {
  const {
    users,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusToggle,
    loading,
    error,
  } = useUsers();
  
  const columns = getUsersColumns(handleStatusToggle);
  
  return (
    <AdminLayout>
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold mb-4 text-center">
          User List
        </h1>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <TableWithPagination
        data={users}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={loading}
      />
    </AdminLayout>
  );
}

export default UserListPage;