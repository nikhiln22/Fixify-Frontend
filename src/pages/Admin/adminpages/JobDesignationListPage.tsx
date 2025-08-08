import { useState, useCallback, useEffect } from "react";
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
} from "../../../services/admin.services";
import { getAllDesignations } from "../../../services/common.services";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { showToast } from "../../../utils/toast";
import { Idesignation } from "../../../models/designation";
import SelectField from "../../../components/common/SelectField";

const JobDesignationPage: React.FC = () => {
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

  const fetchDesignationsWithSearch = useCallback(
    async (page: number) => {
      console.log("Fetching designations with:", {
        page,
        searchQuery,
        filterStatus,
      });
      return await getAllDesignations(page, searchQuery, "admin", filterStatus);
    },
    [searchQuery, filterStatus]
  );

  const {
    data: designations,
    setData: setDesignations,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<Idesignation>(fetchDesignationsWithSearch);

  const handleStatusToggle = async (designationId: string) => {
    try {
      const result = await toggleDesignationStatus(designationId);
      console.log("result from the job designation list page:", result);
      if (result) {
        setDesignations((prevDesignations) =>
          prevDesignations.map((designation) =>
            designation._id === designationId
              ? result.data || { ...designation, status: !designation.status }
              : designation
          )
        );

        const designation = designations.find(
          (des) => des._id === designationId
        );
        const statusLabel = designation?.status ? "blocked" : "unblocked";
        showToast({
          message: `Designation ${statusLabel} successfully`,
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
      const newDesignation = await addJobDesignation(designation);

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
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">Job Designations</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="w-full md:w-1/3 relative">
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
      </div>
      {error && <p className="text-red-500 mb-2 px-4">{error}</p>}
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

export default JobDesignationPage;
