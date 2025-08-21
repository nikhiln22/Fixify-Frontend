import React, { useState, useCallback, useEffect } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import SelectField from "../../../components/common/SelectField";
import { Search } from "lucide-react";
import { usePaginatedList } from "../../../hooks/usePaginatedList";
import { getAllSubscriptionPlansHistory } from "../../../services/adminServices";
import { getSubscriptionPlanHistoryColumns } from "../../../constants/tablecolumns/SubscriptionPlanHistoryColumn";
import Button from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";

export const SubscriptionHistory: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const navigate = useNavigate();

  const itemsPerPage = 6;

  const statusOptions = [
    { value: "", label: "All Plans" },
    { value: "active", label: "Active Plans" },
    { value: "Expired", label: "Expired Plans" },
  ];

  const fetchSubscriptionPlansHistoryWithFilters = useCallback(
    async (page: number) => {
      console.log("Fetching subscription plans with filters:", {
        page,
        searchQuery,
        filterStatus,
      });

      const result = await getAllSubscriptionPlansHistory(
        page,
        searchQuery,
        filterStatus
      );

      console.log("API Response:", result);
      return result;
    },
    [searchQuery, filterStatus]
  );

  const handleBackClick = () => {
    navigate("/admin/subscriptionplans");
  };

  const {
    data: subscriptionPlansHistory,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
  } = usePaginatedList(fetchSubscriptionPlansHistoryWithFilters);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
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

  const columns = getSubscriptionPlanHistoryColumns();

  return (
    <AdminLayout>
      <div className="p-4">
        <h1 className="text-3xl font-semibold mb-4">
          Technician Subscription History
        </h1>
        <div className="flex justify-between items-center mb-4">
          <div className="w-full md:w-1/3 relative">
            <input
              type="text"
              placeholder="Search subscription plans..."
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
                name="statusFilter"
                value={filterStatus}
                onChange={handleStatusFilterChange}
                options={statusOptions}
                placeholder="Filter by status"
                className="mb-0"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleBackClick}
              className="h-10 px-4 py-2 whitespace-nowrap"
            >
              Back to Subscription Plans
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4">
        <Table
          data={subscriptionPlansHistory || []}
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
