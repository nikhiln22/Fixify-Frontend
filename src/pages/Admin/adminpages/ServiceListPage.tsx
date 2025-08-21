import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { AddService } from "../../../components/admin/AddService";
import {
  createService,
  updateService,
  toggleServiceStatus,
  getAllServices,
} from "../../../services/serviceService";
import { getAllCategories } from "../../../services/categoryService";
import { getAllDesignations } from "../../../services/designationService";
import { getServicesColumns } from "../../../constants/tablecolumns/ServiceColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { IService } from "../../../models/service";
import { showToast } from "../../../utils/toast";
import { Search } from "lucide-react";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import SelectField from "../../../components/common/SelectField";

export const ServiceListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [designations, setDesignations] = useState<
    { value: string; label: string }[]
  >([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const itemsPerPage = 6;

  const statusOptions = [
    { value: "", label: "All Services" },
    { value: "active", label: "Active Services" },
    { value: "blocked", label: "Blocked Services" },
  ];

  const fetchData = async () => {
    setCategoriesLoading(true);
    try {
      const [categoriesResponse, designationsResponse] = await Promise.all([
        getAllCategories(null, "admin", "", ""),
        getAllDesignations(null, "admin", "", ""),
      ]);

      if (categoriesResponse && categoriesResponse.data) {
        const categoryOptions = [
          { value: "", label: "All Categories" },
          ...categoriesResponse.data.map(
            (category: { _id: string; name: string }) => ({
              value: category._id,
              label: category.name,
            })
          ),
        ];
        setCategories(categoryOptions);
      }

      const designationsData = Array.isArray(designationsResponse)
        ? designationsResponse
        : designationsResponse.data || [];

      const designationOptions = designationsData.map(
        (designation: { _id: string; designation: string }) => ({
          value: designation._id,
          label: designation.designation,
        })
      );
      setDesignations(designationOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
      setCategories([{ value: "", label: "All Categories" }]);
      setDesignations([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    data: services,
    setData: setServices,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(
    getAllServices,
    "admin",
    searchQuery,
    filterStatus,
    itemsPerPage,
    selectedCategoryId
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("Category filter changed to:", e.target.value);
    setSelectedCategoryId(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("Status filter changed to:", e.target.value);
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
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: IService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleSubmitService = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (selectedService) {
        const response = await updateService(
          selectedService._id,
          formData,
          "admin"
        );
        if (response && services) {
          setServices(
            services.map((svc) =>
              svc._id === selectedService._id ? response.data : svc
            )
          );
          showToast({
            message: response.message,
            type: "success",
          });
        }
      } else {
        const response = await createService(formData, "admin");
        if (response && services) {
          const firstPageItems = [
            response.data,
            ...services.slice(0, itemsPerPage - 1),
          ];

          setServices(firstPageItems);

          if (currentPage !== 1) {
            setCurrentPage(1);
          }

          showToast({
            message: response.message,
            type: "success",
          });
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error(
        `Error ${selectedService ? "updating" : "creating"} service:`,
        error
      );
      showToast({
        message: `Failed to ${selectedService ? "update" : "add"} service`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (serviceId: string) => {
    try {
      const result = await toggleServiceStatus(serviceId, "admin");
      console.log("result from toggling the service status:", result);
      if (result) {
        setServices((prevServices) =>
          prevServices.map((service) =>
            service._id === serviceId
              ? { ...service, status: result.data.status }
              : service
          )
        );
      }

      showToast({
        message: result.message,
        type: "success",
      });

      return result;
    } catch (error) {
      console.error("Failed to toggle service status:", error);
      showToast({
        message: "Failed to update service status",
        type: "error",
      });
      throw error;
    }
  };

  const columns = getServicesColumns(handleStatusToggle, handleOpenEditModal);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Services</h1>
        <p className="text-gray-600">Manage and monitor services</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="w-full md:w-1/3 relative">
          <input
            type="text"
            placeholder="Search services..."
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
              value={selectedCategoryId}
              onChange={handleCategoryFilterChange}
              options={categories}
              placeholder={
                categoriesLoading
                  ? "Loading categories..."
                  : "Filter by category"
              }
              className="mb-0"
              disabled={categoriesLoading}
            />
          </div>
          <div className="w-48">
            <SelectField
              label=""
              name="statusFilter"
              value={filterStatus}
              onChange={handleStatusFilterChange}
              options={statusOptions}
              placeholder="Filter by status"
              className="mb-0"
            />
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="h-10 px-4 py-2 whitespace-nowrap"
          >
            Add Service
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-2 px-4">{error}</p>}

      <div className="px-4">
        <Table
          data={services || []}
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
        title={selectedService ? "Edit Service" : "Add Service"}
        className="max-w-2xl"
      >
        <div className="w-full">
          <AddService
            onSubmit={handleSubmitService}
            onCancel={handleCloseModal}
            isLoading={isLoading}
            initialValues={
              selectedService
                ? {
                    _id: selectedService._id,
                    serviceName: selectedService.name,
                    servicePrice: selectedService.price,
                    description: selectedService.description,
                    serviceImage: selectedService.image || null,
                    categoryId: selectedService.category?._id,
                    designationId: selectedService.designation,
                  }
                : undefined
            }
            isEditing={!!selectedService}
            categoryOptions={categories}
            designationOptions={designations}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};
