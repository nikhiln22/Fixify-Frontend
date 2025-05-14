import React, { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { AddCategory } from "../../../components/admin/AddCategory";
import {
  createCategory,
  updateCategory,
} from "../../../services/admin.services";
import useCategories from "../../../hooks/useCategory";
import { getCategoriesColumns } from "../../../constants/tablecolumns/CategoryColumn";
import TableWithPagination from "../../../components/common/TableWithPagination";
import { Icategory } from "../../../models/category";
import { showToast } from "../../../utils/toast"; 

export const CategoryListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Icategory | null>(
    null
  );
  const {
    categories,
    setData,
    currentPage,
    totalPages,
    setCurrentPage,
    handleStatusToggle,
    loading: categoriesLoading,
    error,
  } = useCategories();
  
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
          setData(
            categories.map((cat) =>
              cat._id === selectedCategory._id ? response.data : cat
            )
          );
          showToast({
            message: "Category updated successfully",
            type: "success"
          });
        }
      } else {
        const response = await createCategory(formData);
        if (response && categories) {
          setData([response.data, ...categories]);
          if (currentPage !== 1) {
            setCurrentPage(1);
          }

          showToast({
            message: "Category added successfully",
            type: "success"
          });
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error(
        `Error ${selectedCategory ? "updating" : "creating"} category:`,
        error
      );
      showToast({
        message: `Failed to ${selectedCategory ? "update" : "add"} category`,
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const wrappedHandleStatusToggle = async (categoryId: string) => {
    try {
      await handleStatusToggle(categoryId);
      const category = categories.find(cat => cat._id === categoryId);
      const statusLabel = category?.status ? "unblocked" : "blocked";
      showToast({
        message: `Category ${statusLabel} successfully`,
        type: "success"
      });
    } catch (error) {
      showToast({
        message: "Failed to update category status",
        type: "error"
      });
    }
  };
  
  const columns = getCategoriesColumns(wrappedHandleStatusToggle, handleOpenEditModal);
  
  return (
    <AdminLayout>
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold mb-4 text-center">Categories</h1>
        <Button onClick={handleOpenAddModal} className="mb-4">
          Add Category
        </Button>
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <TableWithPagination
        data={categories || []}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        loading={categoriesLoading}
      />
      <Modal
        isopen={isModalOpen}
        onclose={handleCloseModal}
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