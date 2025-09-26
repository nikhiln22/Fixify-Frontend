import React, { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import { AddPart } from "../../../components/admin/AddPart";
import {
  addPart,
  updatePart,
  togglePartStatus,
  getAllParts,
} from "../../../services/partsService";
import { getAllServices } from "../../../services/serviceService";
import { getPartsColumns } from "../../../constants/tablecolumns/PartsColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import { IPart } from "../../../models/parts";
import { showToast } from "../../../utils/toast";
import { Search } from "lucide-react";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import SelectField from "../../../components/common/SelectField";
import { AddPartFormData } from "../../../types/component.types";

export const PartListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPart, setSelectedPart] = useState<IPart | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [services, setServices] = useState<{ value: string; label: string }[]>(
    []
  );
  const [servicesLoading, setServicesLoading] = useState(false);

  const itemsPerPage = 6;

  const statusOptions = [
    { value: "", label: "All Parts" },
    { value: "Active", label: "Active Parts" },
    { value: "Blocked", label: "Blocked Parts" },
  ];

  const fetchData = async () => {
    setServicesLoading(true);
    try {
      const servicesResponse = await getAllServices(null, "", "");

      if (servicesResponse && servicesResponse.data) {
        const serviceOptions = [
          { value: "", label: "All Services" },
          ...servicesResponse.data.map(
            (service: { _id: string; name: string }) => ({
              value: service._id,
              label: service.name,
            })
          ),
        ];
        setServices(serviceOptions);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setServices([{ value: "", label: "All Services" }]);
    } finally {
      setServicesLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const {
    data: parts,
    setData: setParts,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(
    getAllParts,
    searchQuery,
    filterStatus,
    itemsPerPage,
    selectedServiceId
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleServiceFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log("Service filter changed to:", e.target.value);
    setSelectedServiceId(e.target.value);
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
    setSelectedPart(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (part: IPart) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPart(null);
  };

  const handleSubmitPart = async (formData: AddPartFormData) => {
    setIsLoading(true);
    try {
      const partData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        services: formData.services,
      };

      if (selectedPart) {
        const response = await updatePart(selectedPart._id, partData);
        console.log(
          "response in the updatePart function in the partList page:",
          response
        );
        if (response && parts) {
          setParts(
            parts.map((part) =>
              part._id === selectedPart._id
                ? { ...part, ...response.data }
                : part
            )
          );
          showToast({
            message: response.message,
            type: "success",
          });
        }
      } else {
        const response = await addPart(partData);
        console.log(
          "response in the partslist page after adding the parts:",
          response
        );
        if (response && parts) {
          const firstPageItems = [
            response.data,
            ...parts.slice(0, itemsPerPage - 1),
          ];

          setParts(firstPageItems);

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
        `Error ${selectedPart ? "updating" : "creating"} part:`,
        error
      );
      showToast({
        message: `Failed to ${selectedPart ? "update" : "add"} part`,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (partId: string) => {
    try {
      const result = await togglePartStatus(partId);
      console.log("result from toggling the part status:", result);
      if (result) {
        setParts((prevParts) =>
          prevParts.map((part) =>
            part._id === partId ? { ...part, status: result.data.status } : part
          )
        );
      }

      showToast({
        message: result.message,
        type: "success",
      });

      return result;
    } catch (error) {
      console.error("Failed to toggle part status:", error);
      showToast({
        message: "Failed to update part status",
        type: "error",
      });
      throw error;
    }
  };

  const columns = getPartsColumns(handleStatusToggle, handleOpenEditModal);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Parts</h1>
        <p className="text-gray-600">Manage and monitor parts</p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="w-full md:w-1/3 relative">
          <input
            type="text"
            placeholder="Search parts..."
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
              name="serviceFilter"
              value={selectedServiceId}
              onChange={handleServiceFilterChange}
              options={services}
              placeholder={
                servicesLoading ? "Loading services..." : "Filter by service"
              }
              className="mb-0"
              disabled={servicesLoading}
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
            Add Part
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-2 px-4">{error}</p>}

      <div className="px-4">
        <Table
          data={parts || []}
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
        title={selectedPart ? "Edit Part" : "Add Part"}
        className="max-w-2xl"
      >
        <div className="w-full">
          <AddPart
            onSubmit={handleSubmitPart}
            onCancel={handleCloseModal}
            isLoading={isLoading}
            initialValues={
              selectedPart
                ? {
                    name: selectedPart.name,
                    price: selectedPart.price.toString(),
                    description: selectedPart.description,
                    services: selectedPart.services.map((s) => s._id),
                  }
                : undefined
            }
            isEditing={!!selectedPart}
            serviceOptions={services}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};
