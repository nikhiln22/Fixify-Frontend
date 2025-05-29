import React, { useState, useCallback, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { AddService } from "../../../components/admin/AddService";
import {
  createService,
  updateService,
  toggleServiceStatus,
} from "../../../services/admin.services";
import {
  getAllServices,
  getAllCategories,
} from "../../../services/common.services";
import { getServicesColumns } from "../../../constants/tablecolumns/ServiceColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { IService } from "../../../models/service";
import { Icategory } from "../../../models/category";
import { showToast } from "../../../utils/toast";
import { Search } from "lucide-react";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import SelectField from "../../../components/common/SelectField";

export const ServiceListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<IService | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [categories, setCategories] = useState<Icategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const itemsPerPage = 6;

  const statusOptions = [
    { value: "", label: "All Services" },
    { value: "active", label: "Active Services" },
    { value: "blocked", label: "Blocked Services" },
  ];

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await getAllCategories(1, "", "admin", "active");
      if (response && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast({
        message: "Failed to load categories",
        type: "error",
      });
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((category) => ({
      value: category._id,
      label: category.name,
    })),
  ];

  const fetchServicesWithFilters = useCallback(
    async (page: number) => {
      console.log("Fetching services with filters:", {
        page,
        searchQuery,
        selectedCategoryId,
        filterStatus,
      });

      return await getAllServices(
        page,
        searchQuery,
        selectedCategoryId,
        "admin",
        filterStatus,
      );
    },
    [searchQuery, selectedCategoryId, filterStatus],
  );

  const {
    data: services,
    setData: setServices,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(fetchServicesWithFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCategoryFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    console.log("Category filter changed to:", e.target.value);
    setSelectedCategoryId(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
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
        const response = await updateService(selectedService._id, formData);
        if (response && services) {
          setServices(
            services.map((svc) =>
              svc._id === selectedService._id ? response.data : svc,
            ),
          );
          showToast({
            message: "Service updated successfully",
            type: "success",
          });
        }
      } else {
        const response = await createService(formData);
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
            message: "Service added successfully",
            type: "success",
          });
        }
      }
      handleCloseModal();
    } catch (error) {
      console.error(
        `Error ${selectedService ? "updating" : "creating"} service:`,
        error,
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
      const result = await toggleServiceStatus(serviceId);
      console.log("result from toggling the service status:", result);
      if (result) {
        setServices((prevServices) =>
          prevServices.map((service) =>
            service._id === serviceId
              ? result.data || { ...service, status: !service.status }
              : service,
          ),
        );
      }

      const service = services.find((svc) => svc._id === serviceId);
      const statusLabel = service?.status ? "blocked" : "unblocked";
      showToast({
        message: `Service ${statusLabel} successfully`,
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
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Services</h1>
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
                options={categoryOptions}
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
                  }
                : undefined
            }
            isEditing={!!selectedService}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default ServiceListPage;
