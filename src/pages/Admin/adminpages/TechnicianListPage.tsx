import { useState, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { getTechniciansColumns } from "../../../constants/tablecolumns/TechniciansColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import SelectField from "../../../components/common/SelectField";
import { Search } from "lucide-react";
import {
  getAllTechnicians,
  toggleTechnicianStatus,
} from "../../../services/technicianServices";
import { getAllDesignations } from "../../../services/designationService";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { Itechnician } from "../../../models/technician";
import { useNavigate } from "react-router-dom";

export const TechnicianListPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDesignation, setFilterDesignation] = useState<string>("");
  const [designations, setDesignations] = useState<
    { value: string; label: string }[]
  >([]);
  const [loadingDesignations, setLoadingDesignations] =
    useState<boolean>(false);

  const itemsPerPage = 6;

  const filterOptions = [
    { value: "", label: "All Technicians" },
    { value: "Active", label: "Active Technicians" },
    { value: "Blocked", label: "Blocked Technicians" },
  ];

  useEffect(() => {
    const fetchDesignations = async () => {
      setLoadingDesignations(true);
      try {
        const result = await getAllDesignations(null, "", "", null);

        if (result && result.data && Array.isArray(result.data)) {
          const designationOptions: { value: string; label: string }[] = [
            { value: "", label: "All Designations" },
            ...result.data.map(
              (designation: {
                _id: string;
                designation: string;
              }): { value: string; label: string } => ({
                value: designation._id,
                label: designation.designation,
              })
            ),
          ];
          setDesignations(designationOptions);
        } else {
          setDesignations([{ value: "", label: "All Designations" }]);
        }
      } catch (error) {
        console.error("Failed to fetch designations:", error);
        setDesignations([{ value: "", label: "All Designations" }]);
      } finally {
        setLoadingDesignations(false);
      }
    };

    fetchDesignations();
  }, []);

  const {
    data: technicians,
    setData: setTechnicians,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList<Itechnician>(
    getAllTechnicians,
    searchQuery,
    filterStatus,
    itemsPerPage,
    filterDesignation
  );

  const handleStatusToggle = async (technicianId: string) => {
    try {
      const result = await toggleTechnicianStatus(technicianId);
      console.log(
        "result of toggling the technician status from the admin side:",
        result
      );

      if (result.success) {
        setTechnicians((prevTechnicians) =>
          prevTechnicians.map((technician) =>
            technician._id === technicianId
              ? { ...technician, status: result.data.status }
              : technician
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle technician status:", error);
    }
  };

  const handleView = (technicianId: string) => {
    navigate(`/admin/technicians/${technicianId}`);
  };

  const columns = getTechniciansColumns(handleStatusToggle, handleView);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDesignationFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterDesignation(e.target.value);
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

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Technicians</h1>
        <p className="text-gray-600">
          Manage and monitor registered technicians
        </p>
      </div>

      <div className="mb-4 flex justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search technicians..."
            value={inputValue}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-5 h-5 text-gray-500 absolute right-3 top-2.5" />
        </div>

        <div className="flex gap-4">
          <div className="w-50">
            <SelectField
              label=""
              name="designationFilter"
              value={filterDesignation}
              onChange={handleDesignationFilterChange}
              options={designations}
              placeholder={
                loadingDesignations ? "Loading..." : "Filter by Designation"
              }
              className="mb-0"
              disabled={loadingDesignations}
            />
          </div>

          <div className="w-50">
            <SelectField
              label=""
              name="statusFilter"
              value={filterStatus}
              onChange={handleFilterChange}
              options={filterOptions}
              placeholder="Filter by Status"
              className="mb-0"
            />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mb-2 px-4">{error}</p>}

      <div className="px-4">
        <Table
          data={technicians || []}
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
    </AdminLayout>
  );
};
