import React, { useState, useCallback, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { AddCategory } from "../../../components/admin/AddCategory";
import {
  createCategory,
  updateCategory,
  toggleCategoryStatus,
} from "../../../services/admin.services";
import { getAllCategories } from "../../../services/common.services";
import { getCategoriesColumns } from "../../../constants/tablecolumns/CategoryColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { Icategory } from "../../../models/category";
import { showToast } from "../../../utils/toast";
import { Search } from "lucide-react";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import SelectField from "../../../components/common/SelectField";

export const CategoryListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Icategory | null>(
    null,
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const itemsPerPage = 6;

  const filterOptions = [
    { value: "", label: "All Categories" },
    { value: "active", label: "Active Categories" },
    { value: "blocked", label: "Blocked Categories" },
  ];

  const fetchCategoriesWithSearch = useCallback(
    async (page: number) => {
      console.log("Fetching categories with:", {
        page,
        searchQuery,
        filterStatus,
      });
      return await getAllCategories(page, searchQuery, "admin", filterStatus);
    },
    [searchQuery, filterStatus],
  );

  const {
    data: categories,
    setData: setCategories,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(fetchCategoriesWithSearch);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("Filter changed to:", e.target.value);
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

  const handleOpenAddModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category: Icategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleSubmitCategory = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (selectedCategory) {
        const response = await updateCategory(selectedCategory._id, formData);
        if (response && categories) {
          setCategories(
            categories.map((cat) =>
              cat._id === selectedCategory._id ? response.data : cat,
            ),
          );
          showToast({
            message: "Category updated successfully",
            type: "success",
          });
        }
      } else {
        const response = await createCategory(formData);
        console.log(
          "response from the create category method in the add category ",
        );
        if (response && categories) {
          const firstPageItems = [
            response.data,
            ...categories.slice(0, itemsPerPage - 1),
          ];

          setCategories(firstPageItems);

          if (currentPage !== 1) {
            setCurrentPage(1);
          }

          showToast({
            message: "Category added successfully",
            type: "success",
          });
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error(
        `Error ${selectedCategory ? "updating" : "creating"} category:`,
        error,
      );
      showToast({
        message: `Failed to ${selectedCategory ? "update" : "add"} category`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (categoryId: string) => {
    try {
      const result = await toggleCategoryStatus(categoryId);
      if (result) {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category._id === categoryId
              ? result.data || { ...category, status: !category.status }
              : category,
          ),
        );
      }

      const category = categories.find((cat) => cat._id === categoryId);
      const statusLabel = category?.status ? "unblocked" : "blocked";
      showToast({
        message: `Category ${statusLabel} successfully`,
        type: "success",
      });

      return result;
    } catch (error) {
      console.error("Failed to toggle category status:", error);
      showToast({
        message: "Failed to update category status",
        type: "error",
      });
      throw error;
    }
  };

  const columns = getCategoriesColumns(handleStatusToggle, handleOpenEditModal);

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Categories</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={inputValue}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="w-5 h-5 text-gray-500 absolute right-3 top-2.5" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-48">
              <SelectField
                label=""
                name="categoryFilter"
                value={filterStatus}
                onChange={handleFilterChange}
                options={filterOptions}
                placeholder="Filter categories"
                className="mb-0"
              />
            </div>
            <Button
              onClick={handleOpenAddModal}
              className="h-10 px-4 py-2 whitespace-nowrap"
            >
              Add Category
            </Button>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 mb-2 px-4">{error}</p>}
      <div className="px-4">
        <Table
          data={categories || []}
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
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCategory ? "Edit Category" : "Add Category"}
      >
        <div className="w-full">
          <AddCategory
            onSubmit={handleSubmitCategory}
            onCancel={handleCloseModal}
            isLoading={isLoading}
            initialValues={
              selectedCategory
                ? {
                    _id: selectedCategory._id,
                    categoryName: selectedCategory.name,
                    categoryImage: selectedCategory.image || null,
                  }
                : undefined
            }
            isEditing={!!selectedCategory}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default CategoryListPage;
