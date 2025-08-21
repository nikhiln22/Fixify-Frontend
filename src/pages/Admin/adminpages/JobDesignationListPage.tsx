import { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { getJobDesignationColumns } from "../../../constants/tablecolumns/jobDesignationColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Button from "../../../components/common/Button";
import Modal from "../../../components/common/Modal";
import AddDesignationForm from "../../../components/admin/AddDesignation";
import { Search } from "lucide-react";
import {
  toggleDesignationStatus,
  addJobDesignation,
  getAllDesignations,
} from "../../../services/designationService";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { showToast } from "../../../utils/toast";
import { Idesignation } from "../../../models/designation";
import SelectField from "../../../components/common/SelectField";

export const JobDesignationListPage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 6;

  const filterOptions = [
    { value: "", label: "All Designations" },
    { value: "active", label: "Active Designations" },
    { value: "blocked", label: "Blocked Designations" },
  ];

  const {
    data: designations,
    setData: setDesignations,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
  } = usePaginatedList<Idesignation>(
    getAllDesignations,
    "admin",
    searchQuery,
    filterStatus,
    itemsPerPage,
    undefined
  );

  const handleStatusToggle = async (designationId: string) => {
    try {
      const result = await toggleDesignationStatus(designationId, "admin");
      console.log("result from the job designation list page:", result);
      if (result) {
        setDesignations((prevDesignations) =>
          prevDesignations.map((designation) =>
            designation._id === designationId
              ? { ...designation, status: result.data.status }
              : designation
          )
        );

        showToast({
          message: result.message,
          type: "success",
        });
      }
    } catch (error) {
      console.error("Failed to toggle designation status:", error);
      showToast({
        message: "Failed to update designation status",
        type: "error",
      });
    }
  };

  const columns = getJobDesignationColumns(handleStatusToggle);

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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmitDesignation = async (designation: string) => {
    setIsSubmitting(true);
    try {
      const newDesignation = await addJobDesignation(designation, "admin");

      console.log(
        "added new designation in the job designation listing page:",
        newDesignation
      );

      const firstPageItems = [
        newDesignation,
        ...designations.slice(0, itemsPerPage - 1),
      ];
      setDesignations(firstPageItems);

      if (currentPage !== 1) {
        setCurrentPage(1);
      }

      showToast({
        message: "Designation added successfully",
        type: "success",
      });

      handleCloseModal();
    } catch (error) {
      console.error("Failed to add designation:", error);
      showToast({
        message: "Failed to add designation",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Job Designations
        </h1>
        <p className="text-gray-600">Manage and monitor job designations</p>
      </div>

      <div className="mb-4 flex justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search designations..."
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
              name="designationFilter"
              value={filterStatus}
              onChange={handleFilterChange}
              options={filterOptions}
              placeholder="Filter designations"
              className="mb-0"
            />
          </div>
          <Button
            onClick={handleOpenModal}
            className="h-10 px-4 py-2 whitespace-nowrap"
          >
            Add Job Designation
          </Button>
        </div>
      </div>

      <div className="px-4">
        <Table
          data={designations || []}
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
        title="Add Designation"
      >
        <div className="p-4 w-full">
          <AddDesignationForm
            onSubmit={handleSubmitDesignation}
            onCancel={handleCloseModal}
            isLoading={isSubmitting}
          />
        </div>
      </Modal>
    </AdminLayout>
  );
};
