import { useState } from "react";
import { getAllUsers, toggleUserStatus } from "../services/admin.services";
import { usePaginatedList } from "./usePaginatedList";
import { Iuser } from "../models/user";

const useUsers = () => {
  const {
    data: users,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error
  } = usePaginatedList<Iuser>(getAllUsers);

  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(null);

  const handleStatusToggle = async (userId: string) => {
    setStatusUpdateLoading(userId);
    try {
      const result = await toggleUserStatus(userId);
      if (result) {
        setData(prevUsers =>
          prevUsers.map(user =>
            user._id === userId
              ? (result.data || { ...user, status: !user.status })
              : user
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  return {
    users,
    setData,
    totalPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    handleStatusToggle,
    statusUpdateLoading
  };
};

export default useUsers;