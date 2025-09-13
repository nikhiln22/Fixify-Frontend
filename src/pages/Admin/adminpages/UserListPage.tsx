import { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { getUsersColumns } from "../../../constants/tablecolumns/getUsersColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import SelectField from "../../../components/common/SelectField";
import { Search } from "lucide-react";
import { getAllUsers, toggleUserStatus } from "../../../services/userServices";
import { usePaginatedList } from "../../../hooks/usePaginatedList";

export const UserListPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const itemsPerPage = 6;

  const filterOptions = [
    { value: "", label: "All Users" },
    { value: "active", label: "Active Users" },
    { value: "blocked", label: "Blocked Users" },
  ];

  const {
    data: users,
    setData: setUsers,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
  } = usePaginatedList(
    getAllUsers,
    searchQuery,
    filterStatus,
    itemsPerPage
  );

  const handleStatusToggle = async (userId: string) => {
    try {
      const result = await toggleUserStatus(userId);
      if (result) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, status: result.data.status } : user
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const columns = getUsersColumns(handleStatusToggle);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [inputValue, setCurrentPage]);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          User Management
        </h1>
        <p className="text-gray-600">Manage and monitor all registered users</p>
      </div>

      <div className="mb-4 flex justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search users..."
            value={inputValue}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-gray-500 absolute right-3 top-2.5" />
        </div>
        <div className="w-48">
          <SelectField
            label=""
            name="userFilter"
            value={filterStatus}
            onChange={handleFilterChange}
            options={filterOptions}
            placeholder="Filter users"
            className="mb-0"
          />
        </div>
      </div>

      <div className="px-4">
        <Table
          data={users || []}
          columns={columns}
          currentPage={currentPage}
          loading={loading}
          pageSize={itemsPerPage}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
};
