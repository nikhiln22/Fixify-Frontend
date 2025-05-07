import { getAllUsers, toggleUserStatus } from "../services/admin.services";
import { usePaginatedList } from "./usePaginatedList";
import { Iuser } from "../models/user";

const useUsers = () => {
  const {
    data: users,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    refetch,
  } = usePaginatedList<Iuser>(getAllUsers);

  const handleStatusToggle = async (userId: string) => {
    try {
      await toggleUserStatus(userId);
      await refetch();
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  return {
    users,
    currentPage,
    totalPages,
    loading,
    error,
    setCurrentPage,
    handleStatusToggle,
  };
};

export default useUsers;
