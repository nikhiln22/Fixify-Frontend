import AdminLayout from "../../../layouts/AdminLayout";
import useUsers from "../../../hooks/useUsers";
import { getUsersColumns } from "../../../constants/tablecolumns/getUsersColumn";
import TableWithPagination from "../../../components/common/TableWithPagination";
import { useState } from "react";
import { Search } from "lucide-react"; 
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
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  
  const columns = getUsersColumns(handleStatusToggle);
  
  const handleSearch = (e: any) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.username?.toLowerCase().includes(term.toLowerCase()) ||
        user.email?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Users</h1>
        <div className="mb-4 w-full md:w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search 
              className="w-5 h-5 text-gray-500 absolute right-3 top-2.5" 
            />
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <TableWithPagination
        data={searchTerm.trim() === "" ? users : filteredUsers}
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