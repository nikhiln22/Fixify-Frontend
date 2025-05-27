import { useState, useCallback, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import { getTechniciansColumns } from "../../../constants/tablecolumns/TechniciansColumn";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import SelectField from "../../../components/common/SelectField";
import { Search } from "lucide-react";
import {
  getAllTechnicians,
  toggleTechnicianStatus,
} from "../../../services/admin.services";
import { getAllDesignations } from "../../../services/common.services";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { Itechnician } from "../../../models/technician";

export const TechnicianListPage: React.FC = () => {
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
        const result = await getAllDesignations(undefined, undefined, "admin");

        if (typeof result === "object" && "data" in result) {
          const designationData = result.data || [];
          const designationOptions = [
            { value: "", label: "All Designations" },
            ...designationData.map((designation: any) => ({
              value: designation.designation,
              label: designation.designation,
            })),
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

  const fetchTechniciansWithSearch = useCallback(
    async (page: number) => {
      return await getAllTechnicians(
        page,
        searchQuery,
        filterStatus,
        filterDesignation
      );
    },
    [searchQuery, filterStatus, filterDesignation]
  );

  const {
    data: technicians,
    setData: setTechnicians,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
  } = usePaginatedList(fetchTechniciansWithSearch);

  const handleStatusToggle = async (technicianId: string) => {
    try {
      const result = await toggleTechnicianStatus(technicianId);
      console.log(
        "result of toggling the technician status from the admin side:",
        result
      );

      if (result && result.technician) {
        setTechnicians((prevTechnicians) =>
          prevTechnicians.map((technician) =>
            technician._id === technicianId ? result.technician : technician
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle technician status:", error);
    }
  };

  const handleView = (technician: Itechnician) => {
    console.log("View technician:", technician);
    // You can navigate to a detailed view or open a modal
    // Example: navigate(`/admin/technicians/${technician._id}`);
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
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Technicians</h1>
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

            <div className="w-40">
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
