import { useState } from "react";
import { toggleCategoryStatus } from "../services/admin.services";
import { getAllCategories } from "../services/common.services";
import { usePaginatedList } from "./usePaginatedList";
import { Icategory } from "../models/category";

const useCategories = () => {
  const {
    data: categories,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<Icategory>(getAllCategories);

  const [statusUpdateLoading, setStatusUpdateLoading] = useState<string | null>(
    null
  );

  const handleStatusToggle = async (categoryId: string) => {
    setStatusUpdateLoading(categoryId);
    try {
      const result = await toggleCategoryStatus(categoryId);
      if (result) {
        setData((prevCategories) =>
          prevCategories.map((category) =>
            category._id === categoryId
              ? result.data || { ...category, status: !category.status }
              : category
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle category status:", error);
    } finally {
      setStatusUpdateLoading(null);
    }
  };

  return {
    categories,
    setData,
    totalPages,
    loading,
    error,
    currentPage,
    setCurrentPage,
    handleStatusToggle,
    statusUpdateLoading,
  };
};

export default useCategories;
